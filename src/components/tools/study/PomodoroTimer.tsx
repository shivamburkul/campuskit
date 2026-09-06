'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { NumberField } from '@/components/ui/Field';

type Phase = 'focus' | 'break';

export function PomodoroTimer() {
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [phase, setPhase] = useState<Phase>('focus');
  const [secondsLeft, setSecondsLeft] = useState(focusMinutes * 60);
  const [running, setRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetForPhase = useCallback((nextPhase: Phase, focus: number, brk: number) => {
    setPhase(nextPhase);
    setSecondsLeft((nextPhase === 'focus' ? focus : brk) * 60);
  }, []);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setPhase((currentPhase) => {
            const next = currentPhase === 'focus' ? 'break' : 'focus';
            if (currentPhase === 'focus') setSessionsCompleted((s) => s + 1);
            setSecondsLeft((next === 'focus' ? focusMinutes : breakMinutes) * 60);
            return next;
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, focusMinutes, breakMinutes]);

  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
  const seconds = (secondsLeft % 60).toString().padStart(2, '0');

  return (
    <div className="flex flex-col items-center">
      <p className="text-sm font-medium uppercase tracking-wide text-moss-600">{phase === 'focus' ? 'Focus session' : 'Break'}</p>
      <p className="numeric-input font-display text-6xl font-semibold text-ink-950">{minutes}:{seconds}</p>
      <div className="mt-6 flex gap-3">
        <Button type="button" onClick={() => setRunning((r) => !r)}>{running ? 'Pause' : 'Start'}</Button>
        <Button
          variant="secondary"
          type="button"
          onClick={() => {
            setRunning(false);
            resetForPhase('focus', focusMinutes, breakMinutes);
          }}
        >
          Reset
        </Button>
      </div>
      <p className="mt-4 text-sm text-ink-500">Sessions completed today: {sessionsCompleted}</p>

      <div className="mt-8 grid w-full max-w-xs grid-cols-2 gap-3">
        <NumberField
          label="Focus (min)"
          value={focusMinutes}
          min={1}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10) || 1;
            setFocusMinutes(v);
            if (!running && phase === 'focus') setSecondsLeft(v * 60);
          }}
        />
        <NumberField
          label="Break (min)"
          value={breakMinutes}
          min={1}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10) || 1;
            setBreakMinutes(v);
            if (!running && phase === 'break') setSecondsLeft(v * 60);
          }}
        />
      </div>
      <p className="mt-4 text-xs text-ink-500">Runs entirely in your browser — keep this tab open. Nothing is uploaded or tracked.</p>
    </div>
  );
}
