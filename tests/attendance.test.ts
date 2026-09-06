import { describe, it, expect } from 'vitest';
import { attendancePercentage, classesNeededForTarget, classesCanMiss, subjectWiseSummary } from '../src/lib/tools/attendance';

describe('attendancePercentage', () => {
  it('computes normal attendance', () => {
    expect(attendancePercentage(34, 50)).toBe(68);
  });
  it('returns 0 for zero total classes', () => {
    expect(attendancePercentage(0, 0)).toBe(0);
  });
});

describe('classesNeededForTarget', () => {
  it('matches the spec example: 68% -> 75% target', () => {
    // attended=34, total=50 (68%)
    const result = classesNeededForTarget({ attended: 34, total: 50, targetPercentage: 75 });
    // x >= (75*50 - 100*34)/(100-75) = (3750-3400)/25 = 14
    expect(result.classesNeeded).toBe(14);
    expect(result.alreadyMet).toBe(false);
  });

  it('returns alreadyMet true when target already satisfied', () => {
    const result = classesNeededForTarget({ attended: 90, total: 100, targetPercentage: 75 });
    expect(result.alreadyMet).toBe(true);
    expect(result.classesNeeded).toBe(0);
  });

  it('handles a 100% target that is impossible if any class was missed', () => {
    const result = classesNeededForTarget({ attended: 40, total: 50, targetPercentage: 100 });
    expect(result.impossible).toBe(true);
  });
});

describe('classesCanMiss', () => {
  it('matches the spec example: 82% currently, target 75%', () => {
    const result = classesCanMiss({ attended: 82, total: 100, remainingClasses: 20, targetPercentage: 75 });
    expect(result.canMiss).toBeGreaterThanOrEqual(0);
    expect(result.wouldEndAt).toBeGreaterThanOrEqual(75);
  });

  it('returns 0 when already below target with no room to miss', () => {
    const result = classesCanMiss({ attended: 10, total: 50, remainingClasses: 5, targetPercentage: 75 });
    expect(result.canMiss).toBe(0);
  });
});

describe('subjectWiseSummary', () => {
  it('classifies subjects by status', () => {
    const result = subjectWiseSummary(
      [
        { subject: 'Math', attended: 45, total: 50 }, // 90%
        { subject: 'Physics', attended: 32, total: 50 }, // 64%
        { subject: 'Chem', attended: 38, total: 50 }, // 76%
      ],
      75
    );
    expect(result[0]!.status).toBe('safe');
    expect(result[1]!.status).toBe('shortage');
    expect(result[2]!.status).toBe('safe');
  });
});
