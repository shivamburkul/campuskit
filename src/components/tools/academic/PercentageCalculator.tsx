'use client';
import { useState } from 'react';
import { NumberField } from '@/components/ui/Field';
import { ResultPanel, ResultStat } from '@/components/ui/Result';
import { marksToPercentage, whatPercentOf, percentageChange } from '@/lib/tools/percentage';

export function PercentageCalculator() {
  const [obtained, setObtained] = useState(0);
  const [total, setTotal] = useState(0);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);

  return (
    <div className="space-y-10">
      <div>
        <h3 className="font-medium text-ink-900">Marks to percentage</h3>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <NumberField label="Marks obtained" value={obtained || ''} onChange={(e) => setObtained(parseFloat(e.target.value) || 0)} />
          <NumberField label="Total marks" value={total || ''} onChange={(e) => setTotal(parseFloat(e.target.value) || 0)} />
        </div>
        <div className="mt-4">
          <ResultPanel>
            <ResultStat label="Percentage" value={`${marksToPercentage(obtained, total)}%`} emphasis />
          </ResultPanel>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-ink-900">X is what percent of Y</h3>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <NumberField label="X" value={x || ''} onChange={(e) => setX(parseFloat(e.target.value) || 0)} />
          <NumberField label="Y" value={y || ''} onChange={(e) => setY(parseFloat(e.target.value) || 0)} />
        </div>
        <div className="mt-4">
          <ResultPanel>
            <ResultStat label="Result" value={`${whatPercentOf(x, y)}%`} emphasis />
          </ResultPanel>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-ink-900">Percentage change</h3>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <NumberField label="From" value={from || ''} onChange={(e) => setFrom(parseFloat(e.target.value) || 0)} />
          <NumberField label="To" value={to || ''} onChange={(e) => setTo(parseFloat(e.target.value) || 0)} />
        </div>
        <div className="mt-4">
          <ResultPanel>
            <ResultStat label="Change" value={`${percentageChange(from, to)}%`} emphasis />
          </ResultPanel>
        </div>
      </div>
    </div>
  );
}
