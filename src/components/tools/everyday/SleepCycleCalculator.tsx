'use client';
import { useState } from 'react';
import { TextField } from '@/components/ui/Field';
import { ResultPanel, ResultStat } from '@/components/ui/Result';

export function SleepCycleCalculator() {
  const [mode, setMode] = useState<'wake' | 'sleep'>('wake');
  const [time, setTime] = useState('07:00');

  const CYCLE_MINUTES = 90;
  const FALL_ASLEEP_MINUTES = 14; // average time to fall asleep

  function getCycles(startTime: string): { time: string; cycles: number }[] {
    const [hours, minutes] = startTime.split(':').map(Number);
    const base = new Date();
    base.setHours(hours || 0, minutes || 0, 0, 0);

    const results: { time: string; cycles: number }[] = [];

    // Calculate multiple options (4-6 cycles)
    for (let cycles = 4; cycles <= 6; cycles++) {
      const totalMinutes = cycles * CYCLE_MINUTES;
      const target = new Date(base);

      if (mode === 'wake') {
        // Going backwards from wake time, adding fall-asleep time
        target.setMinutes(target.getMinutes() - totalMinutes - FALL_ASLEEP_MINUTES);
      } else {
        // Going forward from sleep time, adding wake time
        target.setMinutes(target.getMinutes() + totalMinutes);
      }

      results.push({
        time: target.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        cycles,
      });
    }

    return results;
  }

  const results = time ? getCycles(time) : [];

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button
          onClick={() => setMode('wake')}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            mode === 'wake' ? 'bg-primary-600 text-white' : 'bg-ink-100 text-ink-700'
          }`}
        >
          I want to wake at
        </button>
        <button
          onClick={() => setMode('sleep')}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            mode === 'sleep' ? 'bg-primary-600 text-white' : 'bg-ink-100 text-ink-700'
          }`}
        >
          I&apos;m sleeping at
        </button>
      </div>

      <TextField
        label={mode === 'wake' ? 'Wake-up Time' : 'Bedtime'}
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />

      {results.length > 0 && (
        <ResultPanel>
          <p className="text-sm font-medium text-ink-700 dark:text-ink-300 mb-3">
            {mode === 'wake' ? 'Best times to go to sleep:' : 'Best times to wake up:'}
          </p>
          <div className="space-y-3">
            {results.map((result) => (
              <div key={result.cycles} className="flex items-center justify-between">
                <span className="text-ink-900 dark:text-ink-50 font-medium">{result.time}</span>
                <span className="text-sm text-ink-500">
                  {result.cycles} cycles = {result.cycles * CYCLE_MINUTES / 60} hours
                </span>
              </div>
            ))}
          </div>
        </ResultPanel>
      )}
    </div>
  );
}
