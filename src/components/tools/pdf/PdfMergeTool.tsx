'use client';
import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Button } from '@/components/ui/Button';
import { InlineNote } from '@/components/ui/Result';
import { formatBytes, isFileSizeAllowed, MAX_UPLOAD_BYTES } from '@/lib/tools/files';
import { PdfThumbnail } from './PdfThumbnail';

export function PdfMergeTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  function handleFiles(list: FileList | null) {
    if (!list) return;
    setError(null);
    const next: File[] = [];
    for (const file of Array.from(list)) {
      if (file.type !== 'application/pdf') {
        setError(`${file.name} isn't a PDF file.`);
        continue;
      }
      if (!isFileSizeAllowed(file.size)) {
        setError(`${file.name} is larger than ${formatBytes(MAX_UPLOAD_BYTES)}.`);
        continue;
      }
      next.push(file);
    }
    setFiles((prev) => [...prev, ...next]);
  }

  function moveFile(index: number, direction: -1 | 1) {
    setFiles((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target]!, next[index]!];
      return next;
    });
  }

  async function handleMerge() {
    if (files.length < 2) {
      setError('Add at least two PDF files to merge.');
      return;
    }
    setWorking(true);
    setError(null);
    try {
      const merged = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }
      const mergedBytes = await merged.save();
      const blob = new Blob([mergedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'campuskit-merged.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError('Could not merge these files — one of them may be corrupted or password-protected.');
    } finally {
      setWorking(false);
    }
  }

  return (
    <div>
      <InlineNote>Files are merged entirely in your browser using pdf-lib — nothing is uploaded to a server.</InlineNote>

      <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-ink-300 bg-ink-100/20 px-4 py-8 text-center text-sm text-ink-700 hover:border-moss-400">
        <span>Click to add PDF files, or drop them here</span>
        <input type="file" accept="application/pdf" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      </label>

      {error && <div className="mt-3"><InlineNote tone="warning">{error}</InlineNote></div>}

      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((file, i) => (
            <li key={`${file.name}-${i}`} className="flex items-center gap-3 rounded-md border border-ink-100 px-3 py-2 text-sm">
              <PdfThumbnail file={file} size={44} />
              <span className="min-w-0 flex-1 truncate text-ink-900">{i + 1}. {file.name} <span className="text-ink-500">({formatBytes(file.size)})</span></span>
              <span className="flex shrink-0 gap-1">
                <Button variant="ghost" type="button" onClick={() => moveFile(i, -1)} disabled={i === 0}>↑</Button>
                <Button variant="ghost" type="button" onClick={() => moveFile(i, 1)} disabled={i === files.length - 1}>↓</Button>
                <Button variant="ghost" type="button" onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}>Remove</Button>
              </span>
            </li>
          ))}
        </ul>
      )}

      <Button type="button" className="mt-5" onClick={handleMerge} disabled={working || files.length < 2}>
        {working ? 'Merging…' : 'Merge & download'}
      </Button>
    </div>
  );
}
