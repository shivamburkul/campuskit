import { describe, expect, it } from 'vitest';
import { solvePolynomial } from '../src/lib/tools/polynomial';

function approxIncludes(roots: { re: number; im: number }[], re: number, im = 0, tol = 1e-4) {
  return roots.some((r) => Math.abs(r.re - re) < tol && Math.abs(r.im - im) < tol);
}

describe('solvePolynomial', () => {
  it('solves a quadratic with real roots (x^2 - 3x + 2 -> 1, 2)', () => {
    const roots = solvePolynomial([1, -3, 2]);
    expect(roots).toHaveLength(2);
    expect(approxIncludes(roots, 1)).toBe(true);
    expect(approxIncludes(roots, 2)).toBe(true);
  });

  it('solves a quadratic with complex roots (x^2 + 2x + 5 -> -1 ± 2i)', () => {
    const roots = solvePolynomial([1, 2, 5]);
    expect(roots).toHaveLength(2);
    expect(approxIncludes(roots, -1, 2)).toBe(true);
    expect(approxIncludes(roots, -1, -2)).toBe(true);
  });

  it('solves a cubic (x^3 - 6x^2 + 11x - 6 -> 1, 2, 3)', () => {
    const roots = solvePolynomial([1, -6, 11, -6]);
    expect(approxIncludes(roots, 1)).toBe(true);
    expect(approxIncludes(roots, 2)).toBe(true);
    expect(approxIncludes(roots, 3)).toBe(true);
  });

  it('solves a degree-8 polynomial with roots 1 through 8', () => {
    // (x-1)(x-2)...(x-8)
    const coeffs = [1, -36, 546, -4536, 22449, -67284, 118124, -109584, 40320];
    const roots = solvePolynomial(coeffs);
    expect(roots).toHaveLength(8);
    for (let r = 1; r <= 8; r++) {
      expect(approxIncludes(roots, r, 0, 1e-2)).toBe(true);
    }
  });

  it('rejects a degree-0 polynomial (no non-zero leading coefficient)', () => {
    expect(() => solvePolynomial([0, 0, 5])).toThrow();
  });
});
