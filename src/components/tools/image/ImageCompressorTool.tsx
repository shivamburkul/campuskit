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
    try {
      const img = await loadImage(file);
      const canvas = canvasRef.current;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('canvas unavailable');
      ctx.drawImage(img, 0, 0);

      const targetBytes = targetKb * 1024;
      let quality = estimateInitialQuality(file.size, targetBytes);
      let blob = await canvasToBlob(canvas, quality, outputFormat);
      let attempts = 0;

      while (blob && blob.size > targetBytes && quality > 0.1 && attempts < 8) {
        quality = Math.max(0.1, quality - 0.1);
        blob = await canvasToBlob(canvas, quality, outputFormat);
        attempts++;
      }

      if (!blob) throw new Error('encode failed');
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
          <Button variant="secondary" type="button" className="mt-3" onClick={handleDownload}>Download</Button>
        </div>
      )}
    </div>
  );
}