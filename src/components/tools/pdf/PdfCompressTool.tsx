'use client';
import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Button } from '@/components/ui/Button';
import { InlineNote } from '@/components/ui/Result';
import { formatBytes, isFileSizeAllowed, MAX_UPLOAD_BYTES } from '@/lib/tools/files';

type Mode = 'lossless' | 'strong';

function yieldToBrowser(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(() => resolve());
    else setTimeout(resolve, 0);
  });
}

export function PdfCompressTool() {
  const [file, setFile] = useState<File | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [working, setWorking] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>('strong');
  const [quality, setQuality] = useState(40);

  function handleFile(list: FileList | null) {
    const f = list?.[0];
    if (!f) return;
    setError(null);
    setNotice(null);
    if (f.type !== 'application/pdf') {
      setError('Please choose a PDF file.');
      return;
    }
    if (!isFileSizeAllowed(f.size)) {
      setError(`File is larger than ${formatBytes(MAX_UPLOAD_BYTES)}.`);
      return;
    }
    setFile(f);
    setCompressedSize(null);
  }

  async function compressLossless(bytes: ArrayBuffer): Promise<Uint8Array> {
    const doc = await PDFDocument.load(bytes);
    return doc.save({ useObjectStreams: true, addDefaultPage: false, objectsPerTick: 50 });
  }

  async function compressStrong(file: File, numPages: number): Promise<Uint8Array> {
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();

    const bytes = await file.arrayBuffer();
    const srcPdf = await pdfjsLib.getDocument({ data: bytes }).promise;
    const outDoc = await PDFDocument.create();

    const q = Math.max(10, Math.min(90, quality));
    const renderScale = 0.35 + (q / 100) * 1.35;
    const MAX_EDGE = q < 35 ? 1200 : q < 55 ? 1600 : 2200;

    for (let i = 1; i <= srcPdf.numPages; i++) {
      setProgress(`Compressing page ${i} of ${numPages || srcPdf.numPages}…`);
      const page = await srcPdf.getPage(i);
      const baseVp = page.getViewport({ scale: 1 });
      let scale = renderScale;
      const longEdge = Math.max(baseVp.width, baseVp.height) * scale;
      if (longEdge > MAX_EDGE) {
        scale = MAX_EDGE / Math.max(baseVp.width, baseVp.height);
      }

      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(viewport.width));
      canvas.height = Math.max(1, Math.round(viewport.height));
      const ctx = canvas.getContext('2d', { alpha: false });
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: ctx, viewport }).promise;

        const jpegQ = Math.max(0.12, Math.min(0.88, q / 100));
        const jpegDataUrl = canvas.toDataURL('image/jpeg', jpegQ);
        const b64 = jpegDataUrl.split(',')[1] ?? '';
        const jpegBytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
        const jpgImage = await outDoc.embedJpg(jpegBytes);

        const originalViewport = page.getViewport({ scale: 1 });
        const outPage = outDoc.addPage([originalViewport.width, originalViewport.height]);
        outPage.drawImage(jpgImage, {
          x: 0,
          y: 0,
          width: originalViewport.width,
          height: originalViewport.height,
        });
      }

      page.cleanup();
      canvas.width = 0;
      canvas.height = 0;

      if (i % 3 === 0) await yieldToBrowser();
    }

    await srcPdf.destroy();
    setProgress('Finishing up…');
    return outDoc.save({ useObjectStreams: true });
  }

  async function handleCompress() {
    if (!file) return;
    setWorking(true);
    setError(null);
    setNotice(null);
    setProgress(mode === 'strong' ? 'Checking document…' : null);
    try {
      let effectiveMode = mode;
      let pageCount = 0;

      if (mode === 'strong') {
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/build/pdf.worker.min.mjs',
          import.meta.url
        ).toString();
        const bytes = await file.arrayBuffer();
        const probe = await pdfjsLib.getDocument({ data: bytes }).promise;
        pageCount = probe.numPages;
        await probe.destroy();

        const bytesPerPage = pageCount > 0 ? file.size / pageCount : file.size;
        if (bytesPerPage < 25 * 1024) {
          effectiveMode = 'lossless';
          setNotice(
            'This PDF looks text-based (very little data per page), so Strong Compression would make it larger, not smaller — used Lossless mode instead.'
          );
        } else if (pageCount > 500) {
          setProgress(`This document has ${pageCount} pages — this may take a while. Compressing…`);
        }
      }

      let compressedBytes =
        effectiveMode === 'lossless'
          ? await compressLossless(await file.arrayBuffer())
          : await compressStrong(file, pageCount);

      if (effectiveMode === 'strong' && compressedBytes.length >= file.size) {
        setNotice(
          (prev) =>
            prev ??
            'Strong Compression didn’t reduce this file’s size, so Lossless mode was used instead.'
        );
        compressedBytes = await compressLossless(await file.arrayBuffer());
      }

      setCompressedSize(compressedBytes.length);

      const blobBuffer = new ArrayBuffer(compressedBytes.byteLength);
      new Uint8Array(blobBuffer).set(compressedBytes);
      const blob = new Blob([blobBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compressed-${file.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Compression error:', err);
      setError('Could not compress this PDF. The file may be corrupted or password-protected.');
    } finally {
      setWorking(false);
      setProgress(null);
    }
  }

  const savingsPercent =
    file && compressedSize !== null
      ? Math.round((1 - compressedSize / file.size) * 100)
      : null;

  return (
    <div>
      <InlineNote>Compression happens in your browser — nothing is uploaded.</InlineNote>

      <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-ink-300 bg-ink-100/20 px-4 py-8 text-center text-sm text-ink-700 hover:border-moss-400 dark:border-ink-700 dark:bg-ink-900/30 dark:hover:border-moss-600">
        <span>{file ? `${file.name} (${formatBytes(file.size)})` : 'Click to choose a PDF file'}</span>
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files)}
        />
      </label>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant={mode === 'strong' ? 'primary' : 'secondary'}
          type="button"
          onClick={() => setMode('strong')}
        >
          Strong Compression
        </Button>
        <Button
          variant={mode === 'lossless' ? 'primary' : 'secondary'}
          type="button"
          onClick={() => setMode('lossless')}
        >
          Lossless (keep text selectable)
        </Button>
      </div>

      {mode === 'strong' ? (
        <div className="mt-3">
          <label className="text-sm font-medium text-ink-700 dark:text-ink-300">
            Quality: {quality}% (lower = much smaller file)
          </label>
          <input
            type="range"
            min="10"
            max="90"
            value={quality}
            onChange={(e) => setQuality(parseInt(e.target.value, 10))}
            className="w-full accent-primary-600"
          />
          <InlineNote>
            Best for image-heavy or scanned PDFs. Lower quality both reduces JPEG fidelity and
            downscales page resolution for larger size savings (often 70–95% smaller). Text will no
            longer be selectable afterward. For mostly-text PDFs, this tool automatically switches to
            Lossless mode instead.
          </InlineNote>
        </div>
      ) : (
        <div className="mt-3">
          <InlineNote>
            This keeps your text fully selectable and searchable with no quality loss, but the size
            reduction is small — a PDF that&apos;s already mostly text has little to compress.
          </InlineNote>
        </div>
      )}

      {notice && (
        <div className="mt-3">
          <InlineNote>{notice}</InlineNote>
        </div>
      )}
      {error && (
        <div className="mt-3">
          <InlineNote tone="warning">{error}</InlineNote>
        </div>
      )}

      {file && compressedSize !== null && (
        <div className="mt-4 p-4 rounded-lg border border-moss-100 bg-moss-100/40 dark:border-moss-800 dark:bg-moss-900/20">
          <p className="text-sm text-ink-700 dark:text-ink-300">
            Original: {formatBytes(file.size)}
          </p>
          <p className="text-sm font-medium text-moss-600 dark:text-moss-400">
            Compressed: {formatBytes(compressedSize)}
          </p>
          <p className="text-sm text-ink-700 dark:text-ink-300">
            Saved: {formatBytes(Math.max(0, file.size - compressedSize))}{' '}
            {savingsPercent !== null && savingsPercent > 0 && `(${savingsPercent}%)`}
          </p>
        </div>
      )}

      <Button type="button" className="mt-5" onClick={handleCompress} disabled={working || !file}>
        {working ? (progress ?? 'Compressing…') : 'Compress & Download'}
      </Button>
    </div>
  );
}