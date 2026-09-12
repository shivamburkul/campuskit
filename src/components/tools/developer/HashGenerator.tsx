'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ResultStat, InlineNote } from '@/components/ui/Result';
import { md5 } from '@/lib/tools/md5';

async function generateHash(text: string, algorithm: 'SHA-256' | 'SHA-512' | 'MD5'): Promise<string> {
  if (algorithm === 'MD5') {
    return md5(text);
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function HashGenerator() {
  const [input, setInput] = useState('');
  const [algorithm, setAlgorithm] = useState<'SHA-256' | 'SHA-512' | 'MD5'>('SHA-256');
  const [hash, setHash] = useState('');
  const [working, setWorking] = useState(false);

  const handleGenerate = async () => {
    if (!input) return;
    setWorking(true);
    try {
      const result = await generateHash(input, algorithm);
      setHash(result);
    } catch {
      setHash('Error generating hash');
    } finally {
      setWorking(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr]">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          className="w-full resize-y rounded-xl border border-ink-200/70 bg-surface px-4 py-3 text-ink-900 shadow-sm outline-none transition-all duration-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
          placeholder="Enter text to hash..."
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-ink-700 dark:text-ink-300">Algorithm</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as 'SHA-256' | 'SHA-512' | 'MD5')}
            className="w-full rounded-xl border border-ink-200/70 bg-surface px-4 py-3 text-ink-900 shadow-sm outline-none transition-all duration-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
          >
            <option value="SHA-256">SHA-256</option>
            <option value="SHA-512">SHA-512</option>
            <option value="MD5">MD5</option>
          </select>
          <Button type="button" onClick={handleGenerate} disabled={working || !input} className="mt-2">
            {working ? 'Generating...' : 'Generate'}
          </Button>
        </div>
      </div>

      {hash && (
        <div className="rounded-xl border border-white/30 bg-white/30 p-4 backdrop-blur-[24px] saturate-180 dark:border-white/10 dark:bg-ink-900/70">
          <p className="text-sm font-medium text-ink-700 dark:text-ink-300">Hash</p>
          <p className="font-mono text-sm break-all text-ink-950 dark:text-ink-50">{hash}</p>
          <Button variant="secondary" type="button" className="mt-2" onClick={() => navigator.clipboard.writeText(hash)}>Copy</Button>
        </div>
      )}

      {algorithm === 'MD5' && (
        <InlineNote tone="warning">
          MD5 is useful for checksums (e.g. verifying a file wasn&apos;t corrupted), but it is not
          cryptographically secure. Use SHA-256 or SHA-512 for passwords, signatures, or anything
          security-sensitive.
        </InlineNote>
      )}
    </div>
  );
}
