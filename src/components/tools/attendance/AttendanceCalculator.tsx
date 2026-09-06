'use client';
import { useState } from 'react';
import { NumberField } from '@/components/ui/Field';
import { ResultPanel, ResultStat } from '@/components/ui/Result';
import { attendancePercentage } from '@/lib/tools/attendance';

export function AttendanceCalculator() {
  const [attended, setAttended] = useState(0);
  const [total, setTotal] = useState(0);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <NumberField label="Classes attended" value={attended || ''} min={0} onChange={(e) => setAttended(parseFloat(e.target.value) || 0)} />
        <NumberField label="Total classes held" value={total || ''} min={0} onChange={(e) => setTotal(parseFloat(e.target.value) || 0)} />
      </div>
      <div className="mt-6">
        <ResultPanel>
          <ResultStat label="Attendance" value={`${attendancePercentage(attended, total)}%`} emphasis />
        </ResultPanel>
      </div>
    </div>
  );
}