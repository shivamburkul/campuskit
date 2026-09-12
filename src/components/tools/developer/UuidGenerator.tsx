'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { NumberField } from '@/components/ui/Field';
import { generateUuidV4 } from '@/lib/tools/dev';

export function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [ids, setIds] = useState<string[]>(() => Array.from({ length: 5 }, () => generateUuidV4()));

  function regenerate() {
    setIds(Array.from({ length: Math.max(1, Math.min(count, 100)) }, () => generateUuidV4()));
  }

  return (
    <div>
      <div className="flex items-end gap-3">
        <NumberField label="How many?" value={count} min={1} max={100} onChange={(e) => setCount(parseInt(e.target.value, 10) || 1)} />
        <Button type="button" onClick={regenerate}>Generate</Button>
      </div>
      <div className="mt-5 space-y-1.5 rounded-md border border-ink-100 bg-ink-100/20 p-4 font-mono text-sm">
        {ids.map((id) => (
          <p key={id}>{id}</p>
        ))}
      </div>
      <Button variant="secondary" type="button" className="mt-3" onClick={() => navigator.clipboard.writeText(ids.join('\n'))}>Copy all</Button>
    </div>
  );
}
