'use client';
import { useState } from 'react';
import { InlineNote } from '@/components/ui/Result';
import { decodeJwt } from '@/lib/tools/dev';

export function JwtDecoder() {
  const [token, setToken] = useState('');
  const result = token ? decodeJwt(token) : null;

  return (
    <div className="space-y-4">
      <textarea 
        value={token} 
        onChange={(e) => setToken(e.target.value)} 
        rows={4} 
        placeholder="Paste a JWT (header.payload.signature)…" 
        className="w-full resize-y rounded-md border border-ink-100 bg-surface p-3 font-mono text-sm shadow-sm outline-none focus:border-moss-500 focus:ring-1 focus:ring-moss-500" 
      />
      <InlineNote>
        This decodes the token locally in your browser and does not verify the signature. Never paste a JWT you don&apos;t trust into a public website — even one that processes it locally.
      </InlineNote>
      {result && result.error && <div className="mt-4"><InlineNote tone="warning">{result.error}</InlineNote></div>}
      {result && !result.error && (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-1.5 text-sm font-medium text-ink-700">Header</p>
            <pre className="overflow-auto rounded-md border border-ink-100 bg-ink-100/20 p-3 text-xs">{JSON.stringify(result.header, null, 2)}</pre>
          </div>
          <div>
            <p className="mb-1.5 text-sm font-medium text-ink-700">Payload</p>
            <pre className="overflow-auto rounded-md border border-ink-100 bg-ink-100/20 p-3 text-xs">{JSON.stringify(result.payload, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
