import { describe, it, expect } from 'vitest';
import { calculateWeightedGpa, calculateCgpaFromSemesters, calculateRequiredGpa, calculateSimpleGpa } from '../src/lib/tools/gpa';

describe('calculateWeightedGpa', () => {
  it('computes a normal weighted GPA', () => {
    const result = calculateWeightedGpa([
      { label: 'A', credits: 4, gradePoint: 9 },
      { label: 'B', credits: 3, gradePoint: 8 },
    ]);
    expect(result.totalCredits).toBe(7);
    expect(result.gpa).toBeCloseTo((4 * 9 + 3 * 8) / 7, 3);
  });

  it('returns 0 for empty course list', () => {
    expect(calculateWeightedGpa([]).gpa).toBe(0);
  });

  it('ignores courses with zero or negative credits', () => {
    const result = calculateWeightedGpa([
      { label: 'A', credits: 4, gradePoint: 9 },
      { label: 'B', credits: 0, gradePoint: 2 },
      { label: 'C', credits: -1, gradePoint: 10 },
    ]);
    expect(result.totalCredits).toBe(4);
    expect(result.gpa).toBe(9);
  });

  it('handles decimal grade points', () => {
    const result = calculateWeightedGpa([{ label: 'A', credits: 3, gradePoint: 3.7 }]);
    expect(result.gpa).toBe(3.7);
  });
});

describe('calculateCgpaFromSemesters', () => {
  it('weights semesters by credits', () => {
    const result = calculateCgpaFromSemesters([
      { label: 'Sem 1', sgpa: 8, credits: 20 },
      { label: 'Sem 2', sgpa: 9, credits: 22 },
    ]);
    expect(result.gpa).toBeCloseTo((8 * 20 + 9 * 22) / 42, 3);
  });
});

describe('calculateSimpleGpa', () => {
  it('averages grade points', () => {
    expect(calculateSimpleGpa([4, 3, 2])).toBe(3);
  });
  it('returns 0 for no valid entries', () => {
    expect(calculateSimpleGpa([])).toBe(0);
  });
});

describe('calculateRequiredGpa', () => {
  it('computes required GPA for remaining credits', () => {
    const result = calculateRequiredGpa({
      currentGpa: 7,
      currentCredits: 60,
      targetGpa: 8,
      remainingCredits: 20,
      maxScale: 10,
    });
    // (8*80 - 7*60) / 20 = (640-420)/20 = 11
    expect(result.requiredGpa).toBeCloseTo(11, 3);
    expect(result.achievable).toBe(false);
  });

  it('flags already-met targets', () => {
    const result = calculateRequiredGpa({
      currentGpa: 9,
      currentCredits: 60,
      targetGpa: 8,
      remainingCredits: 20,
      maxScale: 10,
    });
    expect(result.alreadyMet).toBe(true);
  });

  it('handles zero remaining credits', () => {
    const result = calculateRequiredGpa({
      currentGpa: 7,
      currentCredits: 60,
      targetGpa: 8,
      remainingCredits: 0,
      maxScale: 10,
    });
    expect(result.achievable).toBe(false);
  });
});

describe('SGPA regression (reported test case)', () => {
  it('computes credit-weighted SGPA correctly (credits 4,3,3 / grade points 9,8,7 -> 8.1)', () => {
    const result = calculateWeightedGpa([
      { label: 'A', credits: 4, gradePoint: 9 },
      { label: 'B', credits: 3, gradePoint: 8 },
      { label: 'C', credits: 3, gradePoint: 7 },
    ]);
    expect(result.gpa).toBe(8.1);
  });
});
