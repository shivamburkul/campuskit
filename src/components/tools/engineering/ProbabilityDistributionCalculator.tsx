'use client';
import { useState } from 'react';
import { NumberField, SelectField } from '@/components/ui/Field';
import { ResultPanel, ResultStat } from '@/components/ui/Result';

type Distribution = 'binomial' | 'normal' | 'poisson';

export function ProbabilityDistributionCalculator() {
  const [distribution, setDistribution] = useState<Distribution>('binomial');

  // Binomial params
  const [n, setN] = useState(10);
  const [p, setP] = useState(0.5);
  const [k, setK] = useState(5);

  // Normal params
  const [mean, setMean] = useState(0);
  const [stdDev, setStdDev] = useState(1);
  const [x, setX] = useState(1);

  // Poisson params
  const [lambda, setLambda] = useState(3);
  const [poissonK, setPoissonK] = useState(2);

  // Helper: factorial
  function factorial(num: number): number {
    if (num === 0 || num === 1) return 1;
    let result = 1;
    for (let i = 2; i <= num; i++) result *= i;
    return result;
  }

  // Binomial: P(X = k) = C(n,k) * p^k * (1-p)^(n-k)
  function binomialPMF(n: number, p: number, k: number): number {
    if (k < 0 || k > n) return 0;
    const combination = factorial(n) / (factorial(k) * factorial(n - k));
    return combination * Math.pow(p, k) * Math.pow(1 - p, n - k);
  }

  // Normal: P(X ≤ x) using the error function approximation
  function normalCDF(x: number, mean: number, stdDev: number): number {
    if (stdDev <= 0) return 0;
    const z = (x - mean) / stdDev;
    // Approximation of the error function
    const erf = (v: number) => {
      const sign = v >= 0 ? 1 : -1;
      const absV = Math.abs(v);
      const t = 1 / (1 + 0.3275911 * absV);
      const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-absV * absV);
      return sign * y;
    };
    return 0.5 * (1 + erf(z / Math.SQRT2));
  }

  // Poisson: P(X = k) = (λ^k * e^-λ) / k!
  function poissonPMF(lambda: number, k: number): number {
    return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
  }

  let resultLabel = '';
  let resultValue = 0;

  if (distribution === 'binomial') {
    resultLabel = `P(X = ${k})`;
    resultValue = binomialPMF(n, p, k);
  } else if (distribution === 'normal') {
    resultLabel = `P(X ≤ ${x})`;
    resultValue = normalCDF(x, mean, stdDev);
  } else {
    resultLabel = `P(X = ${poissonK})`;
    resultValue = poissonPMF(lambda, poissonK);
  }

  return (
    <div className="space-y-6">
      <SelectField
        label="Distribution"
        value={distribution}
        onChange={(v) => setDistribution(v as Distribution)}
        options={[
          { value: 'binomial', label: 'Binomial Distribution' },
          { value: 'normal', label: 'Normal Distribution' },
          { value: 'poisson', label: 'Poisson Distribution' },
        ]}
      />

      {distribution === 'binomial' && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <NumberField label="n (trials)" value={n} min={1} onChange={(e) => setN(parseInt(e.target.value, 10) || 1)} />
          <NumberField label="p (success prob)" value={p} min={0} max={1} step={0.01} onChange={(e) => setP(parseFloat(e.target.value) || 0)} />
          <NumberField label="k (successes)" value={k} min={0} max={n} onChange={(e) => setK(parseInt(e.target.value, 10) || 0)} />
        </div>
      )}

      {distribution === 'normal' && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <NumberField label="Mean (μ)" value={mean} onChange={(e) => setMean(parseFloat(e.target.value) || 0)} />
          <NumberField label="Std Dev (σ)" value={stdDev} min={0.01} onChange={(e) => setStdDev(parseFloat(e.target.value) || 1)} />
          <NumberField label="X value" value={x} onChange={(e) => setX(parseFloat(e.target.value) || 0)} />
        </div>
      )}

      {distribution === 'poisson' && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <NumberField label="λ (lambda)" value={lambda} min={0} step={0.1} onChange={(e) => setLambda(parseFloat(e.target.value) || 0)} />
          <NumberField label="k" value={poissonK} min={0} onChange={(e) => setPoissonK(parseInt(e.target.value, 10) || 0)} />
        </div>
      )}

      <ResultPanel>
        <ResultStat label={resultLabel} value={resultValue.toFixed(6)} emphasis />
      </ResultPanel>
    </div>
  );
}
