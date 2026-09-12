'use client';
import { useEffect, useState } from 'react';

/** Shows a live preview of a selected image File using an in-memory object URL, cleaned up on change/unmount. */
export function ImagePreview({ file, label }: { file: File | null; label?: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    if (!file) {
      setUrl(null);
      setDimensions(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);

    const img = new Image();
    img.onload = () => setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    img.src = objectUrl;

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (!file || !url) return null;

  return (
    <div className="mt-4 flex items-center gap-4 rounded-md border border-ink-100 p-3">
      {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview, next/image adds no value here */}
      <img src={url} alt={label ?? file.name} className="h-20 w-20 rounded-md object-cover" />
      <div className="text-sm text-ink-700">
        <p className="font-medium text-ink-950">{file.name}</p>
        {dimensions && (
          <p>
            {dimensions.width} × {dimensions.height}px
          </p>
        )}
      </div>
    </div>
  );
}
