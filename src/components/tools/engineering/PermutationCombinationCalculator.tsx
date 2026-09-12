'use client';
import { useState } from 'react';
import { NumberField } from '@/components/ui/Field';
import { ResultPanel, ResultStat } from '@/components/ui/Result';

function factorial(n: number): number {
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

function permutation(n: number, r: number): number {
  if (n < 0 || r < 0 || r > n) return 0;
  return factorial(n) / factorial(n - r);
}

function combination(n: number, r: number): number {
  if (n < 0 || r < 0 || r > n) return 0;
  return factorial(n) / (factorial(r) * factorial(n - r));
}

export function PermutationCombinationCalculator() {
  const [n, setN] = useState(5);
  const [r, setR] = useState(2);

  const p = permutation(n, r);
  const c = combination(n, r);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <NumberField label="Total items (n)" value={n} min={0} max={20} onChange={(e) => setN(parseInt(e.target.value) || 0)} />
        <NumberField label="Selected items (r)" value={r} min={0} max={n} onChange={(e) => setR(parseInt(e.target.value) || 0)} />
      </div>
      <div className="mt-6">
        <ResultPanel>
          <ResultStat label="Permutations P(n,r)" value={p.toLocaleString()} emphasis />
          <ResultStat label="Combinations C(n,r)" value={c.toLocaleString()} emphasis />
        </ResultPanel>
      </div>
    </div>
  );
}
