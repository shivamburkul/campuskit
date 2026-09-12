'use client';
import { useState } from 'react';
import { NumberField } from '@/components/ui/Field';
import { ResultPanel, ResultStat, InlineNote } from '@/components/ui/Result';

interface Roots {
  root1: string;
  root2: string;
  discriminant: number;
  type: 'real' | 'complex' | 'equal';
}

export function QuadraticEquationSolver() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(-3);
  const [c, setC] = useState(2);

  function solve(): Roots | null {
    if (a === 0) return null;

    const discriminant = b * b - 4 * a * c;

    if (discriminant > 0) {
      const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      return {
        root1: root1.toFixed(4),
        root2: root2.toFixed(4),
        discriminant,
        type: 'real',
      };
    } else if (discriminant === 0) {
      const root = -b / (2 * a);
      return {
        root1: root.toFixed(4),
        root2: root.toFixed(4),
        discriminant,
        type: 'equal',
      };
    } else {
      const realPart = -b / (2 * a);
      const imagPart = Math.sqrt(Math.abs(discriminant)) / (2 * a);
      return {
        root1: `${realPart.toFixed(4)} + ${imagPart.toFixed(4)}i`,
        root2: `${realPart.toFixed(4)} - ${imagPart.toFixed(4)}i`,
        discriminant,
        type: 'complex',
      };
    }
  }

  const result = solve();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <NumberField
          label="a"
          value={a}
          onChange={(e) => setA(parseFloat(e.target.value) || 0)}
          hint="ax²"
        />
        <NumberField
          label="b"
          value={b}
          onChange={(e) => setB(parseFloat(e.target.value) || 0)}
          hint="bx"
        />
        <NumberField
          label="c"
          value={c}
          onChange={(e) => setC(parseFloat(e.target.value) || 0)}
          hint="c"
        />
      </div>

      <p className="text-center text-lg font-medium text-ink-700 dark:text-ink-300">
        {a}x² {b >= 0 ? '+' : '-'} {Math.abs(b)}x {c >= 0 ? '+' : '-'} {Math.abs(c)} = 0
      </p>

      {a === 0 ? (
        <InlineNote tone="warning">a cannot be zero for a quadratic equation.</InlineNote>
      ) : (
        <ResultPanel>
          <ResultStat label="Discriminant (b² - 4ac)" value={result!.discriminant.toFixed(4)} />
          <ResultStat label="Root 1 (x₁)" value={result!.root1} emphasis />
          <ResultStat label="Root 2 (x₂)" value={result!.root2} emphasis />
          <p className="mt-2 text-xs text-ink-500">
            {result!.type === 'real' ? 'Two distinct real roots' :
             result!.type === 'equal' ? 'Two equal real roots' : 'Two complex roots'}
          </p>
        </ResultPanel>
      )}
    </div>
  );
}
