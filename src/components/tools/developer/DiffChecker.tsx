'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { diffLines } from '@/lib/tools/text';
import { ResultStat } from '@/components/ui/Result';

export function DiffChecker() {
  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  
  const diff = textA || textB ? diffLines(textA, textB) : [];
  
  const added = diff.filter((d) => d.type === 'added').length;
  const removed = diff.filter((d) => d.type === 'removed').length;
  const same = diff.filter((d) => d.type === 'same').length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-ink-700 dark:text-ink-300">Original Code</label>
          <textarea
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            rows={10}
            placeholder="Paste original code here..."
            className="mt-1.5 w-full resize-y rounded-md border border-ink-100 bg-surface p-3 font-mono text-sm shadow-sm outline-none focus:border-moss-500 focus:ring-1 focus:ring-moss-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink-700 dark:text-ink-300">Modified Code</label>
          <textarea
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            rows={10}
            placeholder="Paste modified code here..."
            className="mt-1.5 w-full resize-y rounded-md border border-ink-100 bg-surface p-3 font-mono text-sm shadow-sm outline-none focus:border-moss-500 focus:ring-1 focus:ring-moss-500"
          />
        </div>
      </div>

      {(textA || textB) && (
        <>
          <div className="flex gap-4 text-sm">
            <span className="text-green-600 font-medium">+ {added} added</span>
            <span className="text-red-600 font-medium">- {removed} removed</span>
            <span className="text-ink-500">{same} unchanged</span>
          </div>

          <div className="border border-ink-100 rounded-md overflow-hidden">
            {diff.map((line, i) => (
              <div
                key={i}
                className={`px-3 py-1 font-mono text-sm ${
                  line.type === 'added'
                    ? 'bg-green-100 text-green-700'
                    : line.type === 'removed'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-white text-ink-700 dark:bg-ink-900 dark:text-ink-300'
                }`}
              >
                <span className="mr-2 select-none text-ink-300">{i + 1}</span>
                {line.type === 'added' ? '+ ' : line.type === 'removed' ? '- ' : '  '}
                {line.text}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
