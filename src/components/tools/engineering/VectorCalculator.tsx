'use client';
import { useState } from 'react';
import { NumberField, SelectField } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { ResultPanel, ResultStat } from '@/components/ui/Result';

type Operation = 'add' | 'subtract' | 'dot' | 'cross' | 'magnitude';

export function VectorCalculator() {
  const [dimensions, setDimensions] = useState(2);
  const [op, setOp] = useState<Operation>('add');
  const [vectorA, setVectorA] = useState<number[]>([1, 2]);
  const [vectorB, setVectorB] = useState<number[]>([3, 4]);

  function handleDimensionChange(dim: number) {
    const clamped = Math.max(2, Math.min(4, dim));
    setDimensions(clamped);
    setVectorA(Array.from({ length: clamped }, (_, i) => vectorA[i] ?? 0));
    setVectorB(Array.from({ length: clamped }, (_, i) => vectorB[i] ?? 0));
  }

  function updateVector(which: 'A' | 'B', index: number, value: number) {
    if (which === 'A') {
      setVectorA(vectorA.map((v, i) => (i === index ? value : v)));
    } else {
      setVectorB(vectorB.map((v, i) => (i === index ? value : v)));
    }
  }

  function calculateResult(): { values: number[] | null; text: string | null } {
    if (op === 'add') {
      return { values: vectorA.map((a, i) => a + (vectorB[i] ?? 0)), text: null };
    }
    if (op === 'subtract') {
      return { values: vectorA.map((a, i) => a - (vectorB[i] ?? 0)), text: null };
    }
    if (op === 'dot') {
      const result = vectorA.reduce((sum, a, i) => sum + a * (vectorB[i] ?? 0), 0);
      return { values: null, text: `Dot Product = ${result}` };
    }
    if (op === 'cross' && dimensions === 3) {
      const [a1, a2, a3] = vectorA;
      const [b1, b2, b3] = vectorB;
      return {
        values: [
          a2! * b3! - a3! * b2!,
          a3! * b1! - a1! * b3!,
          a1! * b2! - a2! * b1!,
        ],
        text: null,
      };
    }
    if (op === 'magnitude') {
      const magA = Math.sqrt(vectorA.reduce((sum, a) => sum + a * a, 0));
      return { values: null, text: `|A| = ${magA.toFixed(4)}` };
    }
    return { values: null, text: null };
  }

  const result = calculateResult();

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        <SelectField
          label="Dimension"
          value={String(dimensions)}
          onChange={(v) => handleDimensionChange(parseInt(v, 10))}
          options={[
            { value: '2', label: '2D' },
            { value: '3', label: '3D' },
          ]}
        />
        <SelectField
          label="Operation"
          value={op}
          onChange={(v) => setOp(v as Operation)}
          options={[
            { value: 'add', label: 'Addition (+)' },
            { value: 'subtract', label: 'Subtraction (-)' },
            { value: 'dot', label: 'Dot Product (·)' },
            { value: 'cross', label: 'Cross Product (×)' },
            { value: 'magnitude', label: 'Magnitude |A|' },
          ]}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">Vector A</p>
          <div className="space-y-2">
            {vectorA.map((val, i) => (
              <NumberField
                key={`a-${i}`}
                label={`a${i + 1}`}
                value={val}
                onChange={(e) => updateVector('A', i, parseFloat(e.target.value) || 0)}
              />
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">Vector B</p>
          <div className="space-y-2">
            {vectorB.map((val, i) => (
              <NumberField
                key={`b-${i}`}
                label={`b${i + 1}`}
                value={val}
                onChange={(e) => updateVector('B', i, parseFloat(e.target.value) || 0)}
              />
            ))}
          </div>
        </div>
      </div>

      {result.values && (
        <ResultPanel>
          <ResultStat
            label={op === 'cross' ? 'Cross Product' : 'Result'}
            value={`(${result.values.map((v) => v.toFixed(2)).join(', ')})`}
            emphasis
          />
        </ResultPanel>
      )}

      {result.text && (
        <ResultPanel>
          <ResultStat label="Result" value={result.text} emphasis />
        </ResultPanel>
      )}
    </div>
  );
}
