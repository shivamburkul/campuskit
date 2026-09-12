import { describe, expect, it } from 'vitest';
import { zonedWallTimeToUtc } from '../src/lib/tools/timezone';

describe('zonedWallTimeToUtc', () => {
  it('converts an EDT (summer) wall-clock time to the correct UTC instant', () => {
    const result = zonedWallTimeToUtc('2026-09-10T14:30', 'America/New_York');
    expect(result?.toISOString()).toBe('2026-09-10T18:30:00.000Z');
  });

  it('converts an EST (winter) wall-clock time to the correct UTC instant', () => {
    const result = zonedWallTimeToUtc('2026-01-10T14:30', 'America/New_York');
    expect(result?.toISOString()).toBe('2026-01-10T19:30:00.000Z');
  });

  it('round-trips back to the original wall-clock time when displayed in the same zone', () => {
    const instant = zonedWallTimeToUtc('2026-09-10T14:30', 'America/New_York');
    const backInZone = instant?.toLocaleString('en-US', {
      timeZone: 'America/New_York',
      hour12: false,
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
    });
    expect(backInZone).toBe('09/10/2026, 14:30');
  });

  it('handles UTC itself as a no-op', () => {
    const result = zonedWallTimeToUtc('2026-09-10T14:30', 'UTC');
    expect(result?.toISOString()).toBe('2026-09-10T14:30:00.000Z');
  });

  it('returns null for a malformed date string', () => {
    const result = zonedWallTimeToUtc('not-a-date', 'UTC');
    expect(result).toBeNull();
  });
});
