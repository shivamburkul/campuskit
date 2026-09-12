'use client';
import { useState } from 'react';
import { NumberField } from '@/components/ui/Field';
import { ResultPanel, ResultStat, InlineNote } from '@/components/ui/Result';

const NEW_REGIME_STANDARD_DEDUCTION = 75000;
const OLD_REGIME_STANDARD_DEDUCTION = 50000;
const NEW_REGIME_87A_LIMIT = 1200000; // taxable income up to which rebate applies
const NEW_REGIME_87A_REBATE = 60000;
const OLD_REGIME_87A_LIMIT = 500000;
const OLD_REGIME_87A_REBATE = 12500;

export function TaxDeductionCalculator() {
  const [annualIncome, setAnnualIncome] = useState(1200000);
  const [deductions, setDeductions] = useState(150000);
  const [regime, setRegime] = useState<'old' | 'new'>('new');

  // Indian income tax slabs, FY 2025-26 / AY 2026-27 (Budget 2025), unchanged for FY 2026-27 (Budget 2026).
  // New regime: 0-4L Nil, 4-8L 5%, 8-12L 10%, 12-16L 15%, 16-20L 20%, 20-24L 25%, above 24L 30%.
  // Old regime (unchanged for years): 0-2.5L Nil, 2.5-5L 5%, 5-10L 20%, above 10L 30%.
  const standardDeduction = regime === 'new' ? NEW_REGIME_STANDARD_DEDUCTION : OLD_REGIME_STANDARD_DEDUCTION;
  const totalDeductions = regime === 'old' ? deductions + standardDeduction : standardDeduction;
  const taxableIncome = Math.max(0, annualIncome - totalDeductions);

  function calculateTax(income: number): number {
    let tax = 0;
    if (regime === 'old') {
      if (income <= 250000) tax = 0;
      else if (income <= 500000) tax = (income - 250000) * 0.05;
      else if (income <= 1000000) tax = 12500 + (income - 500000) * 0.2;
      else tax = 112500 + (income - 1000000) * 0.3;
    } else {
      if (income <= 400000) tax = 0;
      else if (income <= 800000) tax = (income - 400000) * 0.05;
      else if (income <= 1200000) tax = 20000 + (income - 800000) * 0.1;
      else if (income <= 1600000) tax = 60000 + (income - 1200000) * 0.15;
      else if (income <= 2000000) tax = 120000 + (income - 1600000) * 0.2;
      else if (income <= 2400000) tax = 200000 + (income - 2000000) * 0.25;
      else tax = 300000 + (income - 2400000) * 0.3;
    }
    return Math.max(0, tax);
  }

  let taxBeforeRebate = calculateTax(taxableIncome);

  // Section 87A rebate: brings tax to zero if taxable income is within the rebate threshold.
  const rebateLimit = regime === 'new' ? NEW_REGIME_87A_LIMIT : OLD_REGIME_87A_LIMIT;
  const maxRebate = regime === 'new' ? NEW_REGIME_87A_REBATE : OLD_REGIME_87A_REBATE;
  const rebate = taxableIncome <= rebateLimit ? Math.min(taxBeforeRebate, maxRebate) : 0;
  const taxAfterRebate = Math.max(0, Math.round(taxBeforeRebate - rebate));

  // 4% Health & Education Cess
  const cess = Math.round(taxAfterRebate * 0.04);
  const totalTax = taxAfterRebate + cess;
  const effectiveRate = annualIncome > 0 ? (totalTax / annualIncome) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setRegime('new')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            regime === 'new' ? 'bg-primary-600 text-white' : 'bg-ink-100 text-ink-700 dark:bg-ink-700 dark:text-ink-300'
          }`}
        >
          New Regime (default)
        </button>
        <button
          onClick={() => setRegime('old')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            regime === 'old' ? 'bg-primary-600 text-white' : 'bg-ink-100 text-ink-700 dark:bg-ink-700 dark:text-ink-300'
          }`}
        >
          Old Regime
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <NumberField
          label="Annual Income (₹)"
          value={annualIncome || ''}
          min={0}
          step={10000}
          onChange={(e) => setAnnualIncome(parseFloat(e.target.value) || 0)}
        />
        {regime === 'old' && (
          <NumberField
            label="Other deductions (₹)"
            value={deductions || ''}
            min={0}
            step={10000}
            onChange={(e) => setDeductions(parseFloat(e.target.value) || 0)}
            hint="80C, HRA, 80D, etc. (in addition to the ₹50,000 standard deduction)"
          />
        )}
      </div>

      <ResultPanel>
        <ResultStat label="Standard deduction applied" value={`₹${standardDeduction.toLocaleString()}`} />
        <ResultStat label="Taxable Income" value={`₹${taxableIncome.toLocaleString()}`} />
        <ResultStat label="Tax (before rebate & cess)" value={`₹${Math.round(taxBeforeRebate).toLocaleString()}`} />
        {rebate > 0 && <ResultStat label="Section 87A rebate" value={`-₹${Math.round(rebate).toLocaleString()}`} />}
        <ResultStat label="Health & Education Cess (4%)" value={`₹${cess.toLocaleString()}`} />
        <ResultStat label="Total Tax Payable" value={`₹${totalTax.toLocaleString()}`} emphasis />
        <ResultStat label="Effective Tax Rate" value={`${effectiveRate.toFixed(2)}%`} />
      </ResultPanel>

      <InlineNote>
        Based on Indian income tax slabs for FY 2025-26 / AY 2026-27, including the Section 87A rebate and
        standard deduction (₹75,000 new regime / ₹50,000 old regime). This does not account for surcharge on
        very high incomes, HRA exemption rules, or other case-specific factors. Consult a CA for accurate tax
        planning and filing.
      </InlineNote>
    </div>
  );
}
