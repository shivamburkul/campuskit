'use client';
import { useState } from 'react';
import { NumberField, TextField } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { ResultPanel, ResultStat, InlineNote } from '@/components/ui/Result';
import { roundTo } from '@/lib/tools/gpa';

interface Component {
  label: string;
  weightPercent: number;
  scorePercent: number;
}

export function GradeCalculator() {
  const [rows, setRows] = useState<Component[]>([
    { label: 'Assignments', weightPercent: 20, scorePercent: 0 },
    { label: 'Midterm', weightPercent: 30, scorePercent: 0 },
    { label: 'Final exam', weightPercent: 50, scorePercent: 0 },
  ]);

  function updateRow(index: number, patch: Partial<Component>) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  const totalWeight = rows.reduce((sum, r) => sum + r.weightPercent, 0);
  const finalGrade = rows.reduce((sum, r) => sum + (r.weightPercent * r.scorePercent) / 100, 0);

  return (
    <div>
      <div className="space-y-4">
        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr_1fr_auto] sm:gap-x-4 items-start">
            <TextField label={i === 0 ? 'Component' : ''} value={row.label} onChange={(e) => updateRow(i, { label: e.target.value })} id={`comp-${i}`} />
            <NumberField label={i === 0 ? 'Weight %' : ''} value={row.weightPercent || ''} onChange={(e) => updateRow(i, { weightPercent: parseFloat(e.target.value) || 0 })} id={`weight-${i}`} />
            <NumberField label={i === 0 ? 'Score %' : ''} value={row.scorePercent || ''} onChange={(e) => updateRow(i, { scorePercent: parseFloat(e.target.value) || 0 })} id={`score-${i}`} />
            <div className={`flex items-center pl-2 sm:pl-4 ${i === 0 ? 'mt-[1.625rem]' : ''}`}>
              <Button variant="ghost" type="button" onClick={() => setRows((prev) => prev.filter((_, idx) => idx !== i))} disabled={rows.length <= 1} className="px-3">
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button variant="secondary" type="button" className="mt-6" onClick={() => setRows((prev) => [...prev, { label: `Component ${prev.length + 1}`, weightPercent: 0, scorePercent: 0 }])}>
        + Add component
      </Button>

      <div className="mt-6">
        <ResultPanel>
          <ResultStat label="Total weight" value={`${roundTo(totalWeight, 2)}%`} />
          <ResultStat label="Final grade" value={`${roundTo(finalGrade, 2)}%`} emphasis />
          {Math.round(totalWeight) !== 100 && (
            <InlineNote tone="warning">
              Weights add up to {roundTo(totalWeight, 2)}%, not 100% — the result may not reflect your actual grading scheme.
            </InlineNote>
          )}
        </ResultPanel>
      </div>
    </div>
  );
}
