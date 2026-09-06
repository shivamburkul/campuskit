'use client';
import { useState } from 'react';
import { NumberField } from '@/components/ui/Field';
import { ResultPanel, ResultStat, InlineNote } from '@/components/ui/Result';
import { requiredMarks } from '@/lib/tools/percentage';

export function RequiredMarksCalculator() {
  const [obtainedSoFar, setObtainedSoFar] = useState(0);
  const [maxSoFar, setMaxSoFar] = useState(0);
  const [remainingMax, setRemainingMax] = useState(0);
  const [target, setTarget] = useState(75);

  const result = requiredMarks({ obtainedSoFar, maxSoFar, remainingMax, targetPercentage: target });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <NumberField label="Marks obtained so far" value={obtainedSoFar || ''} onChange={(e) => setObtainedSoFar(parseFloat(e.target.value) || 0)} />
        <NumberField label="Maximum marks so far" value={maxSoFar || ''} onChange={(e) => setMaxSoFar(parseFloat(e.target.value) || 0)} />
        <NumberField label="Maximum marks remaining" value={remainingMax || ''} onChange={(e) => setRemainingMax(parseFloat(e.target.value) || 0)} />
        <NumberField label="Target percentage" value={target || ''} suffix="%" onChange={(e) => setTarget(parseFloat(e.target.value) || 0)} />
      </div>
      <div className="mt-6">
        <ResultPanel>
          <ResultStat label="Marks required in remaining exams" value={result.requiredMarks} emphasis />
          {!result.achievable && <InlineNote tone="warning">This target isn&apos;t reachable with the marks remaining — even a perfect score won&apos;t get you there.</InlineNote>}
        </ResultPanel>
      </div>
    </div>
  );
}