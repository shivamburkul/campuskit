'use client';
import { useState, useEffect } from 'react';
import { NumberField, SelectField } from '@/components/ui/Field';
import { ResultPanel, ResultStat } from '@/components/ui/Result';

// Approximate rates (updated 2026). For real-time rates, use an API.
const RATES: Record<string, { symbol: string; rate: number; name: string }> = {
  USD: { symbol: '$', rate: 1, name: 'US Dollar' },
  EUR: { symbol: '€', rate: 0.92, name: 'Euro' },
  GBP: { symbol: '£', rate: 0.79, name: 'British Pound' },
  INR: { symbol: '₹', rate: 83.2, name: 'Indian Rupee' },
  JPY: { symbol: '¥', rate: 149.5, name: 'Japanese Yen' },
  CNY: { symbol: '¥', rate: 7.24, name: 'Chinese Yuan' },
  AUD: { symbol: 'A$', rate: 1.52, name: 'Australian Dollar' },
  CAD: { symbol: 'C$', rate: 1.36, name: 'Canadian Dollar' },
  SGD: { symbol: 'S$', rate: 1.34, name: 'Singapore Dollar' },
  AED: { symbol: 'د.إ', rate: 3.67, name: 'UAE Dirham' },
  CHF: { symbol: 'Fr', rate: 0.88, name: 'Swiss Franc' },
  ZAR: { symbol: 'R', rate: 18.5, name: 'South African Rand' },
};

export function CurrencyConverter() {
  const [amount, setAmount] = useState(100);
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('INR');

  const fromRate = RATES[from]?.rate ?? 1;
  const toRate = RATES[to]?.rate ?? 1;
  const result = (amount / fromRate) * toRate;
  const resultSymbol = RATES[to]?.symbol ?? '';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <NumberField
          label="Amount"
          value={amount || ''}
          min={0}
          onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
        />
        <SelectField
          label="From"
          value={from}
          onChange={setFrom}
          options={Object.entries(RATES).map(([code, { name }]) => ({ value: code, label: `${code} — ${name}` }))}
        />
        <SelectField
          label="To"
          value={to}
          onChange={setTo}
          options={Object.entries(RATES).map(([code, { name }]) => ({ value: code, label: `${code} — ${name}` }))}
        />
      </div>

      <ResultPanel>
        <ResultStat
          label={`${amount} ${from} =`}
          value={`${resultSymbol}${result.toFixed(2)} ${to}`}
          emphasis
        />
        <p className="mt-2 text-xs text-ink-500">
          1 {from} = {(toRate / fromRate).toFixed(4)} {to}
        </p>
      </ResultPanel>

      <p className="text-xs text-ink-500">
        Rates are approximate (2026). For live rates, check your bank or a currency exchange service.
      </p>
    </div>
  );
}
