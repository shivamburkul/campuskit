import { describe, it, expect } from 'vitest';
import { dateDifference, isLeapYear, businessDaysBetween, tipCalculator, discountCalculator } from '../src/lib/tools/everyday';

describe('dateDifference', () => {
  it('computes years/months/days between two dates', () => {
    const result = dateDifference('2020-01-15', '2023-03-20');
    expect(result.error).toBeNull();
    if (result.error === null) {
      expect(result.years).toBe(3);
      expect(result.months).toBe(2);
      expect(result.days).toBe(5);
    }
  });
  it('returns error for invalid dates', () => {
    const result = dateDifference('not-a-date', '2023-01-01');
    expect(result.error).not.toBeNull();
  });
  it('is order-independent', () => {
    const a = dateDifference('2023-01-01', '2020-01-01');
    expect(a.error).toBeNull();
    if (a.error === null) expect(a.years).toBe(3);
  });
});

describe('isLeapYear', () => {
  it('identifies standard leap years', () => {
    expect(isLeapYear(2024)).toBe(true);
  });
  it('excludes century non-leap years', () => {
    expect(isLeapYear(1900)).toBe(false);
  });
  it('includes 400-divisible century years', () => {
    expect(isLeapYear(2000)).toBe(true);
  });
});

describe('businessDaysBetween', () => {
  it('excludes weekends', () => {
    // Mon Jan 1 2024 to Fri Jan 5 2024 = 5 business days
    const result = businessDaysBetween('2024-01-01', '2024-01-05');
    expect(result).toBe(5);
  });
  it('returns null for invalid input', () => {
    expect(businessDaysBetween('bad', '2024-01-01')).toBeNull();
  });
});

describe('tipCalculator', () => {
  it('computes tip and per-person split', () => {
    const result = tipCalculator(100, 20, 4);
    expect(result.tip).toBe(20);
    expect(result.total).toBe(120);
    expect(result.perPerson).toBe(30);
  });
});

describe('discountCalculator', () => {
  it('computes discounted price', () => {
    const result = discountCalculator(1000, 25);
    expect(result.discountAmount).toBe(250);
    expect(result.finalPrice).toBe(750);
  });
});

describe('dateDifference extended totals', () => {
  it('derives totalWeeks/Hours/Minutes/Seconds exactly from totalDays', () => {
    const result = dateDifference('2020-01-01', '2020-01-11'); // 10 days
    expect(result.error).toBeNull();
    if (result.error === null) {
      expect(result.totalDays).toBe(10);
      expect(result.totalWeeks).toBeCloseTo(10 / 7, 2);
      expect(result.totalHours).toBe(240);
      expect(result.totalMinutes).toBe(14400);
      expect(result.totalSeconds).toBe(864000);
    }
  });
});
