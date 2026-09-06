'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ResultStat } from '@/components/ui/Result';
import {
  removeExtraSpaces,
  trimLines,
  collapseSpaces,
  removeEmptyLines,
  normalizeLineEndings,
  removeDuplicateLines,
  sortLines,
  analyzeText,
} from '@/lib/tools/text';

interface Operation {
  label: string;
  hint: string;
  run: (text: string) => string;
}

const OPERATIONS: Operation[] = [
  { label: 'Trim each line', hint: 'Removes leading/trailing spaces from every line only.', run: trimLines },
  { label: 'Collapse spaces', hint: 'Turns runs of multiple spaces into a single space.', run: collapseSpaces },
  { label: 'Remove extra spaces', hint: 'Trims and collapses spaces in one step.', run: removeExtraSpaces },
  { label: 'Remove empty lines', hint: 'Deletes blank or whitespace-only lines.', run: removeEmptyLines },
  {
    label: 'Remove duplicates',
    hint: 'Keeps the first occurrence of each line, removes later repeats (case-sensitive).',
    run: (t) => removeDuplicateLines(t, true),
  },
  {
    label: 'Remove duplicates (ignore case)',
    hint: 'Same as above, but "Apple" and "apple" count as duplicates.',
    run: (t) => removeDuplicateLines(t, false),
  },
  { label: 'Sort A → Z', hint: 'Sorts lines alphabetically.', run: (t) => sortLines(t, 'asc') },
  { label: 'Sort Z → A', hint: 'Sorts lines in reverse alphabetical order.', run: (t) => sortLines(t, 'desc') },
  { label: 'Normalize line endings', hint: 'Converts Windows/Mac line breaks to a single consistent format.', run: normalizeLineEndings },
];

export function TextCleaner() {
  const [text, setText] = useState('');
  const stats = analyzeText(text);

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste messy text here…"
        rows={12}
        aria-label="Text to clean"
        className="w-full resize-y rounded-md border border-ink-100 bg-surface p-4 text-sm text-ink-900 shadow-sm outline-none focus:border-moss-500 focus:ring-1 focus:ring-moss-500"
      />

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-500">
        <span>{stats.words} words</span>
        <span>{stats.characters} characters</span>
        <span>{stats.lines} lines</span>
      </div>

      <fieldset className="mt-5">
        <legend className="text-sm font-medium text-ink-700">
          Each button applies one operation, in place, so you can combine them in any order.
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {OPERATIONS.map((op) => (
            <Button key={op.label} variant="secondary" type="button" title={op.hint} onClick={() => setText((t) => op.run(t))}>
              {op.label}
            </Button>
          ))}
          <Button variant="ghost" type="button" onClick={() => setText('')}>
            Clear
          </Button>
          <Button
            variant="ghost"
            type="button"
            disabled={!text}
            onClick={() => navigator.clipboard.writeText(text)}
          >
            Copy result
          </Button>
        </div>
      </fieldset>

      <div className="mt-6 rounded-lg border border-moss-100 bg-moss-100/40 p-4">
        <ResultStat label="Words" value={stats.words} />
        <ResultStat label="Characters" value={stats.characters} />
        <ResultStat label="Lines" value={stats.lines} />
      </div>
    </div>
  );
}