'use client';
import { useState } from 'react';
import { TextField } from '@/components/ui/Field';
import { ResultStat } from '@/components/ui/Result';
import { businessDaysBetween } from '@/lib/tools/everyday';

export function BusinessDaysCalculator() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const result = from && to ? businessDaysBetween(from, to) : null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TextField label="From" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        <TextField label="To" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>
      {result !== null && (
        <div className="rounded-lg border border-moss-100 bg-moss-100/40 p-5">
          <ResultStat label="Business days (excludes weekends)" value={result} emphasis />
        </div>
      )}
    </div>
  );
}
