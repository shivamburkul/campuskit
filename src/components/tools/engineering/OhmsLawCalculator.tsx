'use client';
import { useState } from 'react';
import { NumberField, SelectField } from '@/components/ui/Field';
import { ResultStat, InlineNote } from '@/components/ui/Result';

type Known = 'voltage' | 'current' | 'resistance' | 'power';

export function OhmsLawCalculator() {
  const [solveFor, setSolveFor] = useState<Known>('voltage');
  const [voltage, setVoltage] = useState(0);
  const [current, setCurrent] = useState(0);
  const [resistance, setResistance] = useState(0);

  let computed: number | null = null;
  let label = '';
  let unit = '';

  if (solveFor === 'voltage') {
    computed = current * resistance;
    label = 'Voltage (V)';
    unit = 'V';
  } else if (solveFor === 'current') {
    computed = resistance !== 0 ? voltage / resistance : null;
    label = 'Current (I)';
    unit = 'A';
  } else if (solveFor === 'resistance') {
    computed = current !== 0 ? voltage / current : null;
    label = 'Resistance (R)';
    unit = 'Ω';
  } else {
    computed = voltage * current;
    label = 'Power (P)';
    unit = 'W';
  }

  return (
    <div className="space-y-5">
      <SelectField
        label="Solve for"
        value={solveFor}
        onChange={(v) => setSolveFor(v as Known)}
        options={[
          { value: 'voltage', label: 'Voltage (from I and R)' },
          { value: 'current', label: 'Current (from V and R)' },
          { value: 'resistance', label: 'Resistance (from V and I)' },
          { value: 'power', label: 'Power (from V and I)' },
        ]}
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {solveFor !== 'voltage' && <NumberField label="Voltage (V)" value={voltage || ''} onChange={(e) => setVoltage(parseFloat(e.target.value) || 0)} />}
        {solveFor !== 'current' && <NumberField label="Current (A)" value={current || ''} onChange={(e) => setCurrent(parseFloat(e.target.value) || 0)} />}
        {(solveFor === 'voltage' || solveFor === 'current') && <NumberField label="Resistance (Ω)" value={resistance || ''} onChange={(e) => setResistance(parseFloat(e.target.value) || 0)} />}
      </div>
      {computed === null ? (
        <InlineNote tone="warning">Enter a non-zero value to divide by.</InlineNote>
      ) : (
        <ResultStat label={label} value={`${Math.round(computed * 1000) / 1000} ${unit}`} emphasis />
      )}
    </div>
  );
}
