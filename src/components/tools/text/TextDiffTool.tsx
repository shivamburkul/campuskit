'use client';
import { Fragment, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { compareText, WordToken } from '@/lib/tools/text';

function WordDiff({ tokens, mode }: { tokens: WordToken[]; mode: 'removed' | 'added' }) {
  return (
    <>
      {tokens
        .filter((t) => t.type === 'same' || t.type === mode)
        .map((t, i) =>
          t.type === 'same' ? (
            <span key={i}>{t.text}</span>
          ) : (
            <mark
              key={i}
              className={
                mode === 'removed'
                  ? 'rounded bg-red-100 px-0.5 text-red-600 line-through decoration-2'
                  : 'rounded bg-moss-100 px-0.5 text-moss-600'
              }
            >
              {t.text}
            </mark>
          )
        )}
    </>
  );
}

export function TextDiffTool() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [hideUnchanged, setHideUnchanged] = useState(false);
  const { lines, summary } = useMemo(() => compareText(a, b), [a, b]);
  const hasInput = a.length > 0 || b.length > 0;

  const filteredLines = useMemo(() => {
    if (!hideUnchanged) return lines;
    return lines.filter((line) => line.kind !== 'same');
  }, [lines, hideUnchanged]);

  const plainTextResult = useMemo(
    () =>
      lines
        .map((line) => {
          if (line.kind === 'same') return `  ${line.text}`;
          if (line.kind === 'added') return `+ ${line.text}`;
          if (line.kind === 'removed') return `- ${line.text}`;
          return `- ${line.removedText}\n+ ${line.addedText}`;
        })
        .join('\n'),
    [lines]
  );

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="diff-original" className="mb-1.5 block text-sm font-medium text-ink-700">
            Original
          </label>
          <textarea
            id="diff-original"
            value={a}
            onChange={(e) => setA(e.target.value)}
            rows={10}
            className="w-full resize-y rounded-md border border-ink-100 bg-surface p-3 text-sm shadow-sm outline-none focus:border-moss-500 focus:ring-1 focus:ring-moss-500"
          />
        </div>
        <div>
          <label htmlFor="diff-changed" className="mb-1.5 block text-sm font-medium text-ink-700">
            Changed
          </label>
          <textarea
            id="diff-changed"
            value={b}
            onChange={(e) => setB(e.target.value)}
            rows={10}
            className="w-full resize-y rounded-md border border-ink-100 bg-surface p-3 text-sm shadow-sm outline-none focus:border-moss-500 focus:ring-1 focus:ring-moss-500"
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button variant="ghost" type="button" onClick={() => { setA(''); setB(''); }}>
          Clear
        </Button>
        <Button variant="ghost" type="button" disabled={!hasInput} onClick={() => navigator.clipboard.writeText(plainTextResult)}>
          Copy diff
        </Button>
        <label className="flex items-center gap-2 text-sm text-ink-700">
          <input
            type="checkbox"
            checked={hideUnchanged}
            onChange={(e) => setHideUnchanged(e.target.checked)}
          />
          Hide unchanged lines
        </label>
      </div>

      {hasInput && (
        <>
          <div className="mt-5 flex flex-wrap gap-4 text-sm" role="status">
            <span className="flex items-center gap-1.5 text-moss-600">
              <span className="inline-block h-2.5 w-2.5 rounded-sm bg-moss-500" aria-hidden="true" /> {summary.added} line{summary.added === 1 ? '' : 's'} added
            </span>
            <span className="flex items-center gap-1.5 text-red-600">
              <span className="inline-block h-2.5 w-2.5 rounded-sm bg-red-600" aria-hidden="true" /> {summary.removed} line{summary.removed === 1 ? '' : 's'} removed
            </span>
            <span className="flex items-center gap-1.5 text-amber-600">
              <span className="inline-block h-2.5 w-2.5 rounded-sm bg-amber-500" aria-hidden="true" /> {summary.changed} line{summary.changed === 1 ? '' : 's'} changed
            </span>
            <span className="text-ink-500">{summary.unchanged} unchanged</span>
          </div>

          <div className="mt-3 overflow-x-auto rounded-md border border-ink-100">
            <table className="w-full border-collapse font-mono text-sm">
              <tbody>
                {filteredLines.map((line, i) => {
                  if (line.kind === 'same') {
                    return (
                      <tr key={i} className="align-top text-ink-700">
                        <td className="w-6 select-none border-r border-ink-100 px-2 py-1 text-right text-ink-300" aria-hidden="true">{i + 1}</td>
                        <td className="w-5 select-none px-1 py-1 text-ink-300" aria-hidden="true"> </td>
                        <td className="whitespace-pre-wrap px-2 py-1">{line.text || ' '}</td>
                      </tr>
                    );
                  }
                  if (line.kind === 'added') {
                    return (
                      <tr key={i} className="align-top bg-moss-100/50 text-moss-600">
                        <td className="w-6 select-none border-r border-ink-100 px-2 py-1 text-right text-ink-300" aria-hidden="true">{i + 1}</td>
                        <td className="w-5 select-none px-1 py-1 font-bold" aria-hidden="true">+</td>
                        <td className="whitespace-pre-wrap px-2 py-1">{line.text || ' '}</td>
                      </tr>
                    );
                  }
                  if (line.kind === 'removed') {
                    return (
                      <tr key={i} className="align-top bg-red-100/60 text-red-600">
                        <td className="w-6 select-none border-r border-ink-100 px-2 py-1 text-right text-ink-300" aria-hidden="true">{i + 1}</td>
                        <td className="w-5 select-none px-1 py-1 font-bold" aria-hidden="true">-</td>
                        <td className="whitespace-pre-wrap px-2 py-1 line-through decoration-1">{line.text || ' '}</td>
                      </tr>
                    );
                  }
                  // changed
                  return (
                    <Fragment key={i}>
                      <tr className="align-top bg-red-100/40 text-red-600">
                        <td className="w-6 select-none border-r border-ink-100 px-2 py-1 text-right text-ink-300" aria-hidden="true">{i + 1}</td>
                        <td className="w-5 select-none px-1 py-1 font-bold" aria-hidden="true">-</td>
                        <td className="whitespace-pre-wrap px-2 py-1">
                          <WordDiff tokens={line.tokens} mode="removed" />
                        </td>
                      </tr>
                      <tr className="align-top bg-moss-100/40 text-moss-600">
                        <td className="w-6 select-none border-r border-ink-100 px-2 py-1 text-right text-ink-300" aria-hidden="true"> </td>
                        <td className="w-5 select-none px-1 py-1 font-bold" aria-hidden="true">+</td>
                        <td className="whitespace-pre-wrap px-2 py-1">
                          <WordDiff tokens={line.tokens} mode="added" />
                        </td>
                      </tr>
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}