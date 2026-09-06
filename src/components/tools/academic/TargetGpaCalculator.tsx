'use client';
import { useState } from 'react';
import { NumberField } from '@/components/ui/Field';
import { ResultPanel, ResultStat, InlineNote } from '@/components/ui/Result';
import { calculateRequiredGpa } from '@/lib/tools/gpa';

export function TargetGpaCalculator() {
  const [currentGpa, setCurrentGpa] = useState(0);
  const [currentCredits, setCurrentCredits] = useState(0);
  const [targetGpa, setTargetGpa] = useState(0);
  const [remainingCredits, setRemainingCredits] = useState(0);
  const [maxScale, setMaxScale] = useState(10);

  const result = calculateRequiredGpa({ currentGpa, currentCredits, targetGpa, remainingCredits, maxScale });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <NumberField label="Current GPA" value={currentGpa || ''} step={0.01} onChange={(e) => setCurrentGpa(parseFloat(e.target.value) || 0)} />
        <NumberField label="Credits completed" value={currentCredits || ''} onChange={(e) => setCurrentCredits(parseFloat(e.target.value) || 0)} />
        <NumberField label="Target GPA" value={targetGpa || ''} step={0.01} onChange={(e) => setTargetGpa(parseFloat(e.target.value) || 0)} />
        <NumberField label="Credits remaining" value={remainingCredits || ''} onChange={(e) => setRemainingCredits(parseFloat(e.target.value) || 0)} />
        <NumberField label="Grading scale maximum" value={maxScale || ''} onChange={(e) => setMaxScale(parseFloat(e.target.value) || 0)} hint="e.g. 10 or 4.0" />
      </div>
      <div className="mt-6">
        <ResultPanel>
          {result.alreadyMet ? (
            <ResultStat label="You've already met this target" value="🎉" emphasis />
          ) : (
            <>
              <ResultStat label="GPA needed in remaining credits" value={result.requiredGpa} emphasis />
              {!result.achievable && (
                <InlineNote tone="warning">
                  That&apos;s above your scale&apos;s maximum ({maxScale}) — this target isn&apos;t mathematically reachable with the credits remaining.
                </InlineNote>
              )}
            </>
          )}
        </ResultPanel>
      </div>
    </div>
  );
}