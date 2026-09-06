'use client';
import { useState } from 'react';
import { NumberField, SelectField } from '@/components/ui/Field';
import { ResultPanel, ResultStat } from '@/components/ui/Result';
import { compoundInterest } from '@/lib/tools/finance';

export function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState(0);
  const [rate, setRate] = useState(0);
  const [years, setYears] = useState(0);
  const [frequency, setFrequency] = useState('1');
  const result = compoundInterest({ principal, ratePercent: rate, years, compoundsPerYear: parseInt(frequency, 10) });
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <NumberField label="Principal" value={principal || ''} onChange={(e) => setPrincipal(parseFloat(e.target.value) || 0)} />
        <NumberField label="Annual rate" value={rate || ''} suffix="%" onChange={(e) => setRate(parseFloat(e.target.value) || 0)} />
        <NumberField label="Years" value={years || ''} onChange={(e) => setYears(parseFloat(e.target.value) || 0)} />
        <SelectField
          label="Compounding frequency"
          value={frequency}
          onChange={setFrequency}
          options={[
            { value: '1', label: 'Annually' },
            { value: '2', label: 'Semi-annually' },
            { value: '4', label: 'Quarterly' },
            { value: '12', label: 'Monthly' },
            { value: '365', label: 'Daily' },
          ]}
        />
      </div>
      <ResultPanel>
        <ResultStat label="Interest earned" value={result.interest} />
        <ResultStat label="Total amount" value={result.total} emphasis />
      </ResultPanel>
    </div>
  );
}
