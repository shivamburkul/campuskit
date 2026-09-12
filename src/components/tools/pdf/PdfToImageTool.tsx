'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { InlineNote } from '@/components/ui/Result';
import { formatBytes, isFileSizeAllowed, MAX_UPLOAD_BYTES } from '@/lib/tools/files';

const ZIP_THRESHOLD = 5; // more than this many pages -> bundled as a zip instead of individual downloads

function yieldToBrowser(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(() => resolve());
    else setTimeout(resolve, 0);
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

export function PdfToImageTool() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [format, setFormat] = useState<'jpeg' | 'png'>('jpeg');
  const [failedPages, setFailedPages] = useState<number[]>([]);
  const [doneCount, setDoneCount] = useState<number | null>(null);

  function handleFile(list: FileList | null) {
    const f = list?.[0];
    if (!f) return;
    setError(null);
    setFailedPages([]);
    setDoneCount(null);
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

  async function handleConvert() {
    if (!file) return;
    setWorking(true);
    setError(null);
    setFailedPages([]);
    setDoneCount(null);
    setProgress('Loading PDF…');

    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

      const bytes = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      const pageCount = pdf.numPages;

      // Very high page counts need a lower render resolution to stay within
      // the browser's memory limits — rendering thousands of pages at print
      // quality is what causes an "Aw, Snap!" tab crash partway through.
      const scale = pageCount > 500 ? 1.0 : pageCount > 100 ? 1.5 : 2;
      const useZip = pageCount > ZIP_THRESHOLD;

      let zip: import('jszip') | null = null;
      if (useZip) {
        const JSZip = (await import('jszip')).default;
        zip = new JSZip();
      }

      const baseName = file.name.replace(/\.pdf$/i, '');
      const failed: number[] = [];
      let succeeded = 0;

      for (let i = 1; i <= pageCount; i++) {
        setProgress(`Rendering page ${i} of ${pageCount}…`);
        let canvas: HTMLCanvasElement | null = document.createElement('canvas');

        try {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale });
          canvas.width = Math.round(viewport.width);
          canvas.height = Math.round(viewport.height);
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Canvas context unavailable');

          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          await page.render({ canvasContext: ctx, viewport }).promise;

          const mimeType = `image/${format}`;
          const blob = await canvasToBlob(canvas, mimeType, format === 'jpeg' ? 0.9 : undefined);
          if (!blob || blob.size === 0) throw new Error('Empty render output');

          const fileName = `${baseName}-page-${i}.${format}`;
          if (zip) {
            zip.file(fileName, blob);
          } else {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(url);
          }
          succeeded++;

          // Release this page's resources immediately rather than waiting
          // for the whole loop to finish — holding references to hundreds of
          // rendered pages/canvases at once is what leads to memory blowups
          // and crashes on very large documents.
          page.cleanup();
        } catch (pageErr) {
          console.error(`Page ${i} failed:`, pageErr);
          failed.push(i);
        } finally {
          if (canvas) {
            canvas.width = 0;
            canvas.height = 0;
            canvas = null;
          }
        }

        if (i % 5 === 0) await yieldToBrowser();
      }

      await pdf.destroy();

      if (zip) {
        setProgress('Building zip file…');
        const zipBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${baseName}-pages.zip`;
        a.click();
        URL.revokeObjectURL(url);
      }

      setFailedPages(failed);
      setDoneCount(succeeded);
      if (succeeded === 0) {
        setError('Could not convert this PDF. It may be corrupted or password-protected.');
      }
    } catch (err) {
      console.error(err);
      setError('Could not convert this PDF. It may be corrupted or password-protected.');
    } finally {
      setWorking(false);
      setProgress(null);
    }
  }

  return (
    <div>
      <InlineNote>Convert PDF pages to images entirely in your browser — nothing is uploaded.</InlineNote>

      <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-ink-300 bg-ink-100/20 px-4 py-8 text-center text-sm text-ink-700 hover:border-moss-400 dark:border-ink-700 dark:bg-ink-900/30">
        <span>{file ? file.name : 'Click to choose a PDF file'}</span>
        <input type="file" accept="application/pdf" className="hidden" onChange={(e) => handleFile(e.target.files)} />
      </label>

      {error && <div className="mt-3"><InlineNote tone="warning">{error}</InlineNote></div>}

      {file && (
        <div className="mt-4">
          <label className="text-sm font-medium text-ink-700 dark:text-ink-300">Output Format</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as 'jpeg' | 'png')}
            className="mt-1.5 w-full rounded-md border border-ink-100 bg-surface px-3 py-2 text-sm shadow-sm focus:border-moss-500 focus:ring-1 focus:ring-moss-500 dark:bg-ink-900"
          >
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
          </select>
          <p className="mt-2 text-xs text-ink-500 dark:text-ink-400">
            More than {ZIP_THRESHOLD} pages are bundled into a single .zip file instead of downloading each
            page separately.
          </p>
        </div>
      )}

      {doneCount !== null && (
        <div className="mt-3">
          <InlineNote>
            Converted {doneCount} page{doneCount === 1 ? '' : 's'}
            {failedPages.length > 0 && ` — ${failedPages.length} page${failedPages.length === 1 ? '' : 's'} couldn't be rendered (page${failedPages.length === 1 ? '' : 's'} ${failedPages.join(', ')})`}.
          </InlineNote>
        </div>
      )}

      <Button type="button" className="mt-5" onClick={handleConvert} disabled={working || !file}>
        {working ? (progress ?? 'Converting…') : 'Convert & Download'}
      </Button>
    </div>
  );
}
