'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { InlineNote } from '@/components/ui/Result';
import { encodeUrl, decodeUrl } from '@/lib/tools/dev';

export function UrlEncoderTool() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const decodeResult = mode === 'decode' ? decodeUrl(input) : null;
  const output = mode === 'encode' ? encodeUrl(input) : decodeResult?.output ?? '';
  const error = mode === 'decode' ? decodeResult?.error ?? null : null;

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <Button variant={mode === 'encode' ? 'primary' : 'secondary'} type="button" onClick={() => setMode('encode')}>Encode</Button>
        <Button variant={mode === 'decode' ? 'primary' : 'secondary'} type="button" onClick={() => setMode('decode')}>Decode</Button>
      </div>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={5} className="w-full resize-y rounded-md border border-ink-100 bg-surface p-3 font-mono text-sm shadow-sm outline-none focus:border-moss-500 focus:ring-1 focus:ring-moss-500" />
      <p className="mb-1.5 mt-4 text-sm font-medium text-ink-700">Output</p>
      <textarea readOnly value={output} rows={5} className="w-full resize-y rounded-md border border-ink-100 bg-ink-100/30 p-3 font-mono text-sm shadow-sm" />
      {error && <div className="mt-3"><InlineNote tone="warning">{error}</InlineNote></div>}
    </div>
  );
}
