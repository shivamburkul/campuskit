import { describe, it, expect } from 'vitest';
import { formatBytes, isFileSizeAllowed, isAllowedMimeType, estimateInitialQuality, parsePageRange } from '../src/lib/tools/files';

describe('formatBytes', () => {
  it('formats bytes, KB, MB', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(500)).toBe('500 B');
    expect(formatBytes(1024)).toBe('1.00 KB');
    expect(formatBytes(1024 * 1024 * 2)).toBe('2.00 MB');
  });
});

describe('isFileSizeAllowed', () => {
  it('rejects zero and negative sizes', () => {
    expect(isFileSizeAllowed(0)).toBe(false);
    expect(isFileSizeAllowed(-5)).toBe(false);
  });
  it('rejects sizes over the max', () => {
    expect(isFileSizeAllowed(999_999_999, 1_000_000)).toBe(false);
  });
  it('accepts sizes within range', () => {
    expect(isFileSizeAllowed(500, 1000)).toBe(true);
  });
});

describe('isAllowedMimeType', () => {
  it('accepts allowed types', () => {
    expect(isAllowedMimeType('image/png', ['image/png', 'image/jpeg'])).toBe(true);
  });
  it('rejects disallowed types', () => {
    expect(isAllowedMimeType('application/exe', ['image/png'])).toBe(false);
  });
});

describe('estimateInitialQuality', () => {
  it('returns high quality when target exceeds original', () => {
    expect(estimateInitialQuality(1000, 2000)).toBe(0.92);
  });
  it('scales down for smaller targets', () => {
    const q = estimateInitialQuality(1_000_000, 100_000);
    expect(q).toBeLessThan(0.92);
    expect(q).toBeGreaterThanOrEqual(0.1);
  });
});

describe('parsePageRange', () => {
  it('parses a simple range', () => {
    const result = parsePageRange('1-3', 10);
    expect(result.pages).toEqual([1, 2, 3]);
  });
  it('parses comma-separated pages and ranges', () => {
    const result = parsePageRange('1,3,5-6', 10);
    expect(result.pages).toEqual([1, 3, 5, 6]);
  });
  it('rejects out-of-bounds pages', () => {
    const result = parsePageRange('1-20', 10);
    expect(result.error).not.toBeNull();
  });
  it('rejects empty input', () => {
    const result = parsePageRange('', 10);
    expect(result.error).not.toBeNull();
  });
  it('rejects garbage input', () => {
    const result = parsePageRange('abc', 10);
    expect(result.error).not.toBeNull();
  });
  it('deduplicates and sorts pages', () => {
    const result = parsePageRange('3,1,2,1', 10);
    expect(result.pages).toEqual([1, 2, 3]);
  });
});
