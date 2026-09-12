'use client';
import { useState } from 'react';
import { NumberField, SelectField } from '@/components/ui/Field';
import { ResultPanel, ResultStat } from '@/components/ui/Result';

const GST_RATES = [
  { value: '0', label: '0%' },
  { value: '5', label: '5%' },
  { value: '12', label: '12%' },
  { value: '18', label: '18%' },
  { value: '28', label: '28%' },
];

export function GstCalculator() {
  const [amount, setAmount] = useState(0);
  const [rate, setRate] = useState('18');
  const [type, setType] = useState<'inclusive' | 'exclusive'>('exclusive');

  const rateNum = parseFloat(rate);
  const gstAmount = (amount * rateNum) / 100;
  const total = type === 'exclusive' ? amount + gstAmount : amount;
  const baseAmount = type === 'inclusive' ? amount - gstAmount : amount;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <NumberField label="Amount" value={amount || ''} onChange={(e) => setAmount(parseFloat(e.target.value) || 0)} />
        <SelectField label="GST Rate" value={rate} onChange={setRate} options={GST_RATES} />
        <SelectField
          label="Type"
          value={type}
          onChange={(v) => setType(v as 'inclusive' | 'exclusive')}
          options={[
            { value: 'exclusive', label: 'Exclusive (add GST)' },
            { value: 'inclusive', label: 'Inclusive (GST included)' },
          ]}
        />
      </div>
      <div className="mt-6">
        <ResultPanel>
          {type === 'exclusive' ? (
            <>
              <ResultStat label="Base amount" value={`₹${amount.toFixed(2)}`} />
              <ResultStat label="GST amount" value={`₹${gstAmount.toFixed(2)}`} />
              <ResultStat label="Total amount" value={`₹${total.toFixed(2)}`} emphasis />
            </>
          ) : (
            <>
              <ResultStat label="Total (GST included)" value={`₹${amount.toFixed(2)}`} />
              <ResultStat label="Base amount" value={`₹${baseAmount.toFixed(2)}`} />
              <ResultStat label="GST amount" value={`₹${gstAmount.toFixed(2)}`} emphasis />
            </>
          )}
        </ResultPanel>
      </div>
    </div>
  );
}
