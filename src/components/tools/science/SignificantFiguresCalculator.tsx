'use client';
import { useState } from 'react';
import { NumberField } from '@/components/ui/Field';
import { ResultPanel, ResultStat } from '@/components/ui/Result';

export function SignificantFiguresCalculator() {
  const [number, setNumber] = useState('0.0012300');
  const [sigFigs, setSigFigs] = useState(3);

  function countSigFigs(value: string): number {
    const trimmed = value.trim();
    if (trimmed === '0' || trimmed === '0.0' || trimmed === '') return 0;
    
    // Remove leading zeros
    const withoutLeadingZeros = trimmed.replace(/^0+/, '');
    
    // If there's a decimal point, count all digits after removing leading zeros
    if (trimmed.includes('.')) {
      const digits = withoutLeadingZeros.replace(/\./g, '');
      return digits.length;
    }
    
    // If no decimal point, count digits but ignore trailing zeros
    const withoutTrailingZeros = withoutLeadingZeros.replace(/0+$/, '');
    return withoutTrailingZeros.length;
  }

  function roundToSigFigs(value: number, sigFigs: number): string {
    if (value === 0) return '0';
    const numDigits = Math.ceil(Math.log10(Math.abs(value)));
    const factor = Math.pow(10, numDigits - sigFigs);
    const rounded = Math.round(value / factor) * factor;
    return rounded.toString();
  }

  const numValue = parseFloat(number);
  const currentSigFigs = countSigFigs(number);
  const rounded = isNaN(numValue) ? '—' : roundToSigFigs(numValue, sigFigs);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-ink-700 dark:text-ink-300">Number</label>
          <input
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-ink-200/70 bg-surface px-4 py-3 text-ink-900 shadow-sm outline-none transition-all duration-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50 font-mono"
          />
        </div>
        <NumberField
          label="Round to (sig figs)"
          value={sigFigs}
          min={1}
          max={10}
          onChange={(e) => setSigFigs(parseInt(e.target.value, 10) || 1)}
        />
      </div>

      <ResultPanel>
        <ResultStat label="Current Significant Figures" value={currentSigFigs} />
        <ResultStat label={`Rounded to ${sigFigs} sig figs`} value={rounded} emphasis />
      </ResultPanel>
    </div>
  );
}
