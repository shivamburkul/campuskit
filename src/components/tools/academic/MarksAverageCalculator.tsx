'use client';
import { useState } from 'react';
import { NumberField, TextField } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { ResultPanel, ResultStat } from '@/components/ui/Result';

interface Subject {
  id: number;
  name: string;
  marks: number;
  maxMarks: number;
}

export function MarksAverageCalculator() {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 1, name: 'Mathematics', marks: 0, maxMarks: 100 },
    { id: 2, name: 'Physics', marks: 0, maxMarks: 100 },
    { id: 3, name: 'Chemistry', marks: 0, maxMarks: 100 },
  ]);
  const [nextId, setNextId] = useState(4);

  const totalMarks = subjects.reduce((sum, s) => sum + s.marks, 0);
  const totalMaxMarks = subjects.reduce((sum, s) => sum + s.maxMarks, 0);
  const averagePercentage = totalMaxMarks > 0 ? (totalMarks / totalMaxMarks) * 100 : 0;
  const simpleAverage = subjects.length > 0 ? totalMarks / subjects.length : 0;

  const updateSubject = (id: number, patch: Partial<Subject>) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, ...patch } : s));
  };

  const addSubject = () => {
    setSubjects([...subjects, { id: nextId, name: `Subject ${nextId}`, marks: 0, maxMarks: 100 }]);
    setNextId(nextId + 1);
  };

  const removeSubject = (id: number) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  return (
    <div>
      <div className="space-y-4">
        {subjects.map((subject) => (
          <div key={subject.id} className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr_1fr_auto] sm:gap-x-4">
            <TextField
              label="Subject"
              value={subject.name}
              onChange={(e) => updateSubject(subject.id, { name: e.target.value })}
            />
            <NumberField
              label="Marks Obtained"
              value={subject.marks || ''}
              min={0}
              onChange={(e) => updateSubject(subject.id, { marks: parseFloat(e.target.value) || 0 })}
            />
            <NumberField
              label="Max Marks"
              value={subject.maxMarks || ''}
              min={1}
              onChange={(e) => updateSubject(subject.id, { maxMarks: parseFloat(e.target.value) || 1 })}
            />
            <div className="flex items-end">
              <Button
                variant="ghost"
                type="button"
                onClick={() => removeSubject(subject.id)}
                className="px-3"
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button variant="secondary" type="button" className="mt-4" onClick={addSubject}>
        + Add Subject
      </Button>

      <div className="mt-6">
        <ResultPanel>
          <ResultStat label="Total Marks" value={totalMarks} />
          <ResultStat label="Total Max Marks" value={totalMaxMarks} />
          <ResultStat label="Average %" value={`${averagePercentage.toFixed(2)}%`} emphasis />
          <ResultStat label="Simple Average" value={simpleAverage.toFixed(2)} />
        </ResultPanel>
      </div>
    </div>
  );
}
