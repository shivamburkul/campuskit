import { describe, expect, it } from 'vitest';
import { evaluateExpression } from '../src/lib/tools/expression-evaluator';

describe('evaluateExpression', () => {
  it('respects standard operator precedence', () => {
    expect(evaluateExpression('2 + 3 * 4', 'deg', 0)).toBe(14);
    expect(evaluateExpression('(2 + 3) * 4', 'deg', 0)).toBe(20);
  });

  it('handles exponents (right-associative)', () => {
    expect(evaluateExpression('2^3', 'deg', 0)).toBe(8);
    expect(evaluateExpression('2^3^2', 'deg', 0)).toBe(512); // 2^(3^2), not (2^3)^2
  });

  it('handles unary minus', () => {
    expect(evaluateExpression('-5 + 3', 'deg', 0)).toBe(-2);
    expect(evaluateExpression('3 * -2', 'deg', 0)).toBe(-6);
  });

  it('computes trig functions in degree mode', () => {
    expect(evaluateExpression('sin(30)', 'deg', 0)).toBeCloseTo(0.5, 10);
    expect(evaluateExpression('cos(60)', 'deg', 0)).toBeCloseTo(0.5, 10);
  });

  it('computes trig functions in radian mode', () => {
    expect(evaluateExpression('sin(pi/2)', 'rad', 0)).toBeCloseTo(1, 10);
  });

  it('computes factorial', () => {
    expect(evaluateExpression('5!', 'deg', 0)).toBe(120);
  });

  it('computes sqrt, log, ln', () => {
    expect(evaluateExpression('sqrt(16)', 'deg', 0)).toBe(4);
    expect(evaluateExpression('log(100)', 'deg', 0)).toBeCloseTo(2, 10);
    expect(evaluateExpression('ln(e)', 'deg', 0)).toBeCloseTo(1, 10);
  });

  it('substitutes ans with the previous result', () => {
    expect(evaluateExpression('ans + 5', 'deg', 10)).toBe(15);
  });

  it('throws on division by zero', () => {
    expect(() => evaluateExpression('5 / 0', 'deg', 0)).toThrow();
  });

  it('throws on mismatched parentheses', () => {
    expect(() => evaluateExpression('(2 + 3', 'deg', 0)).toThrow();
  });

  it('handles nested functions and parentheses', () => {
    expect(evaluateExpression('sqrt(sin(90)^2 + cos(90)^2)', 'deg', 0)).toBeCloseTo(1, 6);
  });
});
