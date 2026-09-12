'use client';
import { useState } from 'react';
import { NumberField } from '@/components/ui/Field';
import { ResultPanel, ResultStat, InlineNote } from '@/components/ui/Result';
import { compoundInterest } from '@/lib/tools/finance';

export function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState(22);
  const [retirementAge, setRetirementAge] = useState(60);
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [monthlyContribution, setMonthlyContribution] = useState(5000);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [inflation, setInflation] = useState(6);

  const yearsToRetirement = Math.max(0, retirementAge - currentAge);
  const monthsToRetirement = yearsToRetirement * 12;

  // Future value of current savings
  const fvCurrentSavings = compoundInterest({
    principal: currentSavings,
    ratePercent: annualReturn,
    years: yearsToRetirement,
    compoundsPerYear: 12,
  }).total;

  // Future value of monthly contributions (annuity formula)
  const monthlyRate = annualReturn / 100 / 12;
  const fvMonthlyContributions = monthlyRate > 0
    ? monthlyContribution * ((Math.pow(1 + monthlyRate, monthsToRetirement) - 1) / monthlyRate)
    : monthlyContribution * monthsToRetirement;

  const totalRetirement = fvCurrentSavings + fvMonthlyContributions;

  // Inflation-adjusted value
  const inflationAdjusted = totalRetirement / Math.pow(1 + inflation / 100, yearsToRetirement);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <NumberField label="Current Age" value={currentAge} min={18} max={70} onChange={(e) => setCurrentAge(parseInt(e.target.value, 10) || 0)} />
        <NumberField label="Retirement Age" value={retirementAge} min={30} max={80} onChange={(e) => setRetirementAge(parseInt(e.target.value, 10) || 0)} />
        <NumberField label="Current Savings (₹)" value={currentSavings || ''} min={0} onChange={(e) => setCurrentSavings(parseFloat(e.target.value) || 0)} />
        <NumberField label="Monthly Contribution (₹)" value={monthlyContribution || ''} min={0} onChange={(e) => setMonthlyContribution(parseFloat(e.target.value) || 0)} />
        <NumberField label="Expected Return (%)" value={annualReturn || ''} min={1} max={20} onChange={(e) => setAnnualReturn(parseFloat(e.target.value) || 0)} />
        <NumberField label="Inflation (%)" value={inflation || ''} min={0} max={10} onChange={(e) => setInflation(parseFloat(e.target.value) || 0)} />
      </div>

      <ResultPanel>
        <ResultStat label="Years to Retirement" value={yearsToRetirement} />
        <ResultStat label="Future Value of Current Savings" value={`₹${Math.round(fvCurrentSavings).toLocaleString('en-IN')}`} />
        <ResultStat label="Future Value of Monthly Contributions" value={`₹${Math.round(fvMonthlyContributions).toLocaleString('en-IN')}`} />
        <ResultStat label="Total Retirement Corpus (future rupees)" value={`₹${Math.round(totalRetirement).toLocaleString('en-IN')}`} emphasis />
        <ResultStat label="Same Corpus in Today's Purchasing Power" value={`₹${Math.round(inflationAdjusted).toLocaleString('en-IN')}`} />
      </ResultPanel>

      <InlineNote>
        This is a projection assuming constant returns and inflation. Actual returns vary. Start early — even small
        monthly contributions grow significantly over 30+ years. The last figure isn&apos;t a smaller pool of
        money — it&apos;s what your future corpus would be worth in today&apos;s rupees after {yearsToRetirement} years
        of {inflation}% inflation, so you can judge its real purchasing power rather than just the sticker number.
      </InlineNote>
    </div>
  );
}
