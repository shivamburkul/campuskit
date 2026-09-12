import { roundTo } from './gpa';

export function simpleInterest(principal: number, ratePercent: number, years: number) {
  const interest = (principal * ratePercent * years) / 100;
  return { interest: roundTo(interest, 2), total: roundTo(principal + interest, 2) };
}

export function compoundInterest(params: {
  principal: number;
  ratePercent: number;
  years: number;
  compoundsPerYear?: number;
}) {
  const { principal, ratePercent, years, compoundsPerYear = 1 } = params;
  const n = compoundsPerYear;
  const r = ratePercent / 100;
  const amount = principal * Math.pow(1 + r / n, n * years);
  return {
    interest: roundTo(amount - principal, 2),
    total: roundTo(amount, 2),
  };
}

/** Standard reducing-balance EMI formula */
export function calculateEmi(params: { principal: number; annualRatePercent: number; tenureMonths: number }) {
  const { principal, annualRatePercent, tenureMonths } = params;
  if (tenureMonths <= 0) return { emi: 0, totalPayment: 0, totalInterest: 0 };
  const monthlyRate = annualRatePercent / 12 / 100;

  let emi: number;
  if (monthlyRate === 0) {
    emi = principal / tenureMonths;
  } else {
    const factor = Math.pow(1 + monthlyRate, tenureMonths);
    emi = (principal * monthlyRate * factor) / (factor - 1);
  }

  const totalPayment = emi * tenureMonths;
  const totalInterest = totalPayment - principal;

  return {
    emi: roundTo(emi, 2),
    totalPayment: roundTo(totalPayment, 2),
    totalInterest: roundTo(totalInterest, 2),
  };
}

export function savingsGoal(params: { targetAmount: number; currentSavings: number; monthlyContribution: number }) {
  const { targetAmount, currentSavings, monthlyContribution } = params;
  const remaining = targetAmount - currentSavings;
  if (remaining <= 0) return { monthsNeeded: 0, alreadyMet: true };
  if (monthlyContribution <= 0) return { monthsNeeded: Infinity, alreadyMet: false };
  return { monthsNeeded: Math.ceil(remaining / monthlyContribution), alreadyMet: false };
}

export interface Participant {
  name: string;
  paid: number;
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}

/**
 * Equal-split roommate/group expense settlement.
 * Computes minimal-transaction settlement using a greedy balance-matching algorithm.
 */
export function splitExpensesEqually(participants: Participant[]): {
  perPerson: number;
  totalSpent: number;
  settlements: Settlement[];
} {
  const totalSpent = participants.reduce((sum, p) => sum + p.paid, 0);
  const perPerson = totalSpent / (participants.length || 1);

  const balances = participants.map((p) => ({
    name: p.name,
    balance: roundTo(p.paid - perPerson, 2),
  }));

  return {
    perPerson: roundTo(perPerson, 2),
    totalSpent: roundTo(totalSpent, 2),
    settlements: settleBalances(balances),
  };
}

/** Unequal split: each participant owes a specified share (weights) of the total */
export function splitExpensesUnequally(
  participants: Participant[],
  shares: Record<string, number>
): { totalSpent: number; settlements: Settlement[] } {
  const totalSpent = participants.reduce((sum, p) => sum + p.paid, 0);
  const totalShareWeight = Object.values(shares).reduce((a, b) => a + b, 0) || 1;

  const balances = participants.map((p) => {
    const shareWeight = shares[p.name] ?? 0;
    const owes = (shareWeight / totalShareWeight) * totalSpent;
    return { name: p.name, balance: roundTo(p.paid - owes, 2) };
  });

  return { totalSpent: roundTo(totalSpent, 2), settlements: settleBalances(balances) };
}

export function settleBalances(balances: { name: string; balance: number }[]): Settlement[] {
  const creditors = balances.filter((b) => b.balance > 0.005).map((b) => ({ ...b }));
  const debtors = balances.filter((b) => b.balance < -0.005).map((b) => ({ ...b, balance: -b.balance }));

  creditors.sort((a, b) => b.balance - a.balance);
  debtors.sort((a, b) => b.balance - a.balance);

  const settlements: Settlement[] = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i]!;
    const creditor = creditors[j]!;
    const amount = roundTo(Math.min(debtor.balance, creditor.balance), 2);

    if (amount > 0.005) {
      settlements.push({ from: debtor.name, to: creditor.name, amount });
    }

    debtor.balance = roundTo(debtor.balance - amount, 2);
    creditor.balance = roundTo(creditor.balance - amount, 2);

    if (debtor.balance <= 0.005) i++;
    if (creditor.balance <= 0.005) j++;
  }

  return settlements;
}
