'use client';
import { useState } from 'react';
import { NumberField } from '@/components/ui/Field';
import { ResultStat } from '@/components/ui/Result';
import { tipCalculator } from '@/lib/tools/everyday';

export function TipCalculator() {
  const [bill, setBill] = useState(0);
  const [tipPercent, setTipPercent] = useState(10);
  const [people, setPeople] = useState(1);
  const result = tipCalculator(bill, tipPercent, people);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <NumberField label="Bill amount" value={bill || ''} onChange={(e) => setBill(parseFloat(e.target.value) || 0)} />
        <NumberField label="Tip %" value={tipPercent || ''} suffix="%" onChange={(e) => setTipPercent(parseFloat(e.target.value) || 0)} />
        <NumberField label="Split between" value={people || ''} min={1} onChange={(e) => setPeople(parseInt(e.target.value, 10) || 1)} />
      </div>
      <div className="rounded-lg border border-moss-100 bg-moss-100/40 p-5">
        <ResultStat label="Tip amount" value={result.tip} />
        <ResultStat label="Total bill" value={result.total} />
        <ResultStat label="Per person" value={result.perPerson} emphasis />
      </div>
    </div>
  );
}
