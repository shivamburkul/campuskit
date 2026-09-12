'use client';
import { useState } from 'react';
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';
import { Button } from '@/components/ui/Button';
import { TextField, NumberField, SelectField } from '@/components/ui/Field';
import { InlineNote } from '@/components/ui/Result';
import { formatBytes, isFileSizeAllowed, MAX_UPLOAD_BYTES } from '@/lib/tools/files';
import { PdfThumbnail } from './PdfThumbnail';

// Yields to the browser's event loop periodically during a long per-page
// loop, so the tab keeps responding to input/paint instead of looking frozen.
function yieldToBrowser(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(() => resolve());
    else setTimeout(resolve, 0);
  });
}

export function PdfWatermark() {
  const [file, setFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState(30);
  const [rotation, setRotation] = useState(45);
  const [position, setPosition] = useState('center');
  const [error, setError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);

  function handleFile(list: FileList | null) {
    const f = list?.[0];
    if (!f) return;
    setError(null);
    if (f.type !== 'application/pdf') {
      setError('Please choose a PDF file.');
      return;
    }
    if (!isFileSizeAllowed(f.size)) {
      setError(`File is larger than ${formatBytes(MAX_UPLOAD_BYTES)}.`);
      return;
    }
    setFile(f);
  }

  async function handleAddWatermark() {
    if (!file) return;
    setWorking(true);
    setError(null);
    setProgress('Loading PDF…');
    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      const pages = doc.getPages();

      // A big diagonal stamp makes sense in the center of the page, but the
      // same giant size would spill off the page edges in a corner — corner/edge
      // placements use a much smaller, fixed "stamp" size instead.
      const firstPageWidth = pages[0]?.getWidth() ?? 600;
      const isCenterPosition = position === 'center';
      let fontSize: number;
      if (isCenterPosition) {
        const widthAt80 = font.widthOfTextAtSize(watermarkText, 80);
        fontSize = Math.min(80, (firstPageWidth * 0.9 / Math.max(widthAt80, 1)) * 80);
      } else {
        fontSize = Math.min(22, firstPageWidth / 25);
      }
      const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);

      const angleDeg = ((rotation % 360) + 360) % 360;
      const angleRad = (angleDeg * Math.PI) / 180;
      const cos = Math.cos(angleRad);
      const sin = Math.sin(angleRad);

      // pdf-lib's drawText rotates the glyph run around the (x, y) anchor,
      // which is the start of the text's un-rotated baseline — not its visual
      // center. To make a position (e.g. "center", "top-right") land in the
      // right place at ANY rotation angle (not just 0°), we compute the offset
      // from the anchor to the text's visual center, rotate that offset by the
      // requested angle, and place the anchor so the rotated center lands
      // exactly on the target point. Without this, rotated text (including
      // 180°) visibly drifts away from the intended spot.
      const halfHeight = fontSize * 0.35; // approximate visual half-height of the glyphs
      const centerOffsetX = textWidth / 2;
      const centerOffsetY = halfHeight;
      const rotatedOffsetX = centerOffsetX * cos - centerOffsetY * sin;
      const rotatedOffsetY = centerOffsetX * sin + centerOffsetY * cos;

      for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
        const page = pages[pageIndex]!;
        if (pages.length > 20) setProgress(`Watermarking page ${pageIndex + 1} of ${pages.length}…`);
        const { width, height } = page.getSize();
        const insetX = Math.min(width / 2 - 10, Math.max(90, textWidth / 2 + 30));
        const insetY = Math.min(height / 2 - 10, 60);

        let targetX = width / 2;
        let targetY = height / 2;
        if (position === 'top-left') { targetX = insetX; targetY = height - insetY; }
        if (position === 'top-center') { targetX = width / 2; targetY = height - insetY; }
        if (position === 'top-right') { targetX = width - insetX; targetY = height - insetY; }
        if (position === 'middle-left') { targetX = insetX; targetY = height / 2; }
        if (position === 'center') { targetX = width / 2; targetY = height / 2; }
        if (position === 'middle-right') { targetX = width - insetX; targetY = height / 2; }
        if (position === 'bottom-left') { targetX = insetX; targetY = insetY; }
        if (position === 'bottom-center') { targetX = width / 2; targetY = insetY; }
        if (position === 'bottom-right') { targetX = width - insetX; targetY = insetY; }

        const x = targetX - rotatedOffsetX;
        const y = targetY - rotatedOffsetY;

        page.drawText(watermarkText, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0.5, 0.5, 0.5),
          opacity: opacity / 100,
          rotate: degrees(angleDeg),
        });

        // Keep the tab responsive on documents with many pages.
        if (pageIndex % 15 === 0) await yieldToBrowser();
      }

      // useObjectStreams meaningfully speeds up saving (and shrinks output) for
      // documents with many pages/objects, which is where "large PDF is slow"
      // is most noticeable.
      setProgress('Saving PDF…');
      const outBytes = await doc.save({ useObjectStreams: true, objectsPerTick: 50 });
      const blob = new Blob([outBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `watermarked-${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError('Could not add watermark to this PDF.');
    } finally {
      setWorking(false);
      setProgress(null);
    }
  }

  return (
    <div>
      <InlineNote>Add a watermark to any PDF — processed entirely in your browser.</InlineNote>

      <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-ink-300 bg-ink-100/20 px-4 py-8 text-center text-sm text-ink-700 hover:border-moss-400">
        <span>{file ? file.name : 'Click to choose a PDF file'}</span>
        <input type="file" accept="application/pdf" className="hidden" onChange={(e) => handleFile(e.target.files)} />
      </label>

      {file && (
        <div className="mt-3 flex items-center gap-3">
          <PdfThumbnail file={file} size={56} />
          <span className="text-sm text-ink-500">{formatBytes(file.size)}</span>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TextField label="Watermark Text" value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} />
        <NumberField label="Opacity (%)" value={opacity} min={5} max={100} onChange={(e) => setOpacity(parseInt(e.target.value, 10) || 30)} />
        <NumberField label="Rotation (°)" value={rotation} min={0} max={360} onChange={(e) => setRotation(parseInt(e.target.value, 10) || 45)} />
        <SelectField
          label="Position"
          value={position}
          onChange={setPosition}
          options={[
            { value: 'top-left', label: 'Top Left' },
            { value: 'top-center', label: 'Top Center' },
            { value: 'top-right', label: 'Top Right' },
            { value: 'middle-left', label: 'Middle Left' },
            { value: 'center', label: 'Center' },
            { value: 'middle-right', label: 'Middle Right' },
            { value: 'bottom-left', label: 'Bottom Left' },
            { value: 'bottom-center', label: 'Bottom Center' },
            { value: 'bottom-right', label: 'Bottom Right' },
          ]}
        />
      </div>

      <div className="mt-4">
        <InlineNote>
          Large PDFs (many pages or embedded images) take longer to process — this happens entirely in
          your browser, so processing time depends on your device.
        </InlineNote>
      </div>

      {error && <div className="mt-3"><InlineNote tone="warning">{error}</InlineNote></div>}

      <Button type="button" className="mt-5" onClick={handleAddWatermark} disabled={working || !file || !watermarkText}>
        {working ? (progress ?? 'Adding Watermark...') : 'Add Watermark & Download'}
      </Button>
    </div>
  );
}
