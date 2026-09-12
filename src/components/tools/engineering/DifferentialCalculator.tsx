'use client';
import { useState } from 'react';
import { NumberField, SelectField } from '@/components/ui/Field';
import { ResultPanel, ResultStat } from '@/components/ui/Result';

type FunctionType = 'x2' | 'x3' | 'sin' | 'cos' | 'exp' | 'ln';

export function DifferentialCalculator() {
  const [funcType, setFuncType] = useState<FunctionType>('x2');
  const [x, setX] = useState(2);
  const [h, setH] = useState(0.0001);

  function evaluateFunc(type: FunctionType, val: number): number {
    switch (type) {
      case 'x2': return val * val;
      case 'x3': return val * val * val;
      case 'sin': return Math.sin(val);
      case 'cos': return Math.cos(val);
      case 'exp': return Math.exp(val);
      case 'ln': return Math.log(val);
    }
  }

  // Central difference method for numerical differentiation
  function differentiate(): number {
    const f = (val: number) => evaluateFunc(funcType, val);
    return (f(x + h) - f(x - h)) / (2 * h);
  }

  const derivative = differentiate();

  function getFunctionLabel(): string {
    switch (funcType) {
      case 'x2': return 'x²';
      case 'x3': return 'x³';
      case 'sin': return 'sin(x)';
      case 'cos': return 'cos(x)';
      case 'exp': return 'eˣ';
      case 'ln': return 'ln(x)';
    }
  }

  function getDerivativeFormula(): string {
    switch (funcType) {
      case 'x2': return 'f\'(x) = 2x';
      case 'x3': return 'f\'(x) = 3x²';
      case 'sin': return 'f\'(x) = cos(x)';
      case 'cos': return 'f\'(x) = -sin(x)';
      case 'exp': return 'f\'(x) = eˣ';
      case 'ln': return 'f\'(x) = 1/x';
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
            { value: 'ln', label: 'f(x) = ln(x)' },
          ]}
        />
        <NumberField
          label="Value of x"
          value={x}
          onChange={(e) => setX(parseFloat(e.target.value) || 0)}
          hint="evaluate at"
        />
        <NumberField
          label="Step size (h)"
          value={h}
          step={0.00001}
          onChange={(e) => setH(parseFloat(e.target.value) || 0.0001)}
          hint="smaller = more accurate"
        />
      </div>

      <div className="rounded-lg border border-ink-100 bg-ink-100/20 p-4">
        <p className="text-center font-medium text-ink-900 dark:text-ink-50">
          f(x) = {getFunctionLabel()}
        </p>
        <p className="text-center text-sm text-ink-500 mt-1">
          {getDerivativeFormula()}
        </p>
      </div>

      <ResultPanel>
        <ResultStat
          label={`f'(${x})`}
          value={derivative.toFixed(6)}
          emphasis
        />
      </ResultPanel>
    </div>
  );
}
