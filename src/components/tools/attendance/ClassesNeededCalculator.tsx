'use client';
import { useState } from 'react';
import { NumberField } from '@/components/ui/Field';
import { ResultPanel, ResultStat, InlineNote } from '@/components/ui/Result';
import { classesNeededForTarget, attendancePercentage } from '@/lib/tools/attendance';

export function ClassesNeededCalculator() {
  const [attended, setAttended] = useState(0);
  const [total, setTotal] = useState(0);
  const [target, setTarget] = useState(75);

  const result = classesNeededForTarget({ attended, total, targetPercentage: target });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <NumberField label="Classes attended" value={attended || ''} onChange={(e) => setAttended(parseFloat(e.target.value) || 0)} />
        <NumberField label="Total classes held" value={total || ''} onChange={(e) => setTotal(parseFloat(e.target.value) || 0)} />
        <NumberField label="Target attendance %" value={target || ''} suffix="%" onChange={(e) => setTarget(parseFloat(e.target.value) || 0)} />
      </div>
      <div className="mt-6">
        <ResultPanel>
          <ResultStat label="Current attendance" value={`${attendancePercentage(attended, total)}%`} />
          {result.alreadyMet ? (
            <ResultStat label="Status" value="Already at or above target 🎉" emphasis />
          ) : result.impossible ? (
            <InlineNote tone="warning">A 100% target can&apos;t be recovered once a class has been missed.</InlineNote>
          ) : (
            <ResultStat label="Consecutive classes needed" value={result.classesNeeded} emphasis />
          )}
        </ResultPanel>
      </div>
    </div>
  );
}