'use client';
import { useState, useMemo } from 'react';
import { ResultStat } from '@/components/ui/Result';

function parseNumbers(input: string): number[] {
  return input
    .split(/[\s,]+/)
    .map((s) => parseFloat(s))
    .filter((n) => Number.isFinite(n));
}

export function StatisticsCalculator() {
  const [input, setInput] = useState('4, 8, 15, 16, 23, 42');
  const numbers = useMemo(() => parseNumbers(input), [input]);

  const stats = useMemo(() => {
    if (numbers.length === 0) return null;
    const sorted = [...numbers].sort((a, b) => a - b);
    const sum = numbers.reduce((a, b) => a + b, 0);
    const mean = sum / numbers.length;
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 === 0 ? (sorted[mid - 1]! + sorted[mid]!) / 2 : sorted[mid]!;

    const freq = new Map<number, number>();
    numbers.forEach((n) => freq.set(n, (freq.get(n) ?? 0) + 1));
    const maxFreq = Math.max(...freq.values());
    const modes = maxFreq > 1 ? [...freq.entries()].filter(([, c]) => c === maxFreq).map(([n]) => n) : [];

    const variance = numbers.reduce((sum, n) => sum + (n - mean) ** 2, 0) / numbers.length;
    const stdDev = Math.sqrt(variance);

    return {
      count: numbers.length,
      sum: Math.round(sum * 1000) / 1000,
      mean: Math.round(mean * 1000) / 1000,
      median: Math.round(median * 1000) / 1000,
      mode: modes.length ? modes.join(', ') : 'No mode',
      min: sorted[0],
      max: sorted[sorted.length - 1],
      variance: Math.round(variance * 1000) / 1000,
      stdDev: Math.round(stdDev * 1000) / 1000,
    };
  }, [numbers]);

  return (
    <div>
      <label className="text-sm font-medium text-ink-700" htmlFor="stats-input">Dataset (comma or space separated)</label>
      <textarea id="stats-input" value={input} onChange={(e) => setInput(e.target.value)} rows={3} className="mt-1.5 w-full resize-y rounded-md border border-ink-100 bg-surface p-3 text-sm shadow-sm outline-none focus:border-moss-500 focus:ring-1 focus:ring-moss-500" />
      {stats ? (
        <div className="mt-5 rounded-lg border border-moss-100 bg-moss-100/40 p-5">
          <ResultStat label="Count" value={stats.count} />
          <ResultStat label="Sum" value={stats.sum} />
          <ResultStat label="Mean" value={stats.mean} emphasis />
          <ResultStat label="Median" value={stats.median} emphasis />
          <ResultStat label="Mode" value={stats.mode} />
          <ResultStat label="Min / Max" value={`${stats.min} / ${stats.max}`} />
          <ResultStat label="Variance" value={stats.variance} />
          <ResultStat label="Standard deviation" value={stats.stdDev} emphasis />
        </div>
      ) : (
        <p className="mt-4 text-sm text-ink-500">Enter at least one number.</p>
      )}
    </div>
  );
}
