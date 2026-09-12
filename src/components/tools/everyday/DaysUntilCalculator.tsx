'use client';
import { useState } from 'react';
import { TextField } from '@/components/ui/Field';
import { ResultPanel, ResultStat } from '@/components/ui/Result';

export function DaysUntilCalculator() {
  const [targetDate, setTargetDate] = useState('');
  const [eventName, setEventName] = useState('');

  const target = targetDate ? new Date(targetDate + 'T00:00:00') : null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const diffMs = target ? target.getTime() - now.getTime() : null;
  const diffDays = diffMs !== null ? Math.ceil(diffMs / (1000 * 60 * 60 * 24)) : null;

  function formatDuration(totalDays: number): string {
    const years = Math.floor(totalDays / 365);
    const remainderAfterYears = totalDays % 365;
    const months = Math.floor(remainderAfterYears / 30);
    const days = remainderAfterYears % 30;
    const parts: string[] = [];
    if (years > 0) parts.push(`${years} year${years === 1 ? '' : 's'}`);
    if (months > 0) parts.push(`${months} month${months === 1 ? '' : 's'}`);
    if (days > 0) parts.push(`${days} day${days === 1 ? '' : 's'}`);
    return parts.join(' ');
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TextField
          label="Event Name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          placeholder="e.g., Birthday, Exam, Trip"
        />
        <TextField
          label="Date"
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
        />
      </div>

      {diffDays !== null && (
        <ResultPanel>
          {diffDays > 0 ? (
            <>
              <ResultStat label={`Days until ${eventName || 'event'}`} value={diffDays.toLocaleString()} emphasis />
              <ResultStat label="Duration" value={formatDuration(diffDays)} />
            </>
          ) : diffDays === 0 ? (
            <ResultStat label="Status" value="🎉 It's today!" emphasis />
          ) : (
            <>
              <ResultStat label="Days since" value={Math.abs(diffDays).toLocaleString()} />
              <p className="text-sm text-ink-500 mt-2">This date has already passed.</p>
            </>
          )}
        </ResultPanel>
      )}
    </div>
  );
}
