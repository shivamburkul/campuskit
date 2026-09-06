'use client';
import { useState } from 'react';
import { NumberField, TextField } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { ResultPanel, ResultStat } from '@/components/ui/Result';
import { splitExpensesEqually, Participant } from '@/lib/tools/finance';

export function ExpenseSplitter() {
  const [rows, setRows] = useState<Participant[]>([
    { name: 'You', paid: 0 },
    { name: 'Roommate', paid: 0 },
  ]);

  function updateRow(index: number, patch: Partial<Participant>) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  const result = splitExpensesEqually(rows);

  return (
    <div>
      <div className="space-y-4">
        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr_auto] sm:gap-x-4 items-start">
            <TextField label={i === 0 ? 'Name' : ''} value={row.name} onChange={(e) => updateRow(i, { name: e.target.value })} id={`name-${i}`} />
            <NumberField label={i === 0 ? 'Amount paid' : ''} value={row.paid || ''} onChange={(e) => updateRow(i, { paid: parseFloat(e.target.value) || 0 })} id={`paid-${i}`} />
            <div className={i === 0 ? 'flex items-end pt-1 pl-4' : 'flex items-center pt-1 pl-4'}>
              <Button variant="ghost" type="button" onClick={() => setRows((prev) => prev.filter((_, idx) => idx !== i))} disabled={rows.length <= 2} className="px-3">
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button variant="secondary" type="button" className="mt-6" onClick={() => setRows((prev) => [...prev, { name: `Person ${prev.length + 1}`, paid: 0 }])}>
        + Add person
      </Button>

      <div className="mt-6">
        <ResultPanel>
          <ResultStat label="Total spent" value={result.totalSpent} />
          <ResultStat label="Fair share per person" value={result.perPerson} emphasis />
          {result.settlements.length > 0 && (
            <div className="mt-3 space-y-1.5 border-t border-moss-500/20 pt-3">
              {result.settlements.map((s, i) => (
                <p key={i} className="text-sm text-ink-800">
                  <strong>{s.from}</strong> pays <strong>{s.to}</strong> {s.amount}
                </p>
              ))}
            </div>
          )}
        </ResultPanel>
      </div>
    </div>
  );
}