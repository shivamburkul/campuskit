'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { SelectField } from '@/components/ui/Field';
import { InlineNote } from '@/components/ui/Result';
import { formatBytes, isFileSizeAllowed, isAllowedMimeType, MAX_UPLOAD_BYTES } from '@/lib/tools/files';
import { ImagePreview } from './ImagePreview';

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

export function ImageFormatConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [target, setTarget] = useState('image/png');
  const [error, setError] = useState<string | null>(null);

  function handleFile(list: FileList | null) {
    const f = list?.[0];
    if (!f) return;
    setError(null);
    if (!isAllowedMimeType(f.type, ALLOWED)) {
      setError('Please choose a JPG, PNG or WebP image.');
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
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      img.src = url;
      await img.decode();
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      if (target === 'image/jpeg') {
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const ext = target === 'image/jpeg' ? 'jpg' : target === 'image/webp' ? 'webp' : 'png';
        const dlUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = dlUrl;
        a.download = `campuskit-converted.${ext}`;
        a.click();
        URL.revokeObjectURL(dlUrl);
      }, target, 0.92);
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  return (
    <div>
      <InlineNote>Conversion happens entirely in your browser.</InlineNote>
      <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-ink-300 bg-ink-100/20 px-4 py-8 text-center text-sm text-ink-700 hover:border-moss-400">
        <span>{file ? file.name : 'Click to choose a JPG, PNG or WebP image'}</span>
        <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => handleFile(e.target.files)} />
      </label>
      {error && <div className="mt-3"><InlineNote tone="warning">{error}</InlineNote></div>}
      <ImagePreview file={file} />
      <div className="mt-4 max-w-xs">
        <SelectField
          label="Convert to"
          value={target}
          onChange={setTarget}
          options={[
            { value: 'image/png', label: 'PNG' },
            { value: 'image/jpeg', label: 'JPG' },
            { value: 'image/webp', label: 'WebP' },
          ]}
        />
      </div>
      <Button type="button" className="mt-5" onClick={handleConvert} disabled={!file}>Convert & download</Button>
    </div>
  );
}
