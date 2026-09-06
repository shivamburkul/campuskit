'use client';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { NumberField } from '@/components/ui/Field';
import { InlineNote } from '@/components/ui/Result';
import { formatBytes, isFileSizeAllowed, isAllowedMimeType, MAX_UPLOAD_BYTES } from '@/lib/tools/files';
import { ImagePreview } from './ImagePreview';

const ALLOWED = ['image/jpeg', 'image/png'];
const PRESETS = [
  { label: 'Passport photo (413×531)', width: 413, height: 531 },
  { label: 'Signature (140×60)', width: 140, height: 60 },
  { label: 'Square (500×500)', width: 500, height: 500 },
];

export function ImageResizerTool() {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState(413);
  const [height, setHeight] = useState(531);
  const [keepAspect, setKeepAspect] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const aspectRef = useRef<number>(413 / 531);

  function handleFile(list: FileList | null) {
    const f = list?.[0];
    if (!f) return;
    setError(null);
    if (!isAllowedMimeType(f.type, ALLOWED)) {
      setError('Please choose a JPG or PNG image.');
      return;
    }
    if (!isFileSizeAllowed(f.size)) {
      setError(`File is larger than ${formatBytes(MAX_UPLOAD_BYTES)}.`);
      return;
    }
    setFile(f);
  }

  async function handleResize() {
    if (!file || !canvasRef.current) return;
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      img.src = url;
      await img.decode();
      const canvas = canvasRef.current;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const dlUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = dlUrl;
        a.download = `campuskit-resized.${file.type === 'image/png' ? 'png' : 'jpg'}`;
        a.click();
        URL.revokeObjectURL(dlUrl);
      }, file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.92);
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  function handleWidthChange(next: number) {
    setWidth(next);
    if (keepAspect) setHeight(Math.round(next / aspectRef.current));
  }
  function handleHeightChange(next: number) {
    setHeight(next);
    if (keepAspect) setWidth(Math.round(next * aspectRef.current));
  }

  return (
    <div>
      <InlineNote>Resizing happens entirely in your browser using the Canvas API.</InlineNote>
      <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-ink-300 bg-ink-100/20 px-4 py-8 text-center text-sm text-ink-700 hover:border-moss-400">
        <span>{file ? file.name : 'Click to choose a JPG or PNG image'}</span>
        <input type="file" accept="image/jpeg,image/png" className="hidden" onChange={(e) => handleFile(e.target.files)} />
      </label>
      {error && <div className="mt-3"><InlineNote tone="warning">{error}</InlineNote></div>}
      <ImagePreview file={file} />

      <div className="mt-4 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <Button
            key={p.label}
            variant="secondary"
            type="button"
            onClick={() => {
              aspectRef.current = p.width / p.height;
              setWidth(p.width);
              setHeight(p.height);
            }}
          >
            {p.label}
          </Button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <NumberField label="Width (px)" value={width} min={1} onChange={(e) => handleWidthChange(parseInt(e.target.value, 10) || 1)} />
        <NumberField label="Height (px)" value={height} min={1} onChange={(e) => handleHeightChange(parseInt(e.target.value, 10) || 1)} />
      </div>
      <label className="mt-2 flex items-center gap-2 text-sm text-ink-700">
        <input type="checkbox" checked={keepAspect} onChange={(e) => setKeepAspect(e.target.checked)} /> Lock aspect ratio to width
      </label>

      <canvas ref={canvasRef} className="hidden" />
      <Button type="button" className="mt-5" onClick={handleResize} disabled={!file}>Resize & download</Button>
    </div>
  );
}
