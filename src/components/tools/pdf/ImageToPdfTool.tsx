'use client';
import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Button } from '@/components/ui/Button';
import { InlineNote } from '@/components/ui/Result';
import { formatBytes, isFileSizeAllowed, isAllowedMimeType, MAX_UPLOAD_BYTES } from '@/lib/tools/files';

const ALLOWED = ['image/jpeg', 'image/png'];

export function ImageToPdfTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  function handleFiles(list: FileList | null) {
    if (!list) return;
    setError(null);
    const next: File[] = [];
    for (const file of Array.from(list)) {
      if (!isAllowedMimeType(file.type, ALLOWED)) {
        setError(`${file.name} must be a JPG or PNG.`);
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

  async function handleConvert() {
    if (files.length === 0) return;
    setWorking(true);
    setError(null);
    try {
      const pdf = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const image = file.type === 'image/png' ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
        const page = pdf.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      }
      const outBytes = await pdf.save();
      const blob = new Blob([outBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'campuskit-images.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError('Could not convert one of these images.');
    } finally {
      setWorking(false);
    }
  }

  return (
    <div>
      <InlineNote>Conversion happens entirely in your browser.</InlineNote>
      <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-ink-300 bg-ink-100/20 px-4 py-8 text-center text-sm text-ink-700 hover:border-moss-400">
        <span>Click to add JPG/PNG images (one page per image, in order)</span>
        <input type="file" accept="image/jpeg,image/png" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      </label>
      {error && <div className="mt-3"><InlineNote tone="warning">{error}</InlineNote></div>}
      {files.length > 0 && (
        <ul className="mt-4 space-y-1 text-sm text-ink-700">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`}>{i + 1}. {f.name} ({formatBytes(f.size)})</li>
          ))}
        </ul>
      )}
      <Button type="button" className="mt-5" onClick={handleConvert} disabled={working || files.length === 0}>
        {working ? 'Converting…' : 'Convert & download PDF'}
      </Button>
    </div>
  );
}
