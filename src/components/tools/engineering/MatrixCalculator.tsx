'use client';
import { useState, useRef, useEffect, useLayoutEffect, useId } from 'react';
import { NumberField, SelectField } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { ResultPanel, InlineNote } from '@/components/ui/Result';
import {
  type Matrix,
  addMatrices,
  subtractMatrices,
  multiplyMatrices,
  transposeMatrix,
  scalarMultiply,
  determinant,
  inverseMatrix,
} from '@/lib/tools/matrix';

const MAX_DIM = 10;
const MIN_DIM = 1;
const MAX_MATRICES = 8;
const LONG_PRESS_MS = 400;

type Operation = 'add' | 'subtract' | 'multiply' | 'transpose' | 'determinant' | 'inverse' | 'scalar';

const BINARY_OPS: Operation[] = ['add', 'subtract', 'multiply'];
const OPERATION_LABELS: Record<Operation, string> = {
  add: 'Add (A + B)',
  subtract: 'Subtract (A − B)',
  multiply: 'Multiply (A × B)',
  transpose: 'Transpose',
  determinant: 'Determinant',
  inverse: 'Inverse',
  scalar: 'Scalar Multiply',
};

interface MatrixEntry {
  id: string;
  label: string;
  data: Matrix;
}

function createEmptyMatrix(rows: number, cols: number): Matrix {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));
}

function cloneMatrix(m: Matrix): Matrix {
  return m.map((row) => [...row]);
}

function nextLabel(existing: string[]): string {
  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(65 + i);
    if (!existing.includes(letter)) return letter;
  }
  return `M${existing.length + 1}`;
}

function formatFull(value: number): string {
  if (Number.isInteger(value)) return value.toString();
  const rounded = Math.round((value + Number.EPSILON) * 1e10) / 1e10;
  return rounded.toString();
}

/** A single result cell: auto-scrolls if the number is too wide, and shows the full value in a viewport-clamped popover on long-press/long-click — it always stays fully on screen, even at the edges. */
function MatrixResultCell({ value }: { value: number }) {
  const text = formatFull(value);
  const textRef = useRef<HTMLSpanElement>(null);
  const cellRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(false);
  const [popped, setPopped] = useState(false);
  const [popupStyle, setPopupStyle] = useState<{ top: number; left: number } | null>(null);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = textRef.current;
    const cell = cellRef.current;
    if (!el || !cell) return;
    setOverflowing(el.scrollWidth > cell.clientWidth - 4);
  }, [text]);

  // Position the popup relative to the viewport (not the cell), then, once
  // it has actually rendered and we know its real size, nudge it back inside
  // the viewport if it would otherwise overflow any edge. This is what makes
  // it work correctly for cells anywhere on the grid, including corners.
  useLayoutEffect(() => {
    if (!popped) {
      setPopupStyle(null);
      return;
    }
    const cell = cellRef.current;
    if (!cell) return;
    const cellRect = cell.getBoundingClientRect();
    let top = cellRect.top + cellRect.height / 2;
    let left = cellRect.left + cellRect.width / 2;
    setPopupStyle({ top, left });

    // Measure on the next frame once the popup has rendered at this initial guess.
    requestAnimationFrame(() => {
      const popup = popupRef.current;
      if (!popup) return;
      const rect = popup.getBoundingClientRect();
      const margin = 8;
      let adjustedLeft = left;
      let adjustedTop = top;

      if (rect.left < margin) adjustedLeft += margin - rect.left;
      if (rect.right > window.innerWidth - margin) adjustedLeft -= rect.right - (window.innerWidth - margin);
      if (rect.top < margin) adjustedTop += margin - rect.top;
      if (rect.bottom > window.innerHeight - margin) adjustedTop -= rect.bottom - (window.innerHeight - margin);

      if (adjustedLeft !== left || adjustedTop !== top) {
        setPopupStyle({ top: adjustedTop, left: adjustedLeft });
      }
    });
  }, [popped]);

  useEffect(() => {
    if (!popped) return;
    function onDocPointerDown(e: PointerEvent) {
      if (
        cellRef.current && !cellRef.current.contains(e.target as Node) &&
        popupRef.current && !popupRef.current.contains(e.target as Node)
      ) {
        setPopped(false);
      }
    }
    document.addEventListener('pointerdown', onDocPointerDown, true);
    return () => document.removeEventListener('pointerdown', onDocPointerDown, true);
  }, [popped]);

  function startPress() {
    pressTimer.current = setTimeout(() => setPopped(true), LONG_PRESS_MS);
  }
  function endPress() {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  }

  return (
    <div
      ref={cellRef}
      className="relative flex h-10 w-full min-w-0 items-center justify-center rounded border border-ink-100 bg-ink-50 px-1.5 text-sm font-medium dark:border-ink-700 dark:bg-ink-800 dark:text-ink-50"
      onPointerDown={startPress}
      onPointerUp={endPress}
      onPointerLeave={endPress}
      onPointerCancel={endPress}
    >
      <div className="h-full w-full overflow-hidden flex items-center justify-center">
        {overflowing ? (
          <div className="matrix-marquee-track">
            <span ref={textRef} className="whitespace-nowrap pr-6">{text}</span>
            <span aria-hidden className="whitespace-nowrap pr-6">{text}</span>
          </div>
        ) : (
          <span ref={textRef} className="truncate">{text}</span>
        )}
      </div>

      {popped && popupStyle && (
        <div
          ref={popupRef}
          // position: fixed is relative to the viewport, not any scrollable
          // ancestor, so this can never be clipped by the grid's own
          // overflow-x-auto wrapper — that clipping was the original bug.
          style={{ position: 'fixed', top: popupStyle.top, left: popupStyle.left, transform: 'translate(-50%, -50%)', width: 'max-content', maxWidth: '85vw' }}
          className="z-50 whitespace-nowrap rounded-lg border-2 border-primary-500 bg-white px-4 py-2 text-base font-semibold text-ink-950 shadow-xl animate-fade-up dark:bg-ink-900 dark:text-ink-50"
          onPointerUp={(e) => {
            e.stopPropagation();
            setPopped(false);
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
}

const gridStyle = (numCols: number) => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${numCols}, minmax(0, 1fr))`,
  gap: '0.375rem',
  width: '100%',
});

function InputMatrixGrid({ matrix, onChange }: { matrix: Matrix; onChange: (r: number, c: number, v: number) => void }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-ink-200 p-2 dark:border-ink-700">
      <div style={gridStyle(matrix[0]?.length ?? 1)}>
        {matrix.map((row, i) =>
          row.map((val, j) => (
            <input
              key={`${i}-${j}`}
              type="number"
              value={val}
              onChange={(e) => onChange(i, j, parseFloat(e.target.value) || 0)}
              className="h-10 w-full min-w-0 rounded border border-ink-100 bg-surface text-center text-sm no-spinner focus:border-primary-400 focus:ring-1 focus:ring-primary-400 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
            />
          ))
        )}
      </div>
    </div>
  );
}

function ResultMatrixGrid({ matrix }: { matrix: Matrix }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-ink-200 p-2 dark:border-ink-700">
      <div style={gridStyle(matrix[0]?.length ?? 1)}>
        {matrix.map((row, i) => row.map((val, j) => <MatrixResultCell key={`${i}-${j}`} value={val} />))}
      </div>
    </div>
  );
}

export function MatrixCalculator() {
  const idPrefix = useId();
  const [matrices, setMatrices] = useState<MatrixEntry[]>([
    { id: 'A', label: 'A', data: createEmptyMatrix(3, 3) },
    { id: 'B', label: 'B', data: createEmptyMatrix(3, 3) },
  ]);
  const [operation, setOperation] = useState<Operation>('add');
  const [operandX, setOperandX] = useState('A');
  const [operandY, setOperandY] = useState('B');
  const [scalar, setScalar] = useState(2);
  const [result, setResult] = useState<Matrix | number | null>(null);
  const [resultLabel, setResultLabel] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isBinary = BINARY_OPS.includes(operation);

  function addMatrix() {
    if (matrices.length >= MAX_MATRICES) return;
    const label = nextLabel(matrices.map((m) => m.label));
    setMatrices([...matrices, { id: `${idPrefix}-${label}-${Date.now()}`, label, data: createEmptyMatrix(3, 3) }]);
  }

  function removeMatrix(id: string) {
    if (matrices.length <= 1) return;
    setMatrices(matrices.filter((m) => m.id !== id));
    setResult(null);
    setError(null);
  }

  function resizeMatrix(id: string, newRows: number, newCols: number) {
    const clampedRows = Math.max(MIN_DIM, Math.min(MAX_DIM, Math.round(newRows)));
    const clampedCols = Math.max(MIN_DIM, Math.min(MAX_DIM, Math.round(newCols)));
    setMatrices((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const next: Matrix = [];
        for (let i = 0; i < clampedRows; i++) {
          const row: number[] = [];
          for (let j = 0; j < clampedCols; j++) row.push(m.data[i]?.[j] ?? 0);
          next.push(row);
        }
        return { ...m, data: next };
      })
    );
    setResult(null);
    setError(null);
  }

  function updateCell(id: string, r: number, c: number, value: number) {
    setMatrices((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const next = cloneMatrix(m.data);
        next[r]![c] = value;
        return { ...m, data: next };
      })
    );
  }

  function getMatrix(label: string): Matrix | undefined {
    return matrices.find((m) => m.label === label)?.data;
  }

  function handleCalculate() {
    setError(null);
    const x = getMatrix(operandX);
    const y = getMatrix(operandY);

    try {
      if (!x) throw new Error('Select a valid matrix.');

      switch (operation) {
        case 'add':
          if (!y) throw new Error('Select a second matrix.');
          setResult(addMatrices(x, y));
          setResultLabel(`${operandX} + ${operandY}`);
          break;
        case 'subtract':
          if (!y) throw new Error('Select a second matrix.');
          setResult(subtractMatrices(x, y));
          setResultLabel(`${operandX} − ${operandY}`);
          break;
        case 'multiply':
          if (!y) throw new Error('Select a second matrix.');
          setResult(multiplyMatrices(x, y));
          setResultLabel(`${operandX} × ${operandY}`);
          break;
        case 'transpose':
          setResult(transposeMatrix(x));
          setResultLabel(`${operandX}ᵀ`);
          break;
        case 'determinant':
          setResult(determinant(x));
          setResultLabel(`det(${operandX})`);
          break;
        case 'inverse':
          setResult(inverseMatrix(x));
          setResultLabel(`${operandX}⁻¹`);
          break;
        case 'scalar':
          setResult(scalarMultiply(x, scalar));
          setResultLabel(`${scalar} × ${operandX}`);
          break;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Matrix operation failed.');
      setResult(null);
    }
  }

  const clearResult = () => {
    setResult(null);
    setError(null);
  };

  const matrixOptions = matrices.map((m) => ({ value: m.label, label: `Matrix ${m.label}` }));

  return (
    <div className="space-y-6">
      {matrices.map((m) => (
        <div key={m.id} className="rounded-xl border border-ink-100 p-3 dark:border-ink-700">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-ink-700 dark:text-ink-300">Matrix {m.label}</p>
            <div className="flex flex-wrap items-center gap-2">
              <NumberField
                label="Rows"
                value={m.data.length}
                min={MIN_DIM}
                max={MAX_DIM}
                onChange={(e) => resizeMatrix(m.id, parseInt(e.target.value, 10) || MIN_DIM, m.data[0]?.length ?? 1)}
              />
              <NumberField
                label="Columns"
                value={m.data[0]?.length ?? 1}
                min={MIN_DIM}
                max={MAX_DIM}
                onChange={(e) => resizeMatrix(m.id, m.data.length, parseInt(e.target.value, 10) || MIN_DIM)}
              />
              {matrices.length > 1 && (
                <Button variant="ghost" type="button" onClick={() => removeMatrix(m.id)}>Remove</Button>
              )}
            </div>
          </div>
          <InputMatrixGrid matrix={m.data} onChange={(r, c, v) => updateCell(m.id, r, c, v)} />
        </div>
      ))}

      {matrices.length < MAX_MATRICES && (
        <Button variant="secondary" type="button" onClick={addMatrix}>+ Add Matrix</Button>
      )}

      <div className="rounded-xl border border-ink-100 p-4 dark:border-ink-700">
        <p className="mb-3 text-sm font-medium text-ink-700 dark:text-ink-300">Operation</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SelectField
            label="Operation"
            value={operation}
            onChange={(v) => setOperation(v as Operation)}
            options={(Object.keys(OPERATION_LABELS) as Operation[]).map((op) => ({ value: op, label: OPERATION_LABELS[op] }))}
          />
          <SelectField label={isBinary ? 'Matrix A' : 'Matrix'} value={operandX} onChange={setOperandX} options={matrixOptions} />
          {isBinary && (
            <SelectField label="Matrix B" value={operandY} onChange={setOperandY} options={matrixOptions} />
          )}
          {operation === 'scalar' && (
            <NumberField label="Scalar" value={scalar} onChange={(e) => setScalar(parseFloat(e.target.value) || 0)} />
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" onClick={handleCalculate}>Calculate</Button>
          <Button variant="ghost" type="button" onClick={clearResult}>Clear</Button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-400/40 bg-red-100/60 px-4 py-3 text-sm text-red-700 dark:border-red-700/40 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </div>
      )}

      {result !== null && (
        <ResultPanel>
          <p className="mb-2 text-sm font-medium text-ink-700 dark:text-ink-300">
            Result ({resultLabel}) — {typeof result === 'number'
              ? 'a single number for determinant.'
              : "numbers that don't fit scroll automatically, or press and hold a cell to see the full value."}
          </p>
          {typeof result === 'number' ? (
            <p className="text-3xl font-semibold text-ink-950 dark:text-ink-50">{formatFull(result)}</p>
          ) : (
            <ResultMatrixGrid matrix={result} />
          )}
        </ResultPanel>
      )}

      <InlineNote>
        Add up to {MAX_MATRICES} matrices, each with its own size. Add/Subtract/Multiply work on two selected
        matrices; Transpose, Determinant, Inverse, and Scalar Multiply work on one. Determinant and Inverse
        require a square matrix, and Inverse additionally requires a non-zero determinant.
      </InlineNote>
    </div>
  );
}
