'use client';
import { useState } from 'react';
import { evaluateExpression, type AngleMode } from '@/lib/tools/expression-evaluator';

function formatResult(n: number): string {
  if (!Number.isFinite(n)) return 'Error';
  if (Math.abs(n) > 0 && (Math.abs(n) < 1e-9 || Math.abs(n) >= 1e15)) {
    return n.toExponential(6);
  }
  const rounded = Math.round((n + Number.EPSILON) * 1e10) / 1e10;
  return rounded.toString();
}

/** Converts a decimal to a simplified fraction using continued fractions (like a real calculator's S<>D key), or null if no clean fraction is found within the given precision. */
function decimalToFraction(value: number, maxDenominator = 1000000): { numerator: number; denominator: number } | null {
  if (!Number.isFinite(value)) return null;
  if (Number.isInteger(value)) return { numerator: value, denominator: 1 };

  const negative = value < 0;
  let x = Math.abs(value);
  let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
  let b = x;

  for (let i = 0; i < 40; i++) {
    const a = Math.floor(b);
    const h = a * h1 + h2;
    const k = a * k1 + k2;
    if (k > maxDenominator) break;
    h2 = h1; h1 = h;
    k2 = k1; k1 = k;
    if (Math.abs(x - h1 / k1) < 1e-10) break;
    if (b - a === 0) break;
    b = 1 / (b - a);
  }

  if (k1 === 0 || Math.abs(x - h1 / k1) > 1e-6) return null;
  return { numerator: negative ? -h1 : h1, denominator: k1 };
}

function formatAsFraction(value: number): string | null {
  const frac = decimalToFraction(value);
  if (!frac || frac.denominator === 1) return null;
  return `${frac.numerator}/${frac.denominator}`;
}

interface CalcKeyProps {
  label: string;
  onClick: () => void;
  variant?: 'digit' | 'op' | 'fn' | 'equals' | 'util' | 'active';
  wide?: boolean;
}

function CalcKey({ label, onClick, variant = 'fn', wide }: CalcKeyProps) {
  const base = 'flex items-center justify-center rounded-lg text-sm sm:text-base font-medium h-10 sm:h-11 transition-colors duration-150 select-none active:scale-95';
  const variants: Record<string, string> = {
    digit: 'bg-ink-50 text-ink-900 hover:bg-ink-100 dark:bg-ink-800 dark:text-ink-50 dark:hover:bg-ink-700',
    op: 'bg-primary-100 text-primary-700 hover:bg-primary-200 dark:bg-primary-900/40 dark:text-primary-300 dark:hover:bg-primary-900/60',
    fn: 'bg-ink-100/70 text-ink-700 hover:bg-ink-200/70 text-xs sm:text-sm dark:bg-ink-700/60 dark:text-ink-300 dark:hover:bg-ink-700',
    equals: 'bg-gradient-to-r from-primary-600 to-violet-600 text-white hover:shadow-md',
    util: 'bg-ink-200/70 text-ink-800 hover:bg-ink-300/70 text-xs sm:text-sm dark:bg-ink-600/60 dark:text-ink-200 dark:hover:bg-ink-600',
    active: 'bg-violet-600 text-white text-xs sm:text-sm',
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${variants[variant]} ${wide ? 'col-span-2' : ''}`}
    >
      {label}
    </button>
  );
}

export function ScientificCalculator() {
  const [expression, setExpression] = useState('');
  const [displayResult, setDisplayResult] = useState('0');
  const [lastAnswer, setLastAnswer] = useState(0);
  const [angleMode, setAngleMode] = useState<AngleMode>('deg');
  const [secondLayer, setSecondLayer] = useState(false);
  const [memory, setMemory] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [justEvaluated, setJustEvaluated] = useState(false);
  const [showFraction, setShowFraction] = useState(false);

  function append(text: string) {
    setError(null);
    if (justEvaluated) {
      setExpression(text);
      setJustEvaluated(false);
    } else {
      setExpression((prev) => prev + text);
    }
  }

  function appendFunction(name: string) {
    append(`${name}(`);
  }

  function handleEquals() {
    if (!expression.trim()) return;
    try {
      const result = evaluateExpression(expression, angleMode, lastAnswer);
      setDisplayResult(formatResult(result));
      setLastAnswer(result);
      setJustEvaluated(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid expression');
      setDisplayResult('Error');
      setShowFraction(false);
    }
  }

  function handleClear() {
    setExpression('');
    setDisplayResult('0');
    setError(null);
    setJustEvaluated(false);
  }

  function handleBackspace() {
    setExpression((prev) => prev.slice(0, -1));
    setJustEvaluated(false);
  }

  // Live preview: best-effort evaluation of the in-progress expression,
  // silently ignored if it's not yet a complete/valid expression.
  let preview: string | null = null;
  if (expression.trim() && !justEvaluated) {
    try {
      preview = formatResult(evaluateExpression(expression, angleMode, lastAnswer));
    } catch {
      preview = null;
    }
  }

  const trigFunctions = secondLayer
    ? [{ label: 'sin⁻¹', fn: 'asin' }, { label: 'cos⁻¹', fn: 'acos' }, { label: 'tan⁻¹', fn: 'atan' }]
    : [{ label: 'sin', fn: 'sin' }, { label: 'cos', fn: 'cos' }, { label: 'tan', fn: 'tan' }];

  return (
    <div className="mx-auto w-full" style={{ maxWidth: '26rem' }}>
      {/* Display */}
      <div className="rounded-2xl border border-ink-200 bg-ink-100 p-4 shadow-inner dark:border-ink-700 dark:bg-ink-800">
        <div className="flex items-center justify-between text-xs text-ink-500 dark:text-ink-400">
          <span>{angleMode.toUpperCase()}{memory !== 0 ? ' · M' : ''}</span>
          <span className="truncate pl-4 text-right opacity-70">{expression || ' '}</span>
        </div>
        <div className="mt-2 min-h-[2.5rem] overflow-x-auto text-right font-mono text-3xl font-semibold text-ink-950 dark:text-ink-50 sm:text-4xl">
          {justEvaluated
            ? (showFraction && formatAsFraction(lastAnswer)) || displayResult
            : (preview ?? (expression || '0'))}
        </div>
        {justEvaluated && showFraction && !formatAsFraction(lastAnswer) && (
          <p className="text-right text-xs text-ink-500 dark:text-ink-400">No clean fraction — showing decimal.</p>
        )}
        {error && <p className="mt-1 text-right text-xs text-red-600 dark:text-red-400">{error}</p>}
      </div>

      {/* Mode / utility row */}
      <div className="mt-3 grid grid-cols-6 gap-1.5 sm:gap-2">
        <CalcKey label="2nd" variant={secondLayer ? 'active' : 'util'} onClick={() => setSecondLayer((v) => !v)} />
        <CalcKey label={angleMode === 'deg' ? 'DEG' : 'RAD'} variant="util" onClick={() => setAngleMode((m) => (m === 'deg' ? 'rad' : 'deg'))} />
        <CalcKey label="a/b" variant={showFraction ? 'active' : 'util'} onClick={() => setShowFraction((v) => !v)} />
        <CalcKey label="(" variant="util" onClick={() => append('(')} />
        <CalcKey label=")" variant="util" onClick={() => append(')')} />
        <CalcKey label="AC" variant="util" onClick={handleClear} />
      </div>

      {/* Power / roots row */}
      <div className="mt-1.5 grid grid-cols-6 gap-1.5 sm:mt-2 sm:gap-2">
        <CalcKey label="x²" onClick={() => append('^2')} />
        <CalcKey label={secondLayer ? 'x^(1/y)' : 'x^y'} onClick={() => append('^')} />
        <CalcKey label={secondLayer ? '∛' : '√'} onClick={() => appendFunction(secondLayer ? 'cbrt' : 'sqrt')} />
        <CalcKey label="x!" onClick={() => append('!')} />
        <CalcKey label="%" onClick={() => append('%')} />
        <CalcKey label="⌫" variant="util" onClick={handleBackspace} />
      </div>

      {/* Trig row */}
      <div className="mt-1.5 grid grid-cols-6 gap-1.5 sm:mt-2 sm:gap-2">
        {trigFunctions.map((t) => (
          <CalcKey key={t.fn} label={t.label} onClick={() => appendFunction(t.fn)} />
        ))}
        <CalcKey label={secondLayer ? '10^x' : 'log'} onClick={() => (secondLayer ? append('10^') : appendFunction('log'))} />
        <CalcKey label={secondLayer ? 'e^x' : 'ln'} onClick={() => (secondLayer ? append('e^') : appendFunction('ln'))} />
        <CalcKey label="Ans" variant="util" onClick={() => append('ans')} />
      </div>

      {/* Constants / memory row */}
      <div className="mt-1.5 grid grid-cols-6 gap-1.5 sm:mt-2 sm:gap-2">
        <CalcKey label="π" onClick={() => append('pi')} />
        <CalcKey label="e" onClick={() => append('e')} />
        <CalcKey label="MC" variant="util" onClick={() => setMemory(0)} />
        <CalcKey label="M+" variant="util" onClick={() => setMemory((m) => m + (Number(preview ?? displayResult) || 0))} />
        <CalcKey label="M-" variant="util" onClick={() => setMemory((m) => m - (Number(preview ?? displayResult) || 0))} />
        <CalcKey label="MR" variant="util" onClick={() => append(String(memory))} />
      </div>

      {/* Division / multiplication row */}
      <div className="mt-1.5 grid grid-cols-6 gap-1.5 sm:mt-2 sm:gap-2">
        <div className="col-span-4" />
        <CalcKey label="÷" variant="op" onClick={() => append('/')} />
        <CalcKey label="×" variant="op" onClick={() => append('*')} />
      </div>

      {/* Numeric keypad */}
      <div className="mt-1.5 grid grid-cols-4 gap-1.5 sm:mt-2 sm:gap-2">
        <CalcKey label="7" variant="digit" onClick={() => append('7')} />
        <CalcKey label="8" variant="digit" onClick={() => append('8')} />
        <CalcKey label="9" variant="digit" onClick={() => append('9')} />
        <CalcKey label="−" variant="op" onClick={() => append('-')} />

        <CalcKey label="4" variant="digit" onClick={() => append('4')} />
        <CalcKey label="5" variant="digit" onClick={() => append('5')} />
        <CalcKey label="6" variant="digit" onClick={() => append('6')} />
        <CalcKey label="+" variant="op" onClick={() => append('+')} />

        <CalcKey label="1" variant="digit" onClick={() => append('1')} />
        <CalcKey label="2" variant="digit" onClick={() => append('2')} />
        <CalcKey label="3" variant="digit" onClick={() => append('3')} />
        <CalcKey label="=" variant="equals" onClick={handleEquals} />

        <CalcKey label="0" variant="digit" wide onClick={() => append('0')} />
        <CalcKey label="." variant="digit" onClick={() => append('.')} />
        <CalcKey label="+/-" variant="digit" onClick={() => append('*-1')} />
      </div>
    </div>
  );
}
