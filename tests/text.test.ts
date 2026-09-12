import { describe, it, expect } from 'vitest';
import {
  analyzeText,
  removeExtraSpaces,
  trimLines,
  collapseSpaces,
  removeEmptyLines,
  normalizeLineEndings,
  removeDuplicateLines,
  sortLines,
  findAndReplace,
  diffLines,
  diffWords,
  compareText,
} from '../src/lib/tools/text';

describe('analyzeText', () => {
  it('counts words and characters', () => {
    const result = analyzeText('Hello world');
    expect(result.words).toBe(2);
    expect(result.characters).toBe(11);
  });
  it('handles empty string', () => {
    const result = analyzeText('');
    expect(result.words).toBe(0);
    expect(result.sentences).toBe(0);
  });
  it('counts sentences correctly', () => {
    const result = analyzeText('One. Two! Three?');
    expect(result.sentences).toBe(3);
  });
});

describe('removeExtraSpaces', () => {
  it('collapses multiple spaces', () => {
    expect(removeExtraSpaces('a    b   c')).toBe('a b c');
  });
});

describe('removeDuplicateLines', () => {
  it('removes exact duplicate lines', () => {
    expect(removeDuplicateLines('a\nb\na\nc')).toBe('a\nb\nc');
  });
  it('is case-insensitive when requested', () => {
    expect(removeDuplicateLines('A\na', false)).toBe('A');
  });
});

describe('sortLines', () => {
  it('sorts ascending by default', () => {
    expect(sortLines('banana\napple\ncherry')).toBe('apple\nbanana\ncherry');
  });
  it('sorts numerically when requested', () => {
    expect(sortLines('10\n2\n1', 'asc', true)).toBe('1\n2\n10');
  });
});

describe('findAndReplace', () => {
  it('replaces plain text', () => {
    expect(findAndReplace('foo bar foo', 'foo', 'baz')).toBe('baz bar baz');
  });
  it('returns input unchanged for empty find term', () => {
    expect(findAndReplace('foo', '', 'bar')).toBe('foo');
  });
});

describe('diffLines', () => {
  it('detects identical text as all same', () => {
    const result = diffLines('a\nb', 'a\nb');
    expect(result.every((l) => l.type === 'same')).toBe(true);
  });
  it('detects additions and removals', () => {
    const result = diffLines('a\nb', 'a\nc');
    expect(result.some((l) => l.type === 'removed')).toBe(true);
    expect(result.some((l) => l.type === 'added')).toBe(true);
  });
});

describe('trimLines', () => {
  it('trims leading/trailing whitespace per line without touching internal spacing', () => {
    expect(trimLines('  a   b  \n  c  ')).toBe('a   b\nc');
  });
});

describe('collapseSpaces', () => {
  it('collapses internal runs of spaces without trimming', () => {
    expect(collapseSpaces('  a   b  c  ')).toBe(' a b c ');
  });
});

describe('removeEmptyLines', () => {
  it('drops blank and whitespace-only lines', () => {
    expect(removeEmptyLines('a\n\n  \nb')).toBe('a\nb');
  });
});

describe('normalizeLineEndings', () => {
  it('converts CRLF and CR to LF', () => {
    expect(normalizeLineEndings('a\r\nb\rc')).toBe('a\nb\nc');
  });
});

describe('diffWords', () => {
  it('detects a single-word change', () => {
    const tokens = diffWords('I study Computer Engineering.', 'I study Computer Science Engineering.');
    const added = tokens.filter((t) => t.type === 'added').map((t) => t.text);
    expect(added).toContain('Science');
  });
});

describe('compareText', () => {
  it('pairs an adjacent removed+added line as a single changed line', () => {
    const result = compareText('My name is Shiv and I study Computer Engineering.', 'My name is Shiv and I study Computer Science Engineering.');
    expect(result.summary.changed).toBe(1);
    expect(result.summary.added).toBe(0);
    expect(result.summary.removed).toBe(0);
    expect(result.lines[0]!.kind).toBe('changed');
  });

  it('reports unchanged lines correctly for identical text', () => {
    const result = compareText('a\nb', 'a\nb');
    expect(result.summary.unchanged).toBe(2);
    expect(result.summary.added + result.summary.removed + result.summary.changed).toBe(0);
  });

  it('reports pure additions', () => {
    const result = compareText('a', 'a\nb');
    expect(result.summary.added).toBe(1);
  });

  it('handles empty input on both sides', () => {
    const result = compareText('', '');
    expect(result.lines.length).toBe(1); // one empty-string line each side, treated as same
  });
});
