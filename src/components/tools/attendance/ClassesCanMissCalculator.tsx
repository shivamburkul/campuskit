'use client';
import { useState } from 'react';
import { NumberField } from '@/components/ui/Field';
import { ResultPanel, ResultStat, InlineNote } from '@/components/ui/Result';
import { classesCanMiss } from '@/lib/tools/attendance';

export function ClassesCanMissCalculator() {
  const [attended, setAttended] = useState(0);
  const [total, setTotal] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [target, setTarget] = useState(75);

  const result = classesCanMiss({ attended, total, remainingClasses: remaining, targetPercentage: target });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <NumberField label="Classes attended so far" value={attended || ''} onChange={(e) => setAttended(parseFloat(e.target.value) || 0)} />
        <NumberField label="Total classes held so far" value={total || ''} onChange={(e) => setTotal(parseFloat(e.target.value) || 0)} />
        <NumberField label="Classes remaining this term" value={remaining || ''} onChange={(e) => setRemaining(parseFloat(e.target.value) || 0)} />
        <NumberField label="Target attendance %" value={target || ''} suffix="%" onChange={(e) => setTarget(parseFloat(e.target.value) || 0)} />
      </div>
      <div className="mt-6">
        <ResultPanel>
          {result.noRemaining ? (
            <InlineNote tone="neutral">No classes remaining — you&apos;ve already completed the term.</InlineNote>
          ) : (
            <>
              <ResultStat label="Classes you can miss" value={result.canMiss} emphasis />
              <ResultStat label="Ending attendance if you miss that many" value={`${result.wouldEndAt}%`} />
            </>
          )}
        </ResultPanel>
      </div>
    </div>
  );
}
