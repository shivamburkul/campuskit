'use client';
import { useEffect, useState } from 'react';
import { renderPdfThumbnail } from '@/lib/tools/pdf-thumbnail';

export function PdfThumbnail({ file, size = 56 }: { file: File; size?: number }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setDataUrl(null);
    setFailed(false);
    renderPdfThumbnail(file, size * 2)
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [file, size]);

  if (failed) {
    return (
      <div
        className="flex shrink-0 items-center justify-center rounded border border-ink-100 bg-ink-100/30 text-[10px] text-ink-500"
        style={{ width: size, height: size * 1.3 }}
      >
        PDF
      </div>
    );
  }

  if (!dataUrl) {
    return <div className="shrink-0 animate-pulse rounded border border-ink-100 bg-ink-100/40" style={{ width: size, height: size * 1.3 }} aria-hidden="true" />;
  }

  // eslint-disable-next-line @next/next/no-img-element -- locally rendered canvas data URL, not a remote image
  return <img src={dataUrl} alt={`First page preview of ${file.name}`} className="shrink-0 rounded border border-ink-100 object-contain" style={{ width: size, height: size * 1.3 }} />;
}
