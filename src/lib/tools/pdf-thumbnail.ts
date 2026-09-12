'use client';

/**
 * Renders a PDF's first page to a small PNG data URL for a visual
 * thumbnail — entirely client-side via pdf.js, no upload. Dynamically
 * imported so pdf.js (a sizeable library) is only pulled into the bundle
 * on pages that actually use PDF tools.
 */
export async function renderPdfThumbnail(file: File, maxWidth = 140): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

  const bytes = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
  const page = await pdf.getPage(1);
  const baseViewport = page.getViewport({ scale: 1 });
  const scale = maxWidth / baseViewport.width;
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('canvas unavailable');

  await page.render({ canvasContext: context, viewport }).promise;
  const dataUrl = canvas.toDataURL('image/png');
  await pdf.destroy();
  return dataUrl;
}
