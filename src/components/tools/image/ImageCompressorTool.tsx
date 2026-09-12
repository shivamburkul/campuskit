'use client';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { NumberField } from '@/components/ui/Field';
import { InlineNote, ResultStat } from '@/components/ui/Result';
import { formatBytes, isFileSizeAllowed, isAllowedMimeType, MAX_UPLOAD_BYTES, estimateInitialQuality } from '@/lib/tools/files';
import { ImagePreview } from './ImagePreview';

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

async function loadImage(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number, mimeType: string): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, mimeType, quality));
}

export function ImageCompressorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [targetKb, setTargetKb] = useState(200);
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/webp'>('image/jpeg');
  const [error, setError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);
  const [outputInfo, setOutputInfo] = useState<{ blob: Blob; quality: number } | null>(null);
  const [downscaled, setDownscaled] = useState(false);
  const [outputDimensions, setOutputDimensions] = useState<{ width: number; height: number; original: { width: number; height: number } } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function handleFile(list: FileList | null) {
    const f = list?.[0];
    if (!f) return;
    setError(null);
    setOutputInfo(null);
    if (!isAllowedMimeType(f.type, ALLOWED)) {
      setError('Please choose a JPG, PNG, or WebP image.');
      return;
    }
    if (!isFileSizeAllowed(f.size)) {
      setError(`File is larger than ${formatBytes(MAX_UPLOAD_BYTES)}.`);
      return;
    }
    setFile(f);
  }

  async function handleCompress() {
    if (!file || !canvasRef.current) return;
    setWorking(true);
    setError(null);
    setDownscaled(false);
    try {
      const img = await loadImage(file);
      const canvas = canvasRef.current;
      let width = img.naturalWidth;
      let height = img.naturalHeight;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('canvas unavailable');
      ctx.drawImage(img, 0, 0, width, height);

      const targetBytes = targetKb * 1024;
      // Below this quality, JPEG/WebP artifacts become visibly blocky —
      // rather than crushing quality further to hit an aggressive target
      // size, it's better to reduce the actual pixel dimensions instead,
      // which keeps the image looking clean at a smaller size.
      const QUALITY_FLOOR = 0.5;

      let quality = estimateInitialQuality(file.size, targetBytes);
      let blob = await canvasToBlob(canvas, quality, outputFormat);
      let attempts = 0;

      while (blob && blob.size > targetBytes && quality > QUALITY_FLOOR && attempts < 6) {
        quality = Math.max(QUALITY_FLOOR, quality - 0.1);
        blob = await canvasToBlob(canvas, quality, outputFormat);
        attempts++;
      }

      // Quality alone couldn't reach the target without going below the
      // floor — progressively shrink the image dimensions instead.
      let resizeAttempts = 0;
      let didDownscale = false;
      while (blob && blob.size > targetBytes && resizeAttempts < 6 && width > 100 && height > 100) {
        width = Math.round(width * 0.85);
        height = Math.round(height * 0.85);
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        quality = Math.max(quality, 0.7); // dimensions are shrinking now, so quality can recover
        blob = await canvasToBlob(canvas, quality, outputFormat);
        resizeAttempts++;
        didDownscale = true;
      }

      if (!blob) throw new Error('encode failed');
      setDownscaled(didDownscale);
      setOutputDimensions({ width, height, original: { width: img.naturalWidth, height: img.naturalHeight } });
      setOutputInfo({ blob, quality });
    } catch {
      setError('Could not compress this image.');
    } finally {
      setWorking(false);
    }
  }

  function handleDownload() {
    if (!outputInfo) return;
    const url = URL.createObjectURL(outputInfo.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campuskit-compressed.${outputFormat === 'image/webp' ? 'webp' : 'jpg'}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <InlineNote>Compression happens entirely in your browser using the Canvas API — nothing is uploaded.</InlineNote>
      <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-ink-300 bg-ink-100/20 px-4 py-8 text-center text-sm text-ink-700 hover:border-moss-400">
        <span>{file ? `${file.name} (${formatBytes(file.size)})` : 'Click to choose a JPG, PNG, or WebP image'}</span>
        <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => handleFile(e.target.files)} />
      </label>
      {error && <div className="mt-3"><InlineNote tone="warning">{error}</InlineNote></div>}
      <ImagePreview file={file} />

      <div className="mt-4 flex flex-wrap items-end gap-4">
        <NumberField label="Target size (KB)" value={targetKb} min={10} onChange={(e) => setTargetKb(parseInt(e.target.value, 10) || 10)} />
        <div>
          <label className="text-sm font-medium text-ink-700">Output format</label>
          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value as 'image/jpeg' | 'image/webp')}
            className="mt-1.5 block w-full rounded-md border border-ink-100 bg-surface px-3 py-2 text-sm shadow-sm focus:border-moss-500 focus:ring-1 focus:ring-moss-500"
          >
            <option value="image/jpeg">JPEG</option>
            <option value="image/webp">WebP</option>
          </select>
        </div>
        <Button type="button" onClick={handleCompress} disabled={!file || working}>
          {working ? 'Compressing…' : 'Compress'}
        </Button>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {outputInfo && (
        <div className="mt-5 rounded-lg border border-moss-100 bg-moss-100/40 p-5">
          <ResultStat label="Original size" value={formatBytes(file!.size)} />
          <ResultStat label="Compressed size" value={formatBytes(outputInfo.blob.size)} emphasis />
          <ResultStat label="Quality used" value={`${Math.round(outputInfo.quality * 100)}%`} />
          {downscaled && outputDimensions && (
            <ResultStat
              label="Dimensions"
              value={`${outputDimensions.original.width}×${outputDimensions.original.height} → ${outputDimensions.width}×${outputDimensions.height}`}
            />
          )}
          {downscaled && (
            <InlineNote>
              Your target size was too small to reach at good quality, so the image dimensions were reduced
              instead of degrading quality further — this keeps the image looking clean rather than pixelated.
              Increase the target size if you&apos;d like to keep the original dimensions.
            </InlineNote>
          )}
          <Button variant="secondary" type="button" className="mt-3" onClick={handleDownload}>Download</Button>
        </div>
      )}
    </div>
  );
}
