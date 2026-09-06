'use client';
import { useState } from 'react';
import { NumberField, TextField } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { subjectWiseSummary, SubjectAttendance } from '@/lib/tools/attendance';

const STATUS_STYLE: Record<string, string> = {
  safe: 'bg-moss-100 text-moss-600',
  warning: 'bg-amber-100 text-amber-600',
  shortage: 'bg-red-100 text-red-600',
};

export function SubjectWiseAttendance() {
  const [target, setTarget] = useState(75);
  const [rows, setRows] = useState<SubjectAttendance[]>([
    { subject: 'Subject 1', attended: 0, total: 0 },
    { subject: 'Subject 2', attended: 0, total: 0 },
  ]);

  const summary = subjectWiseSummary(rows, target);

  function updateRow(index: number, patch: Partial<SubjectAttendance>) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  return (
    <div>
      <NumberField label="Target attendance %" value={target || ''} suffix="%" onChange={(e) => setTarget(parseFloat(e.target.value) || 0)} />
      <div className="mt-6 space-y-4">
        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr_1fr_auto] sm:gap-x-4 items-start">
            <TextField label={i === 0 ? 'Subject' : ''} value={row.subject} onChange={(e) => updateRow(i, { subject: e.target.value })} id={`subj-${i}`} />
            <NumberField label={i === 0 ? 'Attended' : ''} value={row.attended || ''} onChange={(e) => updateRow(i, { attended: parseFloat(e.target.value) || 0 })} id={`att-${i}`} />
            <NumberField label={i === 0 ? 'Total' : ''} value={row.total || ''} onChange={(e) => updateRow(i, { total: parseFloat(e.target.value) || 0 })} id={`tot-${i}`} />
            <div className={i === 0 ? 'flex items-end pt-1 pl-4' : 'flex items-center pt-1 pl-4'}>
              <Button variant="ghost" type="button" onClick={() => setRows((prev) => prev.filter((_, idx) => idx !== i))} disabled={rows.length <= 1} className="px-3">
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button variant="secondary" type="button" className="mt-6" onClick={() => setRows((prev) => [...prev, { subject: `Subject ${prev.length + 1}`, attended: 0, total: 0 }])}>
        + Add subject
      </Button>

      <div className="mt-6 overflow-hidden rounded-lg border border-ink-100">
        <table className="w-full text-sm">
          <thead className="bg-ink-100/50 text-left text-ink-700">
            <tr>
              <th className="px-4 py-2 font-medium">Subject</th>
              <th className="px-4 py-2 font-medium">Attendance</th>
              <th className="px-4 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((s, i) => (
              <tr key={i} className="border-t border-ink-100">
                <td className="px-4 py-2 text-ink-900">{s.subject}</td>
                <td className="px-4 py-2 numeric-input">{s.percentage}%</td>
                <td className="px-4 py-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[s.status]}`}>{s.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}