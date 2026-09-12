'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { NumberField } from '@/components/ui/Field';
import { ResultPanel, ResultStat } from '@/components/ui/Result';

interface Semester {
  id: number;
  name: string;
  gpa: number;
}

export function GpaTracker() {
  const [semesters, setSemesters] = useState<Semester[]>([
    { id: 1, name: 'Semester 1', gpa: 8.5 },
    { id: 2, name: 'Semester 2', gpa: 9.0 },
  ]);
  const [nextId, setNextId] = useState(3);

  const avgGpa = semesters.length > 0 
    ? semesters.reduce((sum, s) => sum + s.gpa, 0) / semesters.length 
    : 0;

  const highestGpa = semesters.length > 0
    ? Math.max(...semesters.map((s) => s.gpa))
    : 0;

  const lowestGpa = semesters.length > 0
    ? Math.min(...semesters.map((s) => s.gpa))
    : 0;

  function updateSemester(id: number, patch: Partial<Semester>) {
    setSemesters(semesters.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  function addSemester() {
    setSemesters([...semesters, { id: nextId, name: `Semester ${nextId}`, gpa: 0 }]);
    setNextId(nextId + 1);
  }

  function removeSemester(id: number) {
    setSemesters(semesters.filter((s) => s.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {semesters.map((sem) => (
          <div key={sem.id} className="grid grid-cols-1 gap-2 sm:grid-cols-[2fr_1fr_auto]">
            <input
              type="text"
              value={sem.name}
              onChange={(e) => updateSemester(sem.id, { name: e.target.value })}
              className="rounded-xl border border-ink-200/70 bg-surface px-4 py-3 text-ink-900"
            />
            <NumberField
              value={sem.gpa || ''}
              min={0}
              max={10}
              step={0.01}
              onChange={(e) => updateSemester(sem.id, { gpa: parseFloat(e.target.value) || 0 })}
            />
            <Button variant="ghost" type="button" onClick={() => removeSemester(sem.id)}>Remove</Button>
          </div>
        ))}
      </div>

      <Button variant="secondary" type="button" onClick={addSemester}>
        + Add Semester
      </Button>

      <ResultPanel>
        <ResultStat label="Average GPA" value={avgGpa.toFixed(2)} emphasis />
        <ResultStat label="Highest GPA" value={highestGpa.toFixed(2)} />
        <ResultStat label="Lowest GPA" value={lowestGpa.toFixed(2)} />
        <ResultStat label="Total Semesters" value={semesters.length} />
      </ResultPanel>
    </div>
  );
}
