import { roundTo } from './gpa';

export function marksToPercentage(obtained: number, total: number): number {
  if (total <= 0) return 0;
  return roundTo((obtained / total) * 100, 2);
}

export function percentageToMarks(percentage: number, total: number): number {
  if (total <= 0) return 0;
  return roundTo((percentage / 100) * total, 2);
}

/** X is what percent of Y */
export function whatPercentOf(x: number, y: number): number {
  if (y === 0) return 0;
  return roundTo((x / y) * 100, 2);
}

/** Percentage change from one value to another */
export function percentageChange(from: number, to: number): number {
  if (from === 0) return 0;
  return roundTo(((to - from) / Math.abs(from)) * 100, 2);
}

export function percentageOfValue(percentage: number, value: number): number {
  return roundTo((percentage / 100) * value, 2);
}

/** Marks needed in the remaining paper(s) to reach a target overall percentage */
export function requiredMarks(params: {
  obtainedSoFar: number;
  maxSoFar: number;
  remainingMax: number;
  targetPercentage: number;
}): { requiredMarks: number; achievable: boolean } {
  const { obtainedSoFar, maxSoFar, remainingMax, targetPercentage } = params;
  const totalMax = maxSoFar + remainingMax;
  const targetTotal = (targetPercentage / 100) * totalMax;
  const needed = targetTotal - obtainedSoFar;
  return {
    requiredMarks: roundTo(Math.max(needed, 0), 2),
    achievable: needed <= remainingMax,
  };
}
