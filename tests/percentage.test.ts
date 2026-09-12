import { describe, it, expect } from 'vitest';
import { marksToPercentage, percentageToMarks, whatPercentOf, percentageChange, requiredMarks } from '../src/lib/tools/percentage';

describe('marksToPercentage', () => {
  it('computes a normal percentage', () => {
    expect(marksToPercentage(450, 500)).toBe(90);
  });
  it('returns 0 for zero total (avoids divide by zero)', () => {
    expect(marksToPercentage(10, 0)).toBe(0);
  });
  it('handles decimal marks', () => {
    expect(marksToPercentage(78.5, 100)).toBe(78.5);
  });
  it('handles obtained marks of 0', () => {
    expect(marksToPercentage(0, 500)).toBe(0);
  });
});

describe('percentageToMarks', () => {
  it('converts percentage back to marks', () => {
    expect(percentageToMarks(90, 500)).toBe(450);
  });
});

describe('whatPercentOf', () => {
  it('computes X is what percent of Y', () => {
    expect(whatPercentOf(25, 200)).toBe(12.5);
  });
  it('returns 0 when denominator is 0', () => {
    expect(whatPercentOf(5, 0)).toBe(0);
  });
});

describe('percentageChange', () => {
  it('computes positive change', () => {
    expect(percentageChange(50, 75)).toBe(50);
  });
  it('computes negative change', () => {
    expect(percentageChange(80, 60)).toBe(-25);
  });
  it('returns 0 when starting from 0', () => {
    expect(percentageChange(0, 50)).toBe(0);
  });
});

describe('requiredMarks', () => {
  it('computes marks required in the remaining paper', () => {
    const result = requiredMarks({ obtainedSoFar: 60, maxSoFar: 100, remainingMax: 100, targetPercentage: 75 });
    // target total = 150, needed = 150-60=90
    expect(result.requiredMarks).toBe(90);
    expect(result.achievable).toBe(true);
  });
  it('flags unachievable targets', () => {
    const result = requiredMarks({ obtainedSoFar: 10, maxSoFar: 100, remainingMax: 50, targetPercentage: 90 });
    expect(result.achievable).toBe(false);
  });
});
