'use client';
import { useState } from 'react';
import { NumberField } from '@/components/ui/Field';
import { ResultStat } from '@/components/ui/Result';
import { discountCalculator } from '@/lib/tools/everyday';

export function DiscountCalculator() {
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const result = discountCalculator(price, discount);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <NumberField label="Original price" value={price || ''} onChange={(e) => setPrice(parseFloat(e.target.value) || 0)} />
        <NumberField label="Discount %" value={discount || ''} suffix="%" onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)} />
      </div>
      <div className="rounded-lg border border-moss-100 bg-moss-100/40 p-5">
        <ResultStat label="You save" value={result.discountAmount} />
        <ResultStat label="Final price" value={result.finalPrice} emphasis />
      </div>
    </div>
  );
}
