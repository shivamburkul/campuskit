import { describe, it, expect } from 'vitest';
import { simpleInterest, compoundInterest, calculateEmi, splitExpensesEqually, splitExpensesUnequally, savingsGoal } from '../src/lib/tools/finance';

describe('simpleInterest', () => {
  it('computes simple interest correctly', () => {
    const result = simpleInterest(1000, 5, 2);
    expect(result.interest).toBe(100);
    expect(result.total).toBe(1100);
  });
});

describe('compoundInterest', () => {
  it('computes annual compounding', () => {
    const result = compoundInterest({ principal: 1000, ratePercent: 10, years: 1, compoundsPerYear: 1 });
    expect(result.total).toBe(1100);
  });
  it('compounds more with higher frequency', () => {
    const annual = compoundInterest({ principal: 1000, ratePercent: 10, years: 1, compoundsPerYear: 1 });
    const monthly = compoundInterest({ principal: 1000, ratePercent: 10, years: 1, compoundsPerYear: 12 });
    expect(monthly.total).toBeGreaterThan(annual.total);
  });
});

describe('calculateEmi', () => {
  it('computes EMI for a standard loan', () => {
    const result = calculateEmi({ principal: 100000, annualRatePercent: 12, tenureMonths: 12 });
    expect(result.emi).toBeGreaterThan(0);
    expect(result.totalPayment).toBeGreaterThan(100000);
  });
  it('handles zero interest rate', () => {
    const result = calculateEmi({ principal: 12000, annualRatePercent: 0, tenureMonths: 12 });
    expect(result.emi).toBe(1000);
    expect(result.totalInterest).toBe(0);
  });
  it('handles zero tenure without throwing', () => {
    const result = calculateEmi({ principal: 1000, annualRatePercent: 10, tenureMonths: 0 });
    expect(result.emi).toBe(0);
  });
});

describe('splitExpensesEqually', () => {
  it('produces a balanced settlement for 3 people', () => {
    const result = splitExpensesEqually([
      { name: 'A', paid: 300 },
      { name: 'B', paid: 0 },
      { name: 'C', paid: 0 },
    ]);
    expect(result.perPerson).toBe(100);
    const totalSettled = result.settlements.reduce((sum, s) => sum + s.amount, 0);
    expect(totalSettled).toBeCloseTo(200, 1); // B and C both owe A 100
  });

  it('handles everyone paying equally (no settlements needed)', () => {
    const result = splitExpensesEqually([
      { name: 'A', paid: 100 },
      { name: 'B', paid: 100 },
    ]);
    expect(result.settlements.length).toBe(0);
  });
});

describe('splitExpensesUnequally', () => {
  it('splits by custom share weights', () => {
    const result = splitExpensesUnequally(
      [
        { name: 'A', paid: 600 },
        { name: 'B', paid: 0 },
      ],
      { A: 1, B: 2 }
    );
    // total 600, shares 1:2 => A owes 200, B owes 400
    // A paid 600, owes 200 => balance +400 (should receive 400)
    // B paid 0, owes 400 => balance -400
    expect(result.settlements[0]!.amount).toBeCloseTo(400, 1);
  });
});

describe('savingsGoal', () => {
  it('computes months needed', () => {
    const result = savingsGoal({ targetAmount: 1000, currentSavings: 200, monthlyContribution: 100 });
    expect(result.monthsNeeded).toBe(8);
  });
  it('flags already met goals', () => {
    const result = savingsGoal({ targetAmount: 500, currentSavings: 600, monthlyContribution: 50 });
    expect(result.alreadyMet).toBe(true);
  });
});
