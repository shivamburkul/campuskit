'use client';
import { useState } from 'react';
import { NumberField, TextField } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { ResultPanel, ResultStat, InlineNote } from '@/components/ui/Result';
import { calculateCgpaFromSemesters, SemesterEntry } from '@/lib/tools/gpa';

const EMPTY_ROW: SemesterEntry = { label: '', sgpa: 0, credits: 0 };

export function CgpaCalculator() {
  const [rows, setRows] = useState<SemesterEntry[]>([
    { label: 'Semester 1', sgpa: 0, credits: 0 },
    { label: 'Semester 2', sgpa: 0, credits: 0 },
  ]);

  const result = calculateCgpaFromSemesters(rows);

  function updateRow(index: number, patch: Partial<SemesterEntry>) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  return (
    <div>
      <div className="space-y-4">
        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr_1fr_auto] sm:gap-x-4 items-start">
            <TextField
              label={i === 0 ? 'Semester' : ''}
              value={row.label}
              onChange={(e) => updateRow(i, { label: e.target.value })}
              id={`sem-label-${i}`}
            />
            <NumberField
              label={i === 0 ? 'SGPA' : ''}
              value={row.sgpa || ''}
              min={0}
              step={0.01}
              onChange={(e) => updateRow(i, { sgpa: parseFloat(e.target.value) || 0 })}
              id={`sem-sgpa-${i}`}
            />
            <NumberField
              label={i === 0 ? 'Credits' : ''}
              value={row.credits || ''}
              min={0}
              onChange={(e) => updateRow(i, { credits: parseFloat(e.target.value) || 0 })}
              id={`sem-credits-${i}`}
            />
            <div className={i === 0 ? 'flex items-end pt-1 pl-4' : 'flex items-center pt-1 pl-4'}>
              <Button
                variant="ghost"
                type="button"
                aria-label={`Remove ${row.label || 'semester'}`}
                onClick={() => setRows((prev) => prev.filter((_, idx) => idx !== i))}
                disabled={rows.length <= 1}
                className="px-3"
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button variant="secondary" type="button" className="mt-6" onClick={() => setRows((prev) => [...prev, { ...EMPTY_ROW, label: `Semester ${prev.length + 1}` }])}>
        + Add semester
      </Button>

      <div className="mt-6">
        <ResultPanel>
          <div className="mt-2">
            <ResultStat label="Total credits" value={result.totalCredits} />
            <ResultStat label="CGPA" value={result.gpa || '—'} emphasis />
          </div>
        </ResultPanel>
      </div>

      <div className="mt-6">
        <InlineNote>
          This calculates a credit-weighted CGPA from the SGPA and credits you enter. CampusKit doesn&apos;t assume a single
          university formula — enter your own official SGPA and credit values for an accurate result, and verify against
          your transcript.
        </InlineNote>
      </div>
    </div>
  );
}