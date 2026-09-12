'use client';
import { useState } from 'react';
import { NumberField } from '@/components/ui/Field';
import { ResultPanel, ResultStat } from '@/components/ui/Result';

export function AcademicProgressCalculator() {
  const [completedCredits, setCompletedCredits] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);
  const [currentGpa, setCurrentGpa] = useState(0);
  const [targetGpa, setTargetGpa] = useState(0);

  const progress = totalCredits > 0 ? Math.round((completedCredits / totalCredits) * 100) : 0;
  const remainingCredits = Math.max(0, totalCredits - completedCredits);
  const requiredGpa = remainingCredits > 0 ? ((targetGpa * totalCredits) - (currentGpa * completedCredits)) / remainingCredits : 0;
  const alreadyMet = remainingCredits === 0 || requiredGpa <= 0;
  const achievable = requiredGpa <= 10;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <NumberField label="Credits completed" value={completedCredits || ''} min={0} onChange={(e) => setCompletedCredits(parseFloat(e.target.value) || 0)} />
        <NumberField label="Total credits needed" value={totalCredits || ''} min={0} onChange={(e) => setTotalCredits(parseFloat(e.target.value) || 0)} />
        <NumberField label="Current GPA" value={currentGpa || ''} step={0.01} onChange={(e) => setCurrentGpa(parseFloat(e.target.value) || 0)} />
        <NumberField label="Target GPA" value={targetGpa || ''} step={0.01} onChange={(e) => setTargetGpa(parseFloat(e.target.value) || 0)} />
      </div>
      <div className="mt-6">
        <ResultPanel>
          <ResultStat label="Academic progress" value={`${progress}%`} />
          <ResultStat label="Credits remaining" value={remainingCredits} />
          <ResultStat label="GPA needed in remaining credits" value={alreadyMet ? 'Already met' : requiredGpa.toFixed(2)} emphasis />
          {!alreadyMet && !achievable && (
            <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
              This assumes a 10-point scale. That GPA is above the maximum, so the target isn&apos;t reachable with the credits remaining.
            </p>
          )}
        </ResultPanel>
      </div>
    </div>
  );
}
