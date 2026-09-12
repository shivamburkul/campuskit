'use client';
import { useState } from 'react';
import { NumberField, SelectField } from '@/components/ui/Field';
import { ResultPanel, ResultStat } from '@/components/ui/Result';

type FunctionType = 'x2' | 'x3' | 'sin' | 'cos' | 'exp' | '1x';

export function IntegrationCalculator() {
  const [funcType, setFuncType] = useState<FunctionType>('x2');
  const [lower, setLower] = useState(0);
  const [upper, setUpper] = useState(1);
  const [steps, setSteps] = useState(1000);

  function evaluateFunc(type: FunctionType, x: number): number {
    switch (type) {
      case 'x2': return x * x;
      case 'x3': return x * x * x;
      case 'sin': return Math.sin(x);
      case 'cos': return Math.cos(x);
      case 'exp': return Math.exp(x);
      case '1x': return 1 / x;
    }
  }

  // Simpson's Rule for numerical integration
  function integrateSimpson(): number {
    if (steps < 2 || upper === lower) return 0;

    const n = steps % 2 === 0 ? steps : steps + 1;
    const h = (upper - lower) / n;
    let sum = evaluateFunc(funcType, lower) + evaluateFunc(funcType, upper);

    for (let i = 1; i < n; i++) {
      const x = lower + i * h;
      sum += (i % 2 === 0 ? 2 : 4) * evaluateFunc(funcType, x);
    }

    return (h / 3) * sum;
  }

  const result = integrateSimpson();

  function getFunctionLabel(): string {
    switch (funcType) {
      case 'x2': return 'x²';
      case 'x3': return 'x³';
      case 'sin': return 'sin(x)';
      case 'cos': return 'cos(x)';
      case 'exp': return 'eˣ';
      case '1x': return '1/x';
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <SelectField
          label="Function"
          value={funcType}
          onChange={(v) => setFuncType(v as FunctionType)}
          options={[
            { value: 'x2', label: 'f(x) = x²' },
            { value: 'x3', label: 'f(x) = x³' },
            { value: 'sin', label: 'f(x) = sin(x)' },
            { value: 'cos', label: 'f(x) = cos(x)' },
            { value: 'exp', label: 'f(x) = eˣ' },
            { value: '1x', label: 'f(x) = 1/x' },
          ]}
        />
        <NumberField
          label="Number of Steps"
          value={steps}
          min={10}
          max={10000}
          step={10}
          onChange={(e) => setSteps(parseInt(e.target.value, 10) || 1000)}
          hint="More steps = more accurate"
        />
        <NumberField
          label="Lower Bound (a)"
          value={lower}
          onChange={(e) => setLower(parseFloat(e.target.value) || 0)}
        />
        <NumberField
          label="Upper Bound (b)"
          value={upper}
          onChange={(e) => setUpper(parseFloat(e.target.value) || 1)}
        />
      </div>

      <p className="text-center text-lg font-medium text-ink-700 dark:text-ink-300">
        ∫<sub>{lower}</sub><sup>{upper}</sup> {getFunctionLabel()} dx
      </p>

      <ResultPanel>
        <ResultStat label="Definite Integral" value={result.toFixed(6)} emphasis />
        <p className="mt-2 text-xs text-ink-500">Computed using Simpson&apos;s Rule with {steps} steps</p>
      </ResultPanel>
    </div>
  );
}
