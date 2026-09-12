'use client';
import { useState } from 'react';
import { NumberField } from '@/components/ui/Field';
import { ResultPanel, ResultStat } from '@/components/ui/Result';

export function ExamScoreCalculator() {
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [negativeMarks, setNegativeMarks] = useState(0);

  const score = total > 0 ? Math.round((correct / total) * 100) : 0;
  const negativeTotal = negativeMarks > 0 ? correct * negativeMarks : 0;
  const finalScore = Math.max(0, score - negativeTotal);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <NumberField label="Correct answers" value={correct || ''} min={0} onChange={(e) => setCorrect(parseInt(e.target.value) || 0)} />
        <NumberField label="Total questions" value={total || ''} min={0} onChange={(e) => setTotal(parseInt(e.target.value) || 0)} />
        <NumberField label="Negative marks per wrong" value={negativeMarks || ''} min={0} step={0.01} onChange={(e) => setNegativeMarks(parseFloat(e.target.value) || 0)} />
      </div>
      <div className="mt-6">
        <ResultPanel>
          <ResultStat label="Raw score" value={`${score}%`} />
          <ResultStat label="Final score after negative marking" value={`${finalScore}%`} emphasis />
        </ResultPanel>
      </div>
    </div>
  );
}
