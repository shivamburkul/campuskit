'use client';
import { useState } from 'react';
import { SelectField } from '@/components/ui/Field';
import { zonedWallTimeToUtc } from '@/lib/tools/timezone';

const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'America/Chicago',
  'America/Denver',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Pacific/Auckland',
];

export function TimeZoneConverter() {
  const [fromTz, setFromTz] = useState('UTC');
  const [toTz, setToTz] = useState('Asia/Kolkata');
  const [dateStr, setDateStr] = useState(new Date().toISOString().slice(0, 16));

  // The entered date/time is a plain wall-clock value with no timezone of its
  // own — it's interpreted as being in `fromTz` (not the visitor's own device
  // timezone), then converted to the true UTC instant before being displayed
  // in either zone.
  const utcInstant = zonedWallTimeToUtc(dateStr, fromTz);

  const formatInZone = (instant: Date | null, tz: string) => {
    if (!instant) return 'Invalid date';
    try {
      return instant.toLocaleString('en-US', { timeZone: tz, hour12: true, dateStyle: 'medium', timeStyle: 'short' });
    } catch {
      return 'Invalid';
    }
  };

  const fromTime = formatInZone(utcInstant, fromTz);
  const toTime = formatInZone(utcInstant, toTz);

  return (
    <div className="space-y-4">
      <input
        type="datetime-local"
        value={dateStr}
        onChange={(e) => setDateStr(e.target.value)}
        className="w-full rounded-xl border border-ink-200/70 bg-surface px-4 py-3 text-ink-900 shadow-sm outline-none transition-all duration-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <SelectField label="From" value={fromTz} onChange={setFromTz} options={TIMEZONES.map(tz => ({ value: tz, label: tz }))} />
        <SelectField label="To" value={toTz} onChange={setToTz} options={TIMEZONES.map(tz => ({ value: tz, label: tz }))} />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-white/30 bg-white/30 p-4 backdrop-blur-[24px] saturate-180 dark:border-white/10 dark:bg-ink-900/70">
          <p className="text-sm text-ink-500 dark:text-ink-400">{fromTz}</p>
          <p className="text-lg font-medium text-ink-950 dark:text-ink-50">{fromTime}</p>
        </div>
        <div className="rounded-xl border border-white/30 bg-white/30 p-4 backdrop-blur-[24px] saturate-180 dark:border-white/10 dark:bg-ink-900/70">
          <p className="text-sm text-ink-500 dark:text-ink-400">{toTz}</p>
          <p className="text-lg font-medium text-ink-950 dark:text-ink-50">{toTime}</p>
        </div>
      </div>
    </div>
  );
}
