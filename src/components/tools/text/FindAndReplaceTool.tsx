'use client';
import { useState } from 'react';
import { TextField } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { findAndReplace } from '@/lib/tools/text';

export function FindAndReplaceTool() {
  const [text, setText] = useState('');
  const [find, setFind] = useState('');
  const [replace, setReplace] = useState('');
  const [useRegex, setUseRegex] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(true);

  const output = findAndReplace(text, find, replace, useRegex, caseSensitive);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TextField label="Find" value={find} onChange={(e) => setFind(e.target.value)} />
        <TextField label="Replace with" value={replace} onChange={(e) => setReplace(e.target.value)} />
      </div>
      <div className="flex gap-4 text-sm text-ink-700">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={useRegex} onChange={(e) => setUseRegex(e.target.checked)} /> Use regex
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} /> Case sensitive
        </label>
      </div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste your text here…" rows={8} className="w-full resize-y rounded-md border border-ink-100 bg-surface p-4 text-sm shadow-sm outline-none focus:border-moss-500 focus:ring-1 focus:ring-moss-500" />
      <div>
        <p className="mb-1.5 text-sm font-medium text-ink-700">Result</p>
        <textarea readOnly value={output} rows={8} className="w-full resize-y rounded-md border border-ink-100 bg-ink-100/30 p-4 text-sm shadow-sm" />
      </div>
      <Button variant="secondary" type="button" onClick={() => navigator.clipboard.writeText(output)}>Copy result</Button>
    </div>
  );
}
