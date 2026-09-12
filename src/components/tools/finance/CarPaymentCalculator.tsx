'use client';
import { useState } from 'react';
import { NumberField } from '@/components/ui/Field';
import { ResultPanel, ResultStat } from '@/components/ui/Result';
import { calculateEmi } from '@/lib/tools/finance';

export function CarPaymentCalculator() {
  const [carPrice, setCarPrice] = useState(800000);
  const [downPayment, setDownPayment] = useState(200000);
  const [rate, setRate] = useState(9.5);
  const [months, setMonths] = useState(60);

  const loanAmount = Math.max(0, carPrice - downPayment);
  const emiResult = calculateEmi({
    principal: loanAmount,
    annualRatePercent: rate,
    tenureMonths: months,
  });

  const totalCost = carPrice + emiResult.totalInterest;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <NumberField
          label="Car Price (₹)"
          value={carPrice || ''}
          min={0}
          step={50000}
          onChange={(e) => setCarPrice(parseFloat(e.target.value) || 0)}
        />
        <NumberField
          label="Down Payment (₹)"
          value={downPayment || ''}
          min={0}
          step={10000}
          onChange={(e) => setDownPayment(parseFloat(e.target.value) || 0)}
        />
        <NumberField
          label="Interest Rate (%)"
          value={rate || ''}
          min={0}
          step={0.1}
          onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
        />
        <NumberField
          label="Loan Tenure (months)"
          value={months || ''}
          min={12}
          max={84}
          step={12}
          onChange={(e) => setMonths(parseInt(e.target.value, 10) || 0)}
        />
      </div>

      <ResultPanel>
        <ResultStat label="Loan Amount" value={`₹${loanAmount.toLocaleString()}`} />
        <ResultStat label="Monthly EMI" value={`₹${emiResult.emi.toLocaleString()}`} emphasis />
        <ResultStat label="Total Interest" value={`₹${emiResult.totalInterest.toLocaleString()}`} />
        <ResultStat label="Total Cost (Car + Interest)" value={`₹${totalCost.toLocaleString()}`} />
      </ResultPanel>
    </div>
  );
}
