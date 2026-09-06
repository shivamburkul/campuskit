'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { InlineNote } from '@/components/ui/Result';
import { formatJson, minifyJson } from '@/lib/tools/dev';

export function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleFormat() {
    const result = formatJson(input);
    setOutput(result.output);
    setError(result.error);
  }
  function handleMinify() {
    const result = minifyJson(input);
    setOutput(result.output);
    setError(result.error);
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div>
        <p className="mb-1.5 text-sm font-medium text-ink-700">Input</p>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={14} placeholder='{"example": true}' className="w-full resize-y rounded-md border border-ink-100 bg-surface p-3 font-mono text-sm shadow-sm outline-none focus:border-moss-500 focus:ring-1 focus:ring-moss-500" />
        <div className="mt-3 flex gap-2">
          <Button type="button" onClick={handleFormat}>Format</Button>
          <Button variant="secondary" type="button" onClick={handleMinify}>Minify</Button>
        </div>
      </div>
      <div>
        <p className="mb-1.5 text-sm font-medium text-ink-700">Output</p>
        <textarea readOnly value={output} rows={14} className="w-full resize-y rounded-md border border-ink-100 bg-ink-100/30 p-3 font-mono text-sm shadow-sm" />
        {error && <div className="mt-3"><InlineNote tone="warning">{error}</InlineNote></div>}
        {output && !error && <Button variant="secondary" type="button" className="mt-3" onClick={() => navigator.clipboard.writeText(output)}>Copy</Button>}
      </div>
    </div>
  );
}
