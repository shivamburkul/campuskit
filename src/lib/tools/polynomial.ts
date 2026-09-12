/**
 * Finds all roots (real and complex) of a polynomial of any degree using the
 * Durand-Kerner (Weierstrass) method — a well-established numerical method
 * that converges reliably for polynomials with real coefficients, unlike the
 * quadratic formula which only works for degree 2.
 */

export interface Complex {
  re: number;
  im: number;
}

function cAdd(a: Complex, b: Complex): Complex {
  return { re: a.re + b.re, im: a.im + b.im };
}
function cSub(a: Complex, b: Complex): Complex {
  return { re: a.re - b.re, im: a.im - b.im };
}
function cMul(a: Complex, b: Complex): Complex {
  return { re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re };
}
function cDiv(a: Complex, b: Complex): Complex {
  const denom = b.re * b.re + b.im * b.im;
  if (denom === 0) return { re: 0, im: 0 };
  return {
    re: (a.re * b.re + a.im * b.im) / denom,
    im: (a.im * b.re - a.re * b.im) / denom,
  };
}
function cAbs(a: Complex): number {
  return Math.hypot(a.re, a.im);
}
function cPow(a: Complex, n: number): Complex {
  let result: Complex = { re: 1, im: 0 };
  for (let i = 0; i < n; i++) result = cMul(result, a);
  return result;
}

/** Evaluates a polynomial (coefficients highest-degree first) at a complex point via Horner's method. */
function evalPoly(coeffs: number[], x: Complex): Complex {
  let result: Complex = { re: 0, im: 0 };
  for (const c of coeffs) {
    result = cAdd(cMul(result, x), { re: c, im: 0 });
  }
  return result;
}

export interface PolynomialRoot {
  re: number;
  im: number;
  isReal: boolean;
}

/**
 * `coeffs` are ordered highest-degree first, e.g. [1, -3, 2] for x² - 3x + 2.
 * Returns one root per degree (degree = coeffs.length - 1).
 */
export function solvePolynomial(coeffs: number[], maxIterations = 300, tolerance = 1e-10): PolynomialRoot[] {
  // Strip leading zero coefficients (e.g. someone left the highest-degree field at 0).
  const trimmed = [...coeffs];
  while (trimmed.length > 1 && trimmed[0] === 0) trimmed.shift();

  const degree = trimmed.length - 1;
  if (degree < 1) throw new Error('Enter at least a degree-1 polynomial (need a non-zero leading coefficient).');
  if (degree > 10) throw new Error('Degree is limited to 10 for numerical stability.');

  // Normalize to a monic polynomial (leading coefficient 1).
  const leading = trimmed[0]!;
  const normalized = trimmed.map((c) => c / leading);

  if (degree === 1) {
    return [{ re: -normalized[1]!, im: 0, isReal: true }];
  }

  // Classic Durand-Kerner seed: powers of a non-real, non-symmetric complex
  // number spread the initial guesses around so the iteration doesn't get
  // stuck on symmetric configurations.
  const seed: Complex = { re: 0.4, im: 0.9 };
  let roots: Complex[] = Array.from({ length: degree }, (_, i) => cPow(seed, i));

  for (let iter = 0; iter < maxIterations; iter++) {
    let maxDelta = 0;
    const nextRoots = [...roots];

    for (let i = 0; i < degree; i++) {
      let denom: Complex = { re: 1, im: 0 };
      for (let j = 0; j < degree; j++) {
        if (i === j) continue;
        denom = cMul(denom, cSub(roots[i]!, roots[j]!));
      }
      const numerator = evalPoly(normalized, roots[i]!);
      const delta = cDiv(numerator, denom);
      nextRoots[i] = cSub(roots[i]!, delta);
      maxDelta = Math.max(maxDelta, cAbs(delta));
    }

    roots = nextRoots;
    if (maxDelta < tolerance) break;
  }

  return roots
    .map((r) => ({
      re: Math.abs(r.re) < 1e-9 ? 0 : r.re,
      im: Math.abs(r.im) < 1e-7 ? 0 : r.im,
      isReal: Math.abs(r.im) < 1e-7,
    }))
    .sort((a, b) => a.re - b.re);
}
