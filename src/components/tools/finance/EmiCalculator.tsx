'use client';
import { useState } from 'react';
import { NumberField } from '@/components/ui/Field';
import { ResultPanel, ResultStat } from '@/components/ui/Result';
import { calculateEmi } from '@/lib/tools/finance';

export function EmiCalculator() {
  const [principal, setPrincipal] = useState(0);
  const [rate, setRate] = useState(0);
  const [months, setMonths] = useState(0);
  const result = calculateEmi({ principal, annualRatePercent: rate, tenureMonths: months });
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <NumberField label="Loan amount" value={principal || ''} onChange={(e) => setPrincipal(parseFloat(e.target.value) || 0)} />
        <NumberField label="Annual interest rate" value={rate || ''} suffix="%" onChange={(e) => setRate(parseFloat(e.target.value) || 0)} />
        <NumberField label="Tenure (months)" value={months || ''} onChange={(e) => setMonths(parseFloat(e.target.value) || 0)} />
      </div>
      <ResultPanel>
        <ResultStat label="Monthly EMI" value={result.emi} emphasis />
        <ResultStat label="Total interest" value={result.totalInterest} />
        <ResultStat label="Total payment" value={result.totalPayment} />
      </ResultPanel>
    </div>
  );
}
