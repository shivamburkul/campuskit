'use client';
import { useState } from 'react';
import { NumberField, TextField } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { unixToDate, dateToUnix } from '@/lib/tools/dev';
import { ResultStat } from '@/components/ui/Result';

export function TimestampConverter() {
  const [unix, setUnix] = useState<number>(Math.floor(Date.now() / 1000));
  const [iso, setIso] = useState<string>(new Date().toISOString());

  const unixResult = unixToDate(unix);
  const isoResult = dateToUnix(iso);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <NumberField label="Unix timestamp (seconds)" value={unix} onChange={(e) => setUnix(parseInt(e.target.value, 10) || 0)} />
        <div className="mt-3 rounded-lg border border-moss-100 bg-moss-100/40 p-3 dark:border-moss-700 dark:bg-moss-900/20">
          <ResultStat label="Converted date" value={unixResult} emphasis />
        </div>
        <Button variant="secondary" type="button" className="mt-2" onClick={() => setUnix(Math.floor(Date.now() / 1000))}>Use current time</Button>
      </div>
      <div>
        <TextField label="ISO date / time" value={iso} onChange={(e) => setIso(e.target.value)} hint="e.g. 2026-01-15T10:00:00Z" />
        <div className="mt-3 rounded-lg border border-moss-100 bg-moss-100/40 p-3 dark:border-moss-700 dark:bg-moss-900/20">
          <ResultStat label="Unix timestamp" value={isoResult !== null ? isoResult : 'Invalid date'} emphasis />
        </div>
      </div>
    </div>
  );
}
