'use client';
import { useState } from 'react';
import { NumberField } from '@/components/ui/Field';
import { ResultPanel, ResultStat, InlineNote } from '@/components/ui/Result';

type Mode = 'percentile-to-rank' | 'rank-to-percentile';

export function RankPercentileCalculator() {
  const [mode, setMode] = useState<Mode>('percentile-to-rank');
  const [percentile, setPercentile] = useState(0);
  const [rank, setRank] = useState(0);
  const [totalCandidates, setTotalCandidates] = useState(100000);

  // Percentile → Rank: Rank = (100 - Percentile) / 100 * Total Candidates
  const rankFromPercentile = totalCandidates > 0 ? Math.round(((100 - percentile) / 100) * totalCandidates) : 0;

  // Rank → Percentile: Percentile = (Total Candidates - Rank) / Total Candidates * 100
  const percentileFromRank = totalCandidates > 0 && rank > 0 ? ((totalCandidates - rank) / totalCandidates) * 100 : 0;

  const result = mode === 'percentile-to-rank' ? rankFromPercentile : percentileFromRank;

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button
          onClick={() => setMode('percentile-to-rank')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            mode === 'percentile-to-rank'
              ? 'bg-primary-600 text-white'
              : 'bg-ink-100 text-ink-700 dark:bg-ink-700 dark:text-ink-300'
          }`}
        >
          Percentile → Rank
        </button>
        <button
          onClick={() => setMode('rank-to-percentile')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            mode === 'rank-to-percentile'
              ? 'bg-primary-600 text-white'
              : 'bg-ink-100 text-ink-700 dark:bg-ink-700 dark:text-ink-300'
          }`}
        >
          Rank → Percentile
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {mode === 'percentile-to-rank' ? (
          <>
            <NumberField
              label="Your Percentile"
              value={percentile || ''}
              min={0}
              max={100}
              onChange={(e) => setPercentile(parseFloat(e.target.value) || 0)}
              hint="e.g., 98.5"
            />
            <NumberField
              label="Total Candidates"
              value={totalCandidates || ''}
              min={1}
              onChange={(e) => setTotalCandidates(parseInt(e.target.value, 10) || 0)}
              hint="e.g., 100000"
            />
          </>
        ) : (
          <>
            <NumberField
              label="Your Rank"
              value={rank || ''}
              min={1}
              onChange={(e) => setRank(parseInt(e.target.value, 10) || 0)}
            />
            <NumberField
              label="Total Candidates"
              value={totalCandidates || ''}
              min={1}
              onChange={(e) => setTotalCandidates(parseInt(e.target.value, 10) || 0)}
            />
          </>
        )}
      </div>

      <ResultPanel>
        {mode === 'percentile-to-rank' ? (
          <ResultStat label="Estimated Rank" value={result.toLocaleString()} emphasis />
        ) : (
          <ResultStat label="Estimated Percentile" value={`${result.toFixed(2)}%`} emphasis />
        )}
      </ResultPanel>

      <InlineNote>
        This is a plain statistical conversion between percentile and rank for the number of candidates you
        enter. It does not use or predict any real exam&apos;s actual results.
      </InlineNote>
    </div>
  );
}
