'use client';
import { useState, useEffect } from 'react';
import { TextField } from '@/components/ui/Field';
import { ResultStat } from '@/components/ui/Result';

export function ExamCountdown() {
  const [target, setTarget] = useState('');
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const targetTime = target ? new Date(target).getTime() : null;
  const diffMs = targetTime ? targetTime - now : null;

  let display: { days: number; hours: number; minutes: number; seconds: number } | null = null;
  if (diffMs !== null && diffMs > 0) {
    const totalSeconds = Math.floor(diffMs / 1000);
    display = {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
    };
  }

  return (
    <div className="space-y-5">
      <TextField label="Exam date & time" type="datetime-local" value={target} onChange={(e) => setTarget(e.target.value)} />
      {display ? (
        <div className="rounded-lg border border-moss-100 bg-moss-100/40 p-5">
          <ResultStat label="Days" value={display.days} emphasis />
          <ResultStat label="Hours" value={display.hours} />
          <ResultStat label="Minutes" value={display.minutes} />
          <ResultStat label="Seconds" value={display.seconds} />
        </div>
      ) : (
        targetTime && diffMs !== null && diffMs <= 0 && <p className="text-ink-700">That time has already passed — good luck if the exam is happening now!</p>
      )}
    </div>
  );
}
