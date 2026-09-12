'use client';
import { useState } from 'react';
import { NumberField } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { ResultPanel, ResultStat, InlineNote } from '@/components/ui/Result';
import { solvePolynomial, type PolynomialRoot } from '@/lib/tools/polynomial';

const MIN_DEGREE = 1;
const MAX_DEGREE = 8;

function formatNum(n: number): string {
  const rounded = Math.round((n + Number.EPSILON) * 1e6) / 1e6;
  return rounded.toString();
}

function formatRoot(root: PolynomialRoot): string {
  if (root.isReal) return formatNum(root.re);
  const imAbs = formatNum(Math.abs(root.im));
  return `${formatNum(root.re)} ${root.im >= 0 ? '+' : '-'} ${imAbs}i`;
}

function formatEquation(coeffs: number[]): string {
  const degree = coeffs.length - 1;
  const terms = coeffs.map((c, i) => {
    const power = degree - i;
    if (c === 0) return null;
    const sign = c >= 0 ? '+' : '-';
    const abs = Math.abs(c);
    const coeffPart = (abs === 1 && power !== 0) ? '' : formatNum(abs);
    const varPart = power === 0 ? '' : power === 1 ? 'x' : `x^${power}`;
    return { sign, text: `${coeffPart}${varPart}` };
  }).filter((t): t is { sign: string; text: string } => t !== null);

  if (terms.length === 0) return '0 = 0';
  let eq = (terms[0]!.sign === '-' ? '-' : '') + terms[0]!.text;
  for (let i = 1; i < terms.length; i++) {
    eq += ` ${terms[i]!.sign} ${terms[i]!.text}`;
  }
  return `${eq} = 0`;
}

export function PolynomialSolver() {
  const [degree, setDegree] = useState(2);
  const [coeffs, setCoeffs] = useState<number[]>([1, -3, 2]);
  const [roots, setRoots] = useState<PolynomialRoot[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleDegreeChange(newDegree: number) {
    const clamped = Math.max(MIN_DEGREE, Math.min(MAX_DEGREE, Math.round(newDegree)));
    setDegree(clamped);
    setCoeffs((prev) => {
      const next = new Array(clamped + 1).fill(0);
      // Keep existing coefficients aligned to the same powers where possible.
      for (let i = 0; i < prev.length && i < next.length; i++) next[i] = prev[i];
      if (next[0] === 0) next[0] = 1;
      return next;
    });
    setRoots(null);
    setError(null);
  }

  function updateCoeff(index: number, value: number) {
    setCoeffs((prev) => prev.map((c, i) => (i === index ? value : c)));
    setRoots(null);
  }

  function handleSolve() {
    try {
      setError(null);
      setRoots(solvePolynomial(coeffs));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not solve this polynomial.');
      setRoots(null);
    }
  }

  return (
    <div className="space-y-6">
      <NumberField
        label="Degree (highest power of x)"
        value={degree}
        min={MIN_DEGREE}
        max={MAX_DEGREE}
        onChange={(e) => handleDegreeChange(parseInt(e.target.value, 10) || MIN_DEGREE)}
        hint="Works for any degree from 1 to 8 — not just quadratics."
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {coeffs.map((c, i) => {
          const power = degree - i;
          return (
            <NumberField
              key={i}
              label={power === 0 ? 'constant' : power === 1 ? 'coeff. of x' : `coeff. of x^${power}`}
              value={c}
              onChange={(e) => updateCoeff(i, parseFloat(e.target.value) || 0)}
            />
          );
        })}
      </div>

      <p className="text-center text-lg font-medium text-ink-700 dark:text-ink-300">
        {formatEquation(coeffs)}
      </p>

      <Button type="button" onClick={handleSolve}>Solve</Button>

      {error && <InlineNote tone="warning">{error}</InlineNote>}

      {roots && (
        <ResultPanel>
          {roots.map((root, i) => (
            <ResultStat key={i} label={`Root x${i + 1}`} value={formatRoot(root)} emphasis />
          ))}
          <p className="mt-2 text-xs text-ink-500 dark:text-ink-400">
            {roots.every((r) => r.isReal) ? 'All roots are real.' : 'Some roots are complex (shown as a ± bi).'}
          </p>
        </ResultPanel>
      )}

      <InlineNote>
        Uses a numerical root-finding method (Durand-Kerner), so results for degree 5 and above are
        very close approximations rather than exact closed-form values — accurate to about 6 decimal places.
      </InlineNote>
    </div>
  );
}
