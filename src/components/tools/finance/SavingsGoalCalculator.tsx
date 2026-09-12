'use client';
import { useState } from 'react';
import { NumberField } from '@/components/ui/Field';
import { ResultPanel, ResultStat } from '@/components/ui/Result';
import { savingsGoal } from '@/lib/tools/finance';

export function SavingsGoalCalculator() {
  const [target, setTarget] = useState(0);
  const [current, setCurrent] = useState(0);
  const [monthly, setMonthly] = useState(0);
  const result = savingsGoal({ targetAmount: target, currentSavings: current, monthlyContribution: monthly });
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <NumberField label="Target amount" value={target || ''} onChange={(e) => setTarget(parseFloat(e.target.value) || 0)} />
        <NumberField label="Current savings" value={current || ''} onChange={(e) => setCurrent(parseFloat(e.target.value) || 0)} />
        <NumberField label="Monthly contribution" value={monthly || ''} onChange={(e) => setMonthly(parseFloat(e.target.value) || 0)} />
      </div>
      <ResultPanel>
        {result.alreadyMet ? (
          <ResultStat label="Status" value="Goal already reached 🎉" emphasis />
        ) : (
          <ResultStat label="Months needed" value={Number.isFinite(result.monthsNeeded) ? result.monthsNeeded : '—'} emphasis />
        )}
      </ResultPanel>
    </div>
  );
}
