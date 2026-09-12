import { describe, it, expect } from 'vitest';
import { convertUnit, convertTemperature } from '../src/lib/tools/units';

describe('convertUnit', () => {
  it('converts kilometers to miles', () => {
    const result = convertUnit('length', 1, 'kilometer', 'mile');
    expect(result).toBeCloseTo(0.621371, 4);
  });
  it('returns null for unknown category', () => {
    expect(convertUnit('nonsense' as never, 1, 'a', 'b')).toBeNull();
  });
  it('returns null for unknown unit', () => {
    expect(convertUnit('length', 1, 'lightyear', 'meter')).toBeNull();
  });
});

describe('convertTemperature', () => {
  it('converts celsius to fahrenheit', () => {
    expect(convertTemperature(100, 'celsius', 'fahrenheit')).toBe(212);
  });
  it('converts fahrenheit to celsius', () => {
    expect(convertTemperature(32, 'fahrenheit', 'celsius')).toBe(0);
  });
  it('converts celsius to kelvin', () => {
    expect(convertTemperature(0, 'celsius', 'kelvin')).toBeCloseTo(273.15, 2);
  });
});
