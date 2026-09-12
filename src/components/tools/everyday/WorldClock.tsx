'use client';
import { useEffect, useState } from 'react';

const CITIES = [
  { name: 'New York', timezone: 'America/New_York', flag: '🇺🇸' },
  { name: 'Los Angeles', timezone: 'America/Los_Angeles', flag: '🇺🇸' },
  { name: 'Chicago', timezone: 'America/Chicago', flag: '🇺🇸' },
  { name: 'Toronto', timezone: 'America/Toronto', flag: '🇨🇦' },
  { name: 'Vancouver', timezone: 'America/Vancouver', flag: '🇨🇦' },
  { name: 'Mexico City', timezone: 'America/Mexico_City', flag: '🇲🇽' },
  { name: 'São Paulo', timezone: 'America/Sao_Paulo', flag: '🇧🇷' },
  { name: 'Buenos Aires', timezone: 'America/Argentina/Buenos_Aires', flag: '🇦🇷' },
  { name: 'London', timezone: 'Europe/London', flag: '🇬🇧' },
  { name: 'Paris', timezone: 'Europe/Paris', flag: '🇫🇷' },
  { name: 'Berlin', timezone: 'Europe/Berlin', flag: '🇩🇪' },
  { name: 'Madrid', timezone: 'Europe/Madrid', flag: '🇪🇸' },
  { name: 'Rome', timezone: 'Europe/Rome', flag: '🇮🇹' },
  { name: 'Amsterdam', timezone: 'Europe/Amsterdam', flag: '🇳🇱' },
  { name: 'Moscow', timezone: 'Europe/Moscow', flag: '🇷🇺' },
  { name: 'Istanbul', timezone: 'Europe/Istanbul', flag: '🇹🇷' },
  { name: 'Cairo', timezone: 'Africa/Cairo', flag: '🇪🇬' },
  { name: 'Lagos', timezone: 'Africa/Lagos', flag: '🇳🇬' },
  { name: 'Johannesburg', timezone: 'Africa/Johannesburg', flag: '🇿🇦' },
  { name: 'Nairobi', timezone: 'Africa/Nairobi', flag: '🇰🇪' },
  { name: 'Dubai', timezone: 'Asia/Dubai', flag: '🇦🇪' },
  { name: 'Riyadh', timezone: 'Asia/Riyadh', flag: '🇸🇦' },
  { name: 'Karachi', timezone: 'Asia/Karachi', flag: '🇵🇰' },
  { name: 'Mumbai', timezone: 'Asia/Kolkata', flag: '🇮🇳' },
  { name: 'Delhi', timezone: 'Asia/Kolkata', flag: '🇮🇳' },
  { name: 'Dhaka', timezone: 'Asia/Dhaka', flag: '🇧🇩' },
  { name: 'Kathmandu', timezone: 'Asia/Kathmandu', flag: '🇳🇵' },
  { name: 'Bangkok', timezone: 'Asia/Bangkok', flag: '🇹🇭' },
  { name: 'Jakarta', timezone: 'Asia/Jakarta', flag: '🇮🇩' },
  { name: 'Singapore', timezone: 'Asia/Singapore', flag: '🇸🇬' },
  { name: 'Kuala Lumpur', timezone: 'Asia/Kuala_Lumpur', flag: '🇲🇾' },
  { name: 'Manila', timezone: 'Asia/Manila', flag: '🇵🇭' },
  { name: 'Hong Kong', timezone: 'Asia/Hong_Kong', flag: '🇭🇰' },
  { name: 'Shanghai', timezone: 'Asia/Shanghai', flag: '🇨🇳' },
  { name: 'Seoul', timezone: 'Asia/Seoul', flag: '🇰🇷' },
  { name: 'Tokyo', timezone: 'Asia/Tokyo', flag: '🇯🇵' },
  { name: 'Sydney', timezone: 'Australia/Sydney', flag: '🇦🇺' },
  { name: 'Melbourne', timezone: 'Australia/Melbourne', flag: '🇦🇺' },
  { name: 'Perth', timezone: 'Australia/Perth', flag: '🇦🇺' },
  { name: 'Auckland', timezone: 'Pacific/Auckland', flag: '🇳🇿' },
  { name: 'Honolulu', timezone: 'Pacific/Honolulu', flag: '🇺🇸' },
];

function getOffsetMinutes(instant: Date, tz: string): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const parts = dtf.formatToParts(instant).reduce<Record<string, string>>((acc, p) => { acc[p.type] = p.value; return acc; }, {});
  const asUtc = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), Number(parts.hour), Number(parts.minute), Number(parts.second));
  return (asUtc - instant.getTime()) / 60000;
}

function formatOffsetDiff(minutes: number): string {
  const abs = Math.abs(Math.round(minutes));
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  const parts = [h > 0 ? `${h}h` : '', m > 0 ? `${m}m` : ''].filter(Boolean).join(' ') || '0h';
  return parts;
}

export function WorldClock() {
  const [now, setNow] = useState(new Date());
  const [zoneA, setZoneA] = useState('Asia/Kolkata');
  const [zoneB, setZoneB] = useState('America/New_York');

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const offsetA = getOffsetMinutes(now, zoneA);
  const offsetB = getOffsetMinutes(now, zoneB);
  const diffMinutes = offsetA - offsetB;
  const nameA = CITIES.find((c) => c.timezone === zoneA)?.name ?? zoneA;
  const nameB = CITIES.find((c) => c.timezone === zoneB)?.name ?? zoneB;

  return (
    <div>
      <div className="rounded-xl border border-white/30 bg-white/30 p-4 backdrop-blur-[24px] saturate-180 dark:border-white/10 dark:bg-ink-900/70">
        <p className="mb-3 text-sm font-medium text-ink-700 dark:text-ink-300">Compare two time zones</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <select
            value={zoneA}
            onChange={(e) => setZoneA(e.target.value)}
            className="w-full rounded-xl border border-ink-200/70 bg-surface px-4 py-3 text-ink-900 shadow-sm outline-none dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
          >
            {CITIES.map((c) => <option key={`${c.name}-a`} value={c.timezone}>{c.flag} {c.name}</option>)}
          </select>
          <select
            value={zoneB}
            onChange={(e) => setZoneB(e.target.value)}
            className="w-full rounded-xl border border-ink-200/70 bg-surface px-4 py-3 text-ink-900 shadow-sm outline-none dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
          >
            {CITIES.map((c) => <option key={`${c.name}-b`} value={c.timezone}>{c.flag} {c.name}</option>)}
          </select>
        </div>
        <p className="mt-3 text-sm text-ink-700 dark:text-ink-300">
          {Math.abs(diffMinutes) < 1 ? (
            <>{nameA} and {nameB} are in the same time right now.</>
          ) : (
            <>
              <span className="font-semibold text-primary-600 dark:text-primary-400">{nameA}</span> is{' '}
              <span className="font-semibold">{formatOffsetDiff(diffMinutes)} {diffMinutes > 0 ? 'ahead of' : 'behind'}</span>{' '}
              <span className="font-semibold text-primary-600 dark:text-primary-400">{nameB}</span> right now.
            </>
          )}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CITIES.map((city) => {
          const time = now.toLocaleTimeString('en-US', {
            timeZone: city.timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          });
          const date = now.toLocaleDateString('en-US', {
            timeZone: city.timezone,
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          });

          return (
            <div
              key={`${city.name}-${city.timezone}`}
              className="rounded-xl border border-white/30 bg-white/30 p-4 backdrop-blur-[24px] saturate-180 shadow-lg shadow-black/5 dark:border-white/10 dark:bg-ink-900/70 dark:shadow-black/30"
            >
              <span className="font-medium text-ink-900 dark:text-ink-50">
                {city.flag} {city.name}
              </span>
              <div className="mt-2 numeric-input whitespace-nowrap font-mono text-2xl font-semibold text-primary-600 dark:text-primary-400">
                {time}
              </div>
              <div className="mt-1 text-xs text-ink-500">{date}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
