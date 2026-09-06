'use client';
import { useState } from 'react';
import { TextField } from '@/components/ui/Field';
import { ResultStat, InlineNote } from '@/components/ui/Result';
import { calculateAge } from '@/lib/tools/everyday';

export function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('');
  const result = birthDate ? calculateAge(birthDate) : null;

  return (
    <div className="space-y-4">
      <TextField label="Date of birth" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
      {result && result.error && <InlineNote tone="warning">{result.error}</InlineNote>}
      {result && !result.error && (
        <div className="rounded-lg border border-moss-100 bg-moss-100/40 p-5">
          <ResultStat label="Age" value={`${result.years} years, ${result.months} months, ${result.days} days`} emphasis />
          <div className="my-3 border-t border-moss-500/20" />
          <ResultStat label="Total days" value={result.totalDays.toLocaleString()} />
          <ResultStat label="Total weeks" value={result.totalWeeks.toLocaleString()} />
          <ResultStat label="Total hours" value={result.totalHours.toLocaleString()} />
          <ResultStat label="Total minutes" value={result.totalMinutes.toLocaleString()} />
          <ResultStat label="Total seconds" value={result.totalSeconds.toLocaleString()} />
        </div>
      )}
      <InlineNote>
        These totals are calculated from calendar dates only (no birth time), so they reflect full days elapsed —
        not the exact current instant. If you were born later in the day than now, the true elapsed time is
        slightly less than shown.
      </InlineNote>
    </div>
  );
}
