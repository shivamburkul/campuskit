'use client';
import { useState } from 'react';
import { TextField, SelectField } from '@/components/ui/Field';
import { InlineNote } from '@/components/ui/Result';
import { numberBaseConvert } from '@/lib/tools/dev';

const BASES = [
  { value: '2', label: 'Binary (2)' },
  { value: '8', label: 'Octal (8)' },
  { value: '10', label: 'Decimal (10)' },
  { value: '16', label: 'Hexadecimal (16)' },
];

export function NumberBaseConverter() {
  const [value, setValue] = useState('42');
  const [fromBase, setFromBase] = useState('10');
  const [toBase, setToBase] = useState('2');

  const result = numberBaseConvert(value, parseInt(fromBase, 10), parseInt(toBase, 10));

  return (
    <div className="space-y-4">
      <TextField label="Value" value={value} onChange={(e) => setValue(e.target.value)} />
      <div className="grid grid-cols-2 gap-3">
        <SelectField label="From base" value={fromBase} onChange={setFromBase} options={BASES} />
        <SelectField label="To base" value={toBase} onChange={setToBase} options={BASES} />
      </div>
      {result.error ? (
        <InlineNote tone="warning">{result.error}</InlineNote>
      ) : (
        <div className="rounded-lg border border-moss-100 bg-moss-100/40 p-5">
          <p className="numeric-input text-xl font-semibold text-ink-950">{result.output}</p>
        </div>
      )}
    </div>
  );
}
