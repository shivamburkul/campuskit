'use client';
import { useState } from 'react';
import { NumberField } from '@/components/ui/Field';
import { ResultPanel, ResultStat, InlineNote } from '@/components/ui/Result';

export function UpscPrelimsCalculator() {
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [unattempted, setUnattempted] = useState(0);
  const [marksPerQuestion, setMarksPerQuestion] = useState(2);
  const [negativeFraction, setNegativeFraction] = useState(1 / 3);

  const totalQuestions = correct + incorrect + unattempted;
  const grossMarks = correct * marksPerQuestion;
  const penalty = incorrect * marksPerQuestion * negativeFraction;
  const netMarks = grossMarks - penalty;
  const maxPossible = totalQuestions * marksPerQuestion;
  const netPercentage = maxPossible > 0 ? (netMarks / maxPossible) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <NumberField
          label="Correct answers"
          value={correct || ''}
          min={0}
          onChange={(e) => setCorrect(Math.max(0, parseInt(e.target.value) || 0))}
        />
        <NumberField
          label="Incorrect answers"
          value={incorrect || ''}
          min={0}
          onChange={(e) => setIncorrect(Math.max(0, parseInt(e.target.value) || 0))}
        />
        <NumberField
          label="Unattempted"
          value={unattempted || ''}
          min={0}
          onChange={(e) => setUnattempted(Math.max(0, parseInt(e.target.value) || 0))}
        />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <NumberField
          label="Marks per question"
          value={marksPerQuestion}
          min={0.1}
          step={0.1}
          onChange={(e) => setMarksPerQuestion(parseFloat(e.target.value) || 0)}
        />
        <NumberField
          label="Negative marking (fraction, e.g. 0.33 for 1/3)"
          value={Number(negativeFraction.toFixed(2))}
          min={0}
          max={1}
          step={0.01}
          onChange={(e) => setNegativeFraction(Math.min(1, Math.max(0, parseFloat(e.target.value) || 0)))}
        />
      </div>

      <div className="mt-6">
        <ResultPanel>
          <ResultStat label="Total questions attempted-set" value={totalQuestions} />
          <ResultStat label="Marks from correct answers" value={grossMarks.toFixed(2)} />
          <ResultStat label="Penalty from incorrect answers" value={`-${penalty.toFixed(2)}`} />
          <ResultStat label="Net marks" value={netMarks.toFixed(2)} emphasis />
          <ResultStat label="Net score (%)" value={`${netPercentage.toFixed(2)}%`} />
        </ResultPanel>
      </div>

      <InlineNote>
        Default settings match the standard UPSC Prelims pattern: 2 marks per question with a 1/3rd
        negative marking penalty for each wrong answer. Adjust the fields above if your paper uses a
        different scheme. This tool only calculates the score you enter — it does not predict a rank,
        cutoff, or result.
      </InlineNote>
    </div>
  );
}
