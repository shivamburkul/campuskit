// Small, pure, testable helpers shared by the client-side PDF/image tools.
// The actual File/Canvas/pdf-lib manipulation lives in the tool components
// (browser-only APIs), but validation and size math are factored out here
// so they can be unit tested.

export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024; // 25MB — generous for student use, prevents accidental huge uploads

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;
  return `${exponent === 0 ? value : value.toFixed(2)} ${units[exponent]}`;
}

export function isFileSizeAllowed(bytes: number, maxBytes: number = MAX_UPLOAD_BYTES): boolean {
  return bytes > 0 && bytes <= maxBytes;
}

export function isAllowedMimeType(mime: string, allowed: string[]): boolean {
  return allowed.includes(mime);
}

/**
 * Given an original size and a target size, estimate a JPEG quality (0-1)
 * to try first. This is a heuristic starting point only — the actual
 * compressor iterates with real encoding to hit the target, since JPEG
 * compression ratio is content-dependent and can't be predicted exactly.
 */
export function estimateInitialQuality(originalBytes: number, targetBytes: number): number {
  if (targetBytes >= originalBytes) return 0.92;
  const ratio = targetBytes / originalBytes;
  const quality = Math.max(0.1, Math.min(0.92, ratio * 1.5));
  return Math.round(quality * 100) / 100;
}

export function parsePageRange(input: string, totalPages: number): { pages: number[]; error: string | null } {
  const trimmed = input.trim();
  if (!trimmed) return { pages: [], error: 'Enter a page range, e.g. 1-3 or 1,2,5' };

  const pages = new Set<number>();
  const parts = trimmed.split(',').map((p) => p.trim());

  for (const part of parts) {
    const rangeMatch = /^(\d+)\s*-\s*(\d+)$/.exec(part);
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1]!, 10);
      const end = parseInt(rangeMatch[2]!, 10);
      if (start < 1 || end > totalPages || start > end) {
        return { pages: [], error: `Range ${part} is out of bounds (document has ${totalPages} pages)` };
      }
      for (let p = start; p <= end; p++) pages.add(p);
    } else if (/^\d+$/.test(part)) {
      const page = parseInt(part, 10);
      if (page < 1 || page > totalPages) {
        return { pages: [], error: `Page ${page} is out of bounds (document has ${totalPages} pages)` };
      }
      pages.add(page);
    } else if (part.length > 0) {
      return { pages: [], error: `"${part}" isn't a valid page or range` };
    }
  }

  return { pages: [...pages].sort((a, b) => a - b), error: null };
}
