/**
 * Converts a "wall clock" date/time (as typed by a user, with no timezone
 * information of its own) into the correct UTC instant, given the IANA
 * timezone that wall-clock time is meant to represent.
 *
 * This is needed because `new Date("2026-09-10T14:30")` parses using the
 * *browser's own local timezone*, not any timezone the user explicitly
 * selected in the UI — so a naive implementation of "convert 14:30 in
 * America/New_York to Asia/Kolkata" silently uses whatever timezone the
 * visitor's device happens to be in instead.
 */

/** The UTC offset (in ms) that `tz` was at for the given instant. */
function getTimezoneOffsetMs(instant: Date, tz: string): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const parts = dtf.formatToParts(instant).reduce<Record<string, string>>((acc, p) => {
    acc[p.type] = p.value;
    return acc;
  }, {});
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  );
  return asUtc - instant.getTime();
}

/**
 * `dateStr` is a wall-clock time like "2026-09-10T14:30" (e.g. from an
 * <input type="datetime-local">), with no timezone attached. `tz` is the
 * IANA timezone that time is meant to be in. Returns the real UTC instant.
 */
export function zonedWallTimeToUtc(dateStr: string, tz: string): Date | null {
  // Treat the literal digits as if they were already UTC — a safe, timezone-
  // independent baseline to measure the target zone's offset against.
  const wallClockMs = Date.parse(`${dateStr}Z`);
  if (Number.isNaN(wallClockMs)) return null;
  const offsetMs = getTimezoneOffsetMs(new Date(wallClockMs), tz);
  return new Date(wallClockMs - offsetMs);
}
