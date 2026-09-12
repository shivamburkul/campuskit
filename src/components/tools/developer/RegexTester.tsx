'use client';
import { useState } from 'react';
import { TextField } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { ResultPanel, ResultStat } from '@/components/ui/Result';

export function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [flags, setFlags] = useState('g');
  const [matches, setMatches] = useState<RegExpExecArray[]>([]);
  const [error, setError] = useState<string | null>(null);

  const testRegex = () => {
    setError(null);
    setMatches([]);
    if (!pattern) return;
    try {
      const regex = new RegExp(pattern, flags);
      const results: RegExpExecArray[] = [];
      let match;
      let guard = 0;
      while ((match = regex.exec(testString)) !== null) {
        results.push(match);
        if (!flags.includes('g')) break;
        // A zero-width match (e.g. pattern "a*" with no "a" in the text) doesn't
        // advance lastIndex on its own, which would loop forever — advance manually.
        if (match[0].length === 0) {
          regex.lastIndex += 1;
        }
        guard += 1;
        if (guard > 10000 || regex.lastIndex > testString.length) break;
      }
      setMatches(results);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid regex pattern');
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr]">
        <TextField label="Pattern" value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="e.g. [a-z]+" />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-ink-700 dark:text-ink-300">Flags</label>
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            placeholder="g, i, m, s, u, y"
            className="w-full rounded-xl border border-ink-200/70 bg-surface px-4 py-3 text-ink-900 shadow-sm outline-none transition-all duration-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-ink-700 dark:text-ink-300">Test string</label>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          rows={6}
          className="mt-1.5 w-full resize-y rounded-xl border border-ink-200/70 bg-surface px-4 py-3 text-ink-900 shadow-sm outline-none transition-all duration-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
          placeholder="Enter text to test against the regex..."
        />
      </div>
      <Button type="button" onClick={testRegex}>Test Regex</Button>

      {error && (
        <div className="rounded-xl border border-red-400/40 bg-red-100/60 px-4 py-3 text-sm text-red-700 dark:border-red-700/40 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </div>
      )}

      {matches.length > 0 && (
        <ResultPanel>
          <ResultStat label="Matches found" value={matches.length} emphasis />
          <div className="mt-3 space-y-2">
            {matches.map((match, i) => (
              <div key={i} className="rounded-lg border border-ink-100 p-3 dark:border-ink-700">
                <p className="text-sm font-medium text-ink-950 dark:text-ink-50">Match {i + 1}</p>
                <p className="text-sm text-ink-700 dark:text-ink-300">Text: <span className="font-mono">{match[0]}</span></p>
                <p className="text-sm text-ink-700 dark:text-ink-300">Index: {match.index}</p>
                {match.groups && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-ink-950 dark:text-ink-50">Groups:</p>
                    <ul className="text-sm text-ink-700 dark:text-ink-300">
                      {Object.entries(match.groups).map(([key, value]) => (
                        <li key={key}>{key}: {value}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ResultPanel>
      )}
    </div>
  );
}
