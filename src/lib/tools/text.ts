export interface TextStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTimeMinutes: number;
  speakingTimeMinutes: number;
}

export function analyzeText(input: string): TextStats {
  const characters = input.length;
  const charactersNoSpaces = input.replace(/\s/g, '').length;
  const words = input.trim().length === 0 ? 0 : input.trim().split(/\s+/).length;
  const sentences = input.trim().length === 0 ? 0 : (input.match(/[^.!?]+[.!?]+/g) ?? (input.trim() ? [input] : [])).length;
  const paragraphs = input.trim().length === 0 ? 0 : input.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;
  const lines = input.length === 0 ? 0 : input.split('\n').length;

  const WORDS_PER_MINUTE_READING = 200;
  const WORDS_PER_MINUTE_SPEAKING = 130;

  return {
    words,
    characters,
    charactersNoSpaces,
    sentences,
    paragraphs,
    lines,
    readingTimeMinutes: words / WORDS_PER_MINUTE_READING,
    speakingTimeMinutes: words / WORDS_PER_MINUTE_SPEAKING,
  };
}

export function removeExtraSpaces(input: string): string {
  // 1. Normalize line endings first to avoid \r issues
  let result = input.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  // 2. For each line, collapse multiple spaces/tabs into a single space, then trim.
  result = result
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .join('\n');
  // 3. Remove 3 or more consecutive blank lines, keeping only two.
  result = result.replace(/\n{3,}/g, '\n\n');
  return result;
}

/** Trims only leading/trailing whitespace on each line — leaves internal spacing untouched. */
export function trimLines(input: string): string {
  return input
    .split('\n')
    .map((line) => line.trim())
    .join('\n');
}

/** Collapses runs of spaces/tabs into a single space, per line — does not trim or touch line breaks. */
export function collapseSpaces(input: string): string {
  return input
    .split('\n')
    .map((line) => line.replace(/[ \t]{2,}/g, ' '))
    .join('\n');
}

/** Removes lines that are empty or contain only whitespace. */
export function removeEmptyLines(input: string): string {
  return input
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .join('\n');
}

/** Normalizes Windows (\r\n) and old Mac (\r) line endings to \n. */
export function normalizeLineEndings(input: string): string {
  return input.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

export function removeDuplicateLines(input: string, caseSensitive = true): string {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const line of input.split('\n')) {
    const key = caseSensitive ? line : line.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      out.push(line);
    }
  }
  return out.join('\n');
}

export function sortLines(input: string, order: 'asc' | 'desc' = 'asc', numeric = false): string {
  const lines = input.split('\n');
  const compare = numeric
    ? (a: string, b: string) => (parseFloat(a) || 0) - (parseFloat(b) || 0)
    : (a: string, b: string) => a.localeCompare(b);
  lines.sort(compare);
  if (order === 'desc') lines.reverse();
  return lines.join('\n');
}

export function findAndReplace(input: string, find: string, replace: string, useRegex = false, caseSensitive = true): string {
  if (!find) return input;
  try {
    if (useRegex) {
      const flags = caseSensitive ? 'g' : 'gi';
      return input.replace(new RegExp(find, flags), replace);
    }
    const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const flags = caseSensitive ? 'g' : 'gi';
    return input.replace(new RegExp(escaped, flags), replace);
  } catch {
    return input;
  }
}

export interface DiffLine {
  type: 'same' | 'added' | 'removed';
  text: string;
}

/** Generic LCS-based diff over any array of comparable tokens (lines or words). */
function diffArray<T>(a: T[], b: T[], equal: (x: T, y: T) => boolean): { type: 'same' | 'added' | 'removed'; value: T }[] {
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i]![j] = equal(a[i]!, b[j]!) ? dp[i + 1]![j + 1]! + 1 : Math.max(dp[i + 1]![j]!, dp[i]![j + 1]!);
    }
  }
  const result: { type: 'same' | 'added' | 'removed'; value: T }[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (equal(a[i]!, b[j]!)) {
      result.push({ type: 'same', value: a[i]! });
      i++;
      j++;
    } else if (dp[i + 1]![j]! >= dp[i]![j + 1]!) {
      result.push({ type: 'removed', value: a[i]! });
      i++;
    } else {
      result.push({ type: 'added', value: b[j]! });
      j++;
    }
  }
  while (i < n) result.push({ type: 'removed', value: a[i++]! });
  while (j < m) result.push({ type: 'added', value: b[j++]! });
  return result;
}

/** Simple line-based diff (LCS-based), sufficient for short/medium text comparison. */
export function diffLines(a: string, b: string): DiffLine[] {
  return diffArray(a.split('\n'), b.split('\n'), (x, y) => x === y).map((r) => ({ type: r.type, text: r.value }));
}

export interface WordToken {
  type: 'same' | 'added' | 'removed';
  text: string;
}

/** Word-level diff — splits on whitespace boundaries while preserving the whitespace itself as tokens. */
export function diffWords(a: string, b: string): WordToken[] {
  const splitTokens = (s: string) => s.split(/(\s+)/).filter((t) => t.length > 0);
  return diffArray(splitTokens(a), splitTokens(b), (x, y) => x === y).map((r) => ({ type: r.type, text: r.value }));
}

export type ComparisonLine =
  | { kind: 'same'; text: string }
  | { kind: 'added'; text: string }
  | { kind: 'removed'; text: string }
  | { kind: 'changed'; removedText: string; addedText: string; tokens: WordToken[] };

export interface ComparisonSummary {
  added: number;
  removed: number;
  changed: number;
  unchanged: number;
}

/**
 * A "changed line" aware diff: adjacent single removed+added lines are
 * paired and word-diffed, so a one-word edit shows as an inline change
 * rather than two unrelated whole-line blocks.
 */
export function compareText(a: string, b: string): { lines: ComparisonLine[]; summary: ComparisonSummary } {
  const raw = diffLines(a, b);
  const lines: ComparisonLine[] = [];
  const summary: ComparisonSummary = { added: 0, removed: 0, changed: 0, unchanged: 0 };

  for (let i = 0; i < raw.length; i++) {
    const current = raw[i]!;
    const next = raw[i + 1];

    if (current.type === 'removed' && next && next.type === 'added') {
      lines.push({ kind: 'changed', removedText: current.text, addedText: next.text, tokens: diffWords(current.text, next.text) });
      summary.changed++;
      i++; // consume the paired 'added' line too
      continue;
    }

    if (current.type === 'same') {
      lines.push({ kind: 'same', text: current.text });
      summary.unchanged++;
    } else if (current.type === 'added') {
      lines.push({ kind: 'added', text: current.text });
      summary.added++;
    } else {
      lines.push({ kind: 'removed', text: current.text });
      summary.removed++;
    }
  }

  return { lines, summary };
}