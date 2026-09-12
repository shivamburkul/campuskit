'use client';
import { useState } from 'react';
import { NumberField, TextField } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { ResultPanel, ResultStat, InlineNote } from '@/components/ui/Result';
import { calculateWeightedGpa, CourseEntry } from '@/lib/tools/gpa';

export function GpaCalculator() {
  const [rows, setRows] = useState<CourseEntry[]>([
    { label: 'Course 1', credits: 0, gradePoint: 0 },
    { label: 'Course 2', credits: 0, gradePoint: 0 },
  ]);

  const result = calculateWeightedGpa(rows);

  function updateRow(index: number, patch: Partial<CourseEntry>) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  return (
    <div>
      <div className="space-y-4">
        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr_1fr_auto] sm:gap-x-4 items-start">
            <TextField label={i === 0 ? 'Course' : ''} value={row.label} onChange={(e) => updateRow(i, { label: e.target.value })} id={`course-${i}`} />
            <NumberField label={i === 0 ? 'Credits' : ''} value={row.credits || ''} min={0} onChange={(e) => updateRow(i, { credits: parseFloat(e.target.value) || 0 })} id={`credits-${i}`} />
            <NumberField label={i === 0 ? 'Grade point' : ''} value={row.gradePoint || ''} min={0} step={0.01} onChange={(e) => updateRow(i, { gradePoint: parseFloat(e.target.value) || 0 })} id={`gp-${i}`} />
            <div className={`flex items-center pl-2 sm:pl-4 ${i === 0 ? 'mt-[1.625rem]' : ''}`}>
              <Button variant="ghost" type="button" onClick={() => setRows((prev) => prev.filter((_, idx) => idx !== i))} disabled={rows.length <= 1} className="px-3">
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button variant="secondary" type="button" className="mt-6" onClick={() => setRows((prev) => [...prev, { label: `Course ${prev.length + 1}`, credits: 0, gradePoint: 0 }])}>
        + Add course
      </Button>

      <div className="mt-6">
        <ResultPanel>
          <div className="mt-2">
            <ResultStat label="Total credits" value={result.totalCredits} />
            <ResultStat label="GPA" value={result.gpa || '—'} emphasis />
          </div>
        </ResultPanel>
      </div>

      <div className="mt-6">
        <InlineNote>
          This is a standard credit-weighted GPA (sum of credits × grade point ÷ total credits). Use your institution&apos;s
          published grade points, not letter grades directly.
        </InlineNote>
      </div>
    </div>
  );
}
