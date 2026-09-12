'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { InlineNote } from '@/components/ui/Result';
import { formatBytes, isFileSizeAllowed, isAllowedMimeType, MAX_UPLOAD_BYTES } from '@/lib/tools/files';

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];
const PREVIEW_RENDER_MAX = 900;

interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}
const FULL_RECT: CropRect = { x: 0, y: 0, width: 1, height: 1 };

type Handle = 'move' | 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w';

interface EditState {
  rotationSteps: number;
  flipH: boolean;
  flipV: boolean;
  brightness: number;
  contrast: number;
  saturation: number;
  grayscale: boolean;
  cropRect: CropRect | null;
}

const DEFAULT_STATE: EditState = {
  rotationSteps: 0,
  flipH: false,
  flipV: false,
  brightness: 100,
  contrast: 100,
  saturation: 100,
  grayscale: false,
  cropRect: null,
};

function renderEdit(
  original: HTMLCanvasElement,
  state: EditState,
  target: HTMLCanvasElement,
  options: { maxSize?: number; ignoreCrop?: boolean } = {}
) {
  const { rotationSteps, flipH, flipV, brightness, contrast, saturation, grayscale, cropRect } = state;
  const swapped = rotationSteps % 2 === 1;
  const rotatedW = swapped ? original.height : original.width;
  const rotatedH = swapped ? original.width : original.height;

  const transformed = document.createElement('canvas');
  transformed.width = rotatedW;
  transformed.height = rotatedH;
  const tctx = transformed.getContext('2d');
  if (!tctx) return;
  tctx.save();
  tctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) ${grayscale ? 'grayscale(100%)' : ''}`;
  tctx.translate(rotatedW / 2, rotatedH / 2);
  tctx.rotate((rotationSteps * 90 * Math.PI) / 180);
  tctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
  tctx.drawImage(original, -original.width / 2, -original.height / 2);
  tctx.restore();

  const rect = options.ignoreCrop ? FULL_RECT : (cropRect ?? FULL_RECT);
  const cropX = Math.round(rect.x * rotatedW);
  const cropY = Math.round(rect.y * rotatedH);
  const cropW = Math.max(1, Math.round(rect.width * rotatedW));
  const cropH = Math.max(1, Math.round(rect.height * rotatedH));

  const scale = options.maxSize ? Math.min(options.maxSize / cropW, options.maxSize / cropH, 1) : 1;
  const outW = Math.max(1, Math.round(cropW * scale));
  const outH = Math.max(1, Math.round(cropH * scale));

  target.width = outW;
  target.height = outH;
  const octx = target.getContext('2d');
  if (!octx) return;
  octx.clearRect(0, 0, outW, outH);
  octx.drawImage(transformed, cropX, cropY, cropW, cropH, 0, 0, outW, outH);
}

export function ImageEditorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageVersion, setImageVersion] = useState(0);

  const originalRef = useRef<HTMLCanvasElement | null>(null);

  const [state, setState] = useState<EditState>(DEFAULT_STATE);
  const [cropMode, setCropMode] = useState(false);
  const [draftCrop, setDraftCrop] = useState<CropRect>({ x: 0.1, y: 0.1, width: 0.8, height: 0.8 });
  const dragState = useRef<{ handle: Handle; startX: number; startY: number; startCrop: CropRect } | null>(null);

  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const previewWrapRef = useRef<HTMLDivElement>(null);
  const [previewCssSize, setPreviewCssSize] = useState({ width: 0, height: 0 });

  function loadImageIntoSource(img: HTMLImageElement) {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(img, 0, 0);
    originalRef.current = canvas;
    setImageVersion((v) => v + 1);
  }

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
    originalRef.current = null;
    setState(DEFAULT_STATE);
    setCropMode(false);
    setFile(f);
    setPreviewCssSize({ width: 0, height: 0 });

    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      loadImageIntoSource(img);
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setError('Could not load this image.');
      setFile(null);
    };
    img.src = url;
  }

  const renderPreview = useCallback(() => {
    const original = originalRef.current;
    const canvas = previewCanvasRef.current;
    if (!original || !canvas) return;
    renderEdit(original, state, canvas, { maxSize: PREVIEW_RENDER_MAX, ignoreCrop: cropMode });

    const cssWidth = previewWrapRef.current?.clientWidth || canvas.width;
    const aspect = canvas.height / canvas.width;
    setPreviewCssSize({ width: cssWidth, height: Math.round(cssWidth * aspect) });
  }, [state, cropMode, imageVersion]);

  useEffect(() => {
    renderPreview();
  }, [renderPreview]);

  useEffect(() => {
    function onResize() {
      renderPreview();
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [renderPreview]);

  function enterCropMode() {
    setDraftCrop(state.cropRect ?? { x: 0.1, y: 0.1, width: 0.8, height: 0.8 });
    setCropMode(true);
  }

  function applyCrop() {
    setState((s) => ({ ...s, cropRect: draftCrop }));
    setCropMode(false);
  }

  function cancelCropMode() {
    setCropMode(false);
  }

  function handleReset() {
    setState(DEFAULT_STATE);
    setCropMode(false);
  }

  function startDrag(handle: Handle) {
    return (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragState.current = { handle, startX: e.clientX, startY: e.clientY, startCrop: draftCrop };
      (e.target as Element).setPointerCapture?.(e.pointerId);
    };
  }

  function onDragMove(e: React.PointerEvent) {
    const dragging = dragState.current;
    if (!dragging || !previewCssSize.width || !previewCssSize.height) return;
    const dx = (e.clientX - dragging.startX) / previewCssSize.width;
    const dy = (e.clientY - dragging.startY) / previewCssSize.height;
    let { x, y, width, height } = dragging.startCrop;

    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
    const MIN = 0.05;

    if (dragging.handle === 'move') {
      x = clamp01(x + dx);
      y = clamp01(y + dy);
      x = Math.min(x, 1 - width);
      y = Math.min(y, 1 - height);
    } else {
      if (dragging.handle.includes('w')) {
        const nx = clamp01(x + dx);
        width = width + (x - nx);
        x = nx;
      }
      if (dragging.handle.includes('e')) {
        width = clamp01(x + width + dx) - x;
      }
      if (dragging.handle.includes('n')) {
        const ny = clamp01(y + dy);
        height = height + (y - ny);
        y = ny;
      }
      if (dragging.handle.includes('s')) {
        height = clamp01(y + height + dy) - y;
      }
      width = Math.max(MIN, width);
      height = Math.max(MIN, height);
    }
    setDraftCrop({ x, y, width, height });
  }

  function endDrag() {
    dragState.current = null;
  }

  function handleDownload() {
    const original = originalRef.current;
    if (!original) return;
    const outCanvas = document.createElement('canvas');
    renderEdit(original, state, outCanvas, {});
    const dataUrl = outCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `edited-${file?.name?.replace(/\.[^/.]+$/, '') || 'image'}.png`;
    a.click();
  }

  const handleClasses = 'absolute h-4 w-4 rounded-full border-2 border-primary-600 bg-white shadow';
  const hasEdits = cropMode
    ? false
    : JSON.stringify(state) !== JSON.stringify(DEFAULT_STATE);

  return (
    <div>
      <InlineNote>
        Edit images in your browser — nothing is uploaded. Crop, rotate, flip, and adjust, then
        download once at the end.
      </InlineNote>

      <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-ink-300 bg-ink-100/20 px-4 py-8 text-center text-sm text-ink-700 hover:border-moss-400">
        <span>{file ? file.name : 'Click to choose an image'}</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleFile(e.target.files)}
        />
      </label>

      {error && (
        <div className="mt-3">
          <InlineNote tone="warning">{error}</InlineNote>
        </div>
      )}

      {file && originalRef.current && (
        <>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setState((s) => ({ ...s, rotationSteps: (s.rotationSteps + 1) % 4 }))}
            >
              Rotate 90°
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={() => setState((s) => ({ ...s, flipH: !s.flipH }))}
            >
              Flip Horizontal
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={() => setState((s) => ({ ...s, flipV: !s.flipV }))}
            >
              Flip Vertical
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={() => setState((s) => ({ ...s, grayscale: !s.grayscale }))}
            >
              {state.grayscale ? 'Color' : 'Grayscale'}
            </Button>
            <Button
              variant={cropMode ? 'primary' : 'secondary'}
              type="button"
              onClick={cropMode ? cancelCropMode : enterCropMode}
            >
              {cropMode ? 'Cancel Crop' : state.cropRect ? 'Adjust Crop' : 'Crop'}
            </Button>
            {hasEdits && (
              <Button variant="ghost" type="button" onClick={handleReset}>
                Reset
              </Button>
            )}
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <label className="text-sm font-medium text-ink-700 dark:text-ink-300">
                Brightness: {state.brightness}%
              </label>
              <input
                type="range"
                min="20"
                max="200"
                value={state.brightness}
                onChange={(e) =>
                  setState((s) => ({ ...s, brightness: parseInt(e.target.value, 10) }))
                }
                className="w-full accent-primary-600"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink-700 dark:text-ink-300">
                Contrast: {state.contrast}%
              </label>
              <input
                type="range"
                min="20"
                max="200"
                value={state.contrast}
                onChange={(e) =>
                  setState((s) => ({ ...s, contrast: parseInt(e.target.value, 10) }))
                }
                className="w-full accent-primary-600"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink-700 dark:text-ink-300">
                Saturation: {state.saturation}%
              </label>
              <input
                type="range"
                min="0"
                max="200"
                value={state.saturation}
                onChange={(e) =>
                  setState((s) => ({ ...s, saturation: parseInt(e.target.value, 10) }))
                }
                className="w-full accent-primary-600"
              />
            </div>
          </div>

          <div
            ref={previewWrapRef}
            className="mt-4 relative mx-auto w-full max-w-3xl overflow-hidden rounded-lg border border-ink-200 bg-ink-50 dark:border-ink-700 dark:bg-ink-900"
            onPointerMove={onDragMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            onPointerCancel={endDrag}
          >
            <div className="relative w-full" style={{ height: previewCssSize.height || 'auto' }}>
              <canvas
                ref={previewCanvasRef}
                className="block w-full h-auto max-w-full"
                style={{
                  width: previewCssSize.width ? `${previewCssSize.width}px` : '100%',
                  height: previewCssSize.height ? `${previewCssSize.height}px` : 'auto',
                }}
              />
              {cropMode && (
                <>
                  <div
                    className="pointer-events-none absolute inset-0 bg-black/45"
                    style={{
                      clipPath: `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, ${draftCrop.x * 100}% ${draftCrop.y * 100}%, ${draftCrop.x * 100}% ${(draftCrop.y + draftCrop.height) * 100}%, ${(draftCrop.x + draftCrop.width) * 100}% ${(draftCrop.y + draftCrop.height) * 100}%, ${(draftCrop.x + draftCrop.width) * 100}% ${draftCrop.y * 100}%, ${draftCrop.x * 100}% ${draftCrop.y * 100}%, 0% 0%)`,
                    }}
                  />
                  <div
                    className="absolute cursor-move border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.4)]"
                    style={{
                      left: `${draftCrop.x * 100}%`,
                      top: `${draftCrop.y * 100}%`,
                      width: `${draftCrop.width * 100}%`,
                      height: `${draftCrop.height * 100}%`,
                    }}
                    onPointerDown={startDrag('move')}
                  >
                    {(['nw', 'ne', 'sw', 'se'] as Handle[]).map((h) => {
                      const cornerClasses: Record<string, string> = {
                        nw: '-top-2 -left-2 cursor-nw-resize',
                        ne: '-top-2 -right-2 cursor-ne-resize',
                        sw: '-bottom-2 -left-2 cursor-sw-resize',
                        se: '-bottom-2 -right-2 cursor-se-resize',
                      };
                      return (
                        <div
                          key={h}
                          onPointerDown={startDrag(h)}
                          className={`${handleClasses} ${cornerClasses[h]}`}
                        />
                      );
                    })}
                    {(['n', 's', 'e', 'w'] as Handle[]).map((h) => (
                      <div
                        key={h}
                        onPointerDown={startDrag(h)}
                        className={`${handleClasses} ${
                          h === 'n'
                            ? '-top-2 left-1/2 -translate-x-1/2 cursor-n-resize'
                            : h === 's'
                              ? '-bottom-2 left-1/2 -translate-x-1/2 cursor-s-resize'
                              : h === 'e'
                                ? '-right-2 top-1/2 -translate-y-1/2 cursor-e-resize'
                                : '-left-2 top-1/2 -translate-y-1/2 cursor-w-resize'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {cropMode && (
            <div className="mt-3 flex flex-wrap gap-2">
              <Button type="button" onClick={applyCrop}>
                Apply Crop
              </Button>
              <Button variant="secondary" type="button" onClick={() => setDraftCrop(FULL_RECT)}>
                Reset to Full Image
              </Button>
            </div>
          )}

          {!cropMode && (
            <Button type="button" className="mt-5" onClick={handleDownload}>
              Download Edited Image
            </Button>
          )}
        </>
      )}
    </div>
  );
}