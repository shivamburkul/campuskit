'use client';
import { useState } from 'react';
import { NumberField } from '@/components/ui/Field';
import { ResultPanel, ResultStat } from '@/components/ui/Result';
import { simpleInterest } from '@/lib/tools/finance';

export function SimpleInterestCalculator() {
  const [principal, setPrincipal] = useState(0);
  const [rate, setRate] = useState(0);
  const [years, setYears] = useState(0);
  const result = simpleInterest(principal, rate, years);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <NumberField label="Principal" value={principal || ''} onChange={(e) => setPrincipal(parseFloat(e.target.value) || 0)} />
        <NumberField label="Annual rate" value={rate || ''} suffix="%" onChange={(e) => setRate(parseFloat(e.target.value) || 0)} />
        <NumberField label="Years" value={years || ''} onChange={(e) => setYears(parseFloat(e.target.value) || 0)} />
      </div>
      <ResultPanel>
        <ResultStat label="Interest earned" value={result.interest} />
        <ResultStat label="Total amount" value={result.total} emphasis />
      </ResultPanel>
    </div>
  );
}
