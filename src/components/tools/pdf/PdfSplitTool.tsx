'use client';
import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { TextField } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { InlineNote } from '@/components/ui/Result';
import { formatBytes, isFileSizeAllowed, MAX_UPLOAD_BYTES, parsePageRange } from '@/lib/tools/files';
import { PdfThumbnail } from './PdfThumbnail';

export function PdfSplitTool() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [range, setRange] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  async function handleFile(list: FileList | null) {
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
    try {
      const bytes = await f.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      setFile(f);
      setTotalPages(doc.getPageCount());
    } catch {
      setError('Could not read this PDF — it may be corrupted or password-protected.');
    }
  }

  async function handleSplit() {
    if (!file || totalPages === null) return;
    const { pages, error: rangeError } = parsePageRange(range, totalPages);
    if (rangeError) {
      setError(rangeError);
      return;
    }
    setWorking(true);
    setError(null);
    try {
      const bytes = await file.arrayBuffer();
      const source = await PDFDocument.load(bytes);
      const out = await PDFDocument.create();
      const copied = await out.copyPages(source, pages.map((p) => p - 1));
      copied.forEach((p) => out.addPage(p));
      const outBytes = await out.save();
      const blob = new Blob([outBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'campuskit-split.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError('Something went wrong while splitting this file.');
    } finally {
      setWorking(false);
    }
  }

  return (
    <div>
      <InlineNote>Splitting happens entirely in your browser — the file never leaves your device.</InlineNote>
      <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-ink-300 bg-ink-100/20 px-4 py-8 text-center text-sm text-ink-700 hover:border-moss-400">
        <span>{file ? file.name : 'Click to choose a PDF file'}</span>
        <input type="file" accept="application/pdf" className="hidden" onChange={(e) => handleFile(e.target.files)} />
      </label>
      {file && totalPages !== null && (
        <div className="mt-3 flex items-center gap-3">
          <PdfThumbnail file={file} size={56} />
          <p className="text-sm text-ink-500">{totalPages} page{totalPages === 1 ? '' : 's'} detected.</p>
        </div>
      )}
      {error && <div className="mt-3"><InlineNote tone="warning">{error}</InlineNote></div>}
      <div className="mt-4">
        <TextField label="Pages to extract" value={range} onChange={(e) => setRange(e.target.value)} hint="e.g. 1-3 or 1,4,7-9" />
      </div>
      <Button type="button" className="mt-5" onClick={handleSplit} disabled={working || !file}>
        {working ? 'Splitting…' : 'Extract & download'}
      </Button>
    </div>
  );
}
