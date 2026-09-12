'use client';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { InlineNote } from '@/components/ui/Result';
import { formatBytes, isFileSizeAllowed, isAllowedMimeType, MAX_UPLOAD_BYTES } from '@/lib/tools/files';
import { ImagePreview } from './ImagePreview';

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

export function ImageColorPicker() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pickedColor, setPickedColor] = useState<{ hex: string; rgb: string; hsl: string } | null>(null);
  const [pixelPosition, setPixelPosition] = useState<{ x: number; y: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  function handleFile(list: FileList | null) {
    const f = list?.[0];
    if (!f) return;
    setError(null);
    if (!isAllowedMimeType(f.type, ALLOWED)) {
      setError('Please choose a JPG, PNG, or WebP image.');
      return;
    }
    if (!isFileSizeAllowed(f.size)) {
      setError(`File is larger than ${formatBytes(MAX_UPLOAD_BYTES)}.`);
      return;
    }
    setFile(f);
    setPickedColor(null);
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      URL.revokeObjectURL(url);
      loadToCanvas();
    };
    img.src = url;
  }

  function loadToCanvas() {
    const img = imageRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);
  }

  function handleCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const r = pixel[0] ?? 0;
    const g = pixel[1] ?? 0;
    const b = pixel[2] ?? 0;

    // Convert to hex
    const hex = `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')}`;

    // Convert to HSL
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
        case gNorm: h = (bNorm - rNorm) / d + 2; break;
        default: h = (rNorm - gNorm) / d + 4;
      }
      h /= 6;
    }

    setPickedColor({
      hex,
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
    });
    setPixelPosition({ x, y });
  }

  async function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `color-source-${file?.name || 'image'}`;
    a.click();
  }

  return (
    <div>
      <InlineNote>Click anywhere on the image to pick a color and get its HEX/RGB/HSL values.</InlineNote>

      <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-ink-300 bg-ink-100/20 px-4 py-8 text-center text-sm text-ink-700 hover:border-moss-400">
        <span>{file ? file.name : 'Click to choose an image'}</span>
        <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => handleFile(e.target.files)} />
      </label>

      {error && <div className="mt-3"><InlineNote tone="warning">{error}</InlineNote></div>}

      {file && (
        <div className="mt-4">
          <div className="rounded-md border border-ink-100">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="w-full h-auto cursor-crosshair"
            />
          </div>

          {pickedColor && (
            <div className="mt-4 p-4 rounded-lg border border-ink-200 bg-surface">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-md border border-ink-200"
                  style={{ backgroundColor: pickedColor.hex }}
                />
                <div className="space-y-1">
                  <p className="font-mono text-sm text-ink-900 dark:text-ink-50">HEX: {pickedColor.hex}</p>
                  <p className="font-mono text-sm text-ink-700 dark:text-ink-300">RGB: {pickedColor.rgb}</p>
                  <p className="font-mono text-sm text-ink-700 dark:text-ink-300">HSL: {pickedColor.hsl}</p>
                </div>
              </div>
              <p className="mt-2 text-xs text-ink-500">
                Pixel: {pixelPosition?.x}, {pixelPosition?.y}
              </p>
              <Button
                variant="secondary"
                type="button"
                className="mt-3"
                onClick={() => navigator.clipboard.writeText(pickedColor.hex)}
              >
                Copy HEX
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
