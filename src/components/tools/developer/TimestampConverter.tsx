'use client';
import { useState } from 'react';
import { NumberField, TextField } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { unixToDate, dateToUnix } from '@/lib/tools/dev';

export function TimestampConverter() {
  const [unix, setUnix] = useState<number>(Math.floor(Date.now() / 1000));
  const [iso, setIso] = useState<string>(new Date().toISOString());

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <NumberField label="Unix timestamp (seconds)" value={unix} onChange={(e) => setUnix(parseInt(e.target.value, 10) || 0)} />
        <p className="mt-3 text-sm text-ink-700">→ {unixToDate(unix)}</p>
        <Button variant="secondary" type="button" className="mt-2" onClick={() => setUnix(Math.floor(Date.now() / 1000))}>Use current time</Button>
      </div>
      <div>
        <TextField label="ISO date / time" value={iso} onChange={(e) => setIso(e.target.value)} hint="e.g. 2026-01-15T10:00:00Z" />
        <p className="mt-3 text-sm text-ink-700">→ {dateToUnix(iso) ?? 'Invalid date'}</p>
      </div>
    </div>
  );
}
