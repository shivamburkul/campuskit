/** Shared matrix math: add, subtract, multiply, transpose, determinant, inverse, scalar multiply. */

export type Matrix = number[][];

export function dimensions(m: Matrix): { rows: number; cols: number } {
  return { rows: m.length, cols: m[0]?.length ?? 0 };
}

export function isSquare(m: Matrix): boolean {
  const { rows, cols } = dimensions(m);
  return rows === cols && rows > 0;
}

export function addMatrices(a: Matrix, b: Matrix): Matrix {
  const da = dimensions(a);
  const db = dimensions(b);
  if (da.rows !== db.rows || da.cols !== db.cols) {
    throw new Error(`Cannot add: A is ${da.rows}×${da.cols}, B is ${db.rows}×${db.cols}. Dimensions must match.`);
  }
  return a.map((row, i) => row.map((val, j) => val + b[i]![j]!));
}

export function subtractMatrices(a: Matrix, b: Matrix): Matrix {
  const da = dimensions(a);
  const db = dimensions(b);
  if (da.rows !== db.rows || da.cols !== db.cols) {
    throw new Error(`Cannot subtract: A is ${da.rows}×${da.cols}, B is ${db.rows}×${db.cols}. Dimensions must match.`);
  }
  return a.map((row, i) => row.map((val, j) => val - b[i]![j]!));
}

export function multiplyMatrices(a: Matrix, b: Matrix): Matrix {
  const da = dimensions(a);
  const db = dimensions(b);
  if (da.cols !== db.rows) {
    throw new Error(`Cannot multiply: A is ${da.rows}×${da.cols}, B is ${db.rows}×${db.cols}. A's columns must equal B's rows.`);
  }
  const result: Matrix = [];
  for (let i = 0; i < da.rows; i++) {
    const row: number[] = [];
    for (let j = 0; j < db.cols; j++) {
      let sum = 0;
      for (let k = 0; k < da.cols; k++) sum += a[i]![k]! * b[k]![j]!;
      row.push(sum);
    }
    result.push(row);
  }
  return result;
}

export function transposeMatrix(m: Matrix): Matrix {
  const { rows, cols } = dimensions(m);
  const result: Matrix = Array.from({ length: cols }, () => new Array(rows).fill(0));
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result[j]![i] = m[i]![j]!;
    }
  }
  return result;
}

export function scalarMultiply(m: Matrix, scalar: number): Matrix {
  return m.map((row) => row.map((val) => val * scalar));
}

/** Determinant via Gaussian elimination with partial pivoting — O(n^3), numerically stable for reasonable inputs. */
export function determinant(m: Matrix): number {
  if (!isSquare(m)) {
    const { rows, cols } = dimensions(m);
    throw new Error(`Determinant requires a square matrix (got ${rows}×${cols}).`);
  }
  const n = m.length;
  const a = m.map((row) => [...row]); // work on a copy
  let det = 1;

  for (let col = 0; col < n; col++) {
    // Partial pivot: find the row with the largest absolute value in this column.
    let pivotRow = col;
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(a[row]![col]!) > Math.abs(a[pivotRow]![col]!)) pivotRow = row;
    }
    if (Math.abs(a[pivotRow]![col]!) < 1e-12) return 0; // singular

    if (pivotRow !== col) {
      [a[col], a[pivotRow]] = [a[pivotRow]!, a[col]!];
      det *= -1; // row swap flips the sign of the determinant
    }

    det *= a[col]![col]!;

    for (let row = col + 1; row < n; row++) {
      const factor = a[row]![col]! / a[col]![col]!;
      for (let k = col; k < n; k++) {
        a[row]![k] = a[row]![k]! - factor * a[col]![k]!;
      }
    }
  }

  // Clean up floating-point noise (e.g. -3.5527e-15 instead of 0).
  return Math.abs(det) < 1e-9 ? 0 : Math.round(det * 1e9) / 1e9;
}

/** Matrix inverse via Gauss-Jordan elimination with partial pivoting. Throws if the matrix is singular or non-square. */
export function inverseMatrix(m: Matrix): Matrix {
  if (!isSquare(m)) {
    const { rows, cols } = dimensions(m);
    throw new Error(`Inverse requires a square matrix (got ${rows}×${cols}).`);
  }
  const n = m.length;
  // Augmented matrix [M | I]
  const aug: Matrix = m.map((row, i) => [
    ...row,
    ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)),
  ]);

  for (let col = 0; col < n; col++) {
    let pivotRow = col;
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(aug[row]![col]!) > Math.abs(aug[pivotRow]![col]!)) pivotRow = row;
    }
    if (Math.abs(aug[pivotRow]![col]!) < 1e-12) {
      throw new Error('This matrix is singular (determinant = 0) and has no inverse.');
    }
    if (pivotRow !== col) [aug[col], aug[pivotRow]] = [aug[pivotRow]!, aug[col]!];

    const pivotVal = aug[col]![col]!;
    for (let k = 0; k < 2 * n; k++) aug[col]![k] = aug[col]![k]! / pivotVal;

    for (let row = 0; row < n; row++) {
      if (row === col) continue;
      const factor = aug[row]![col]!;
      for (let k = 0; k < 2 * n; k++) {
        aug[row]![k] = aug[row]![k]! - factor * aug[col]![k]!;
      }
    }
  }

  return aug.map((row) => row.slice(n).map((v) => (Math.abs(v) < 1e-9 ? 0 : Math.round(v * 1e9) / 1e9)));
}
