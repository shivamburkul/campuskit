'use client';
import { useState } from 'react';
import { TextField } from '@/components/ui/Field';
import { ResultStat, InlineNote } from '@/components/ui/Result';
import { dateDifference } from '@/lib/tools/everyday';

export function DateDifferenceCalculator() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const result = from && to ? dateDifference(from, to) : null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TextField label="From" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        <TextField label="To" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>
      {result && result.error && <InlineNote tone="warning">{result.error}</InlineNote>}
      {result && !result.error && (
        <div className="rounded-lg border border-moss-100 bg-moss-100/40 p-5">
          <ResultStat label="Difference" value={`${result.years} years, ${result.months} months, ${result.days} days`} emphasis />
          <div className="my-3 border-t border-moss-500/20" />
          <ResultStat label="Total days" value={result.totalDays.toLocaleString()} />
          <ResultStat label="Total weeks" value={result.totalWeeks.toLocaleString()} />
          <ResultStat label="Total hours" value={result.totalHours.toLocaleString()} />
        </div>
      )}
    </div>
  );
}
