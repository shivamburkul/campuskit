'use client';
import { useState } from 'react';
import { TextField, NumberField } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { ResultPanel, ResultStat } from '@/components/ui/Result';

interface Subject {
  id: number;
  name: string;
  hours: number;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

export function StudyPlanner() {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 1, name: 'Mathematics', hours: 2, priority: 'high', completed: false },
    { id: 2, name: 'Physics', hours: 1.5, priority: 'high', completed: false },
  ]);
  const [newSubject, setNewSubject] = useState('');
  const [newHours, setNewHours] = useState(1);
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [nextId, setNextId] = useState(3);

  const totalHours = subjects.reduce((sum, s) => sum + s.hours, 0);
  const completedHours = subjects.filter(s => s.completed).reduce((sum, s) => sum + s.hours, 0);

  const addSubject = () => {
    if (!newSubject.trim()) return;
    setSubjects([...subjects, { id: nextId, name: newSubject, hours: newHours, priority: newPriority, completed: false }]);
    setNextId(nextId + 1);
    setNewSubject('');
    setNewHours(1);
  };

  const toggleComplete = (id: number) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
  };

  const removeSubject = (id: number) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  const priorityColors = {
    high: 'text-red-600 dark:text-red-400',
    medium: 'text-amber-600 dark:text-amber-400',
    low: 'text-moss-600 dark:text-moss-400',
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr_1fr_auto] sm:gap-x-4">
        <TextField label="Subject" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} placeholder="Enter subject name" />
        <NumberField label="Hours" value={newHours} min={0.5} step={0.5} onChange={(e) => setNewHours(parseFloat(e.target.value) || 0)} />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-ink-700 dark:text-ink-300">Priority</label>
          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value as 'high' | 'medium' | 'low')}
            className="w-full rounded-xl border border-ink-200/70 bg-surface px-4 py-3 text-ink-900 shadow-sm outline-none transition-all duration-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className={`flex items-center ${subjects.length > 0 ? 'mt-[1.625rem]' : ''}`}>
          <Button type="button" onClick={addSubject}>Add</Button>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        {subjects.map((subject) => (
          <div key={subject.id} className="flex items-center gap-3 rounded-xl border border-white/30 bg-white/30 p-3 shadow-sm backdrop-blur-[24px] saturate-180 dark:border-white/10 dark:bg-ink-900/70">
            <input
              type="checkbox"
              checked={subject.completed}
              onChange={() => toggleComplete(subject.id)}
              className="h-5 w-5 rounded border-ink-300 text-primary-600 focus:ring-primary-500"
            />
            <span className={`flex-1 ${subject.completed ? 'line-through text-ink-500' : 'text-ink-950 dark:text-ink-50'}`}>
              {subject.name}
            </span>
            <span className="text-sm text-ink-600 dark:text-ink-400">{subject.hours}h</span>
            <span className={`text-sm font-medium ${priorityColors[subject.priority]}`}>{subject.priority}</span>
            <Button variant="ghost" type="button" onClick={() => removeSubject(subject.id)} className="px-2">×</Button>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <ResultPanel>
          <ResultStat label="Total study hours" value={totalHours} />
          <ResultStat label="Completed hours" value={completedHours} />
          <ResultStat label="Progress" value={totalHours > 0 ? `${Math.round((completedHours / totalHours) * 100)}%` : '0%'} emphasis />
        </ResultPanel>
      </div>
    </div>
  );
}
