'use client';
import { useState } from 'react';
import { NumberField, SelectField } from '@/components/ui/Field';
import { ResultPanel, ResultStat, InlineNote } from '@/components/ui/Result';

export function CgpaToPercentageConverter() {
  const [cgpa, setCgpa] = useState(8.5);
  const [scale, setScale] = useState('10');

  // Standard formulas:
  // 10-point scale: Percentage = (CGPA - 0.75) × 10
  // 4-point scale: Percentage = (CGPA / 4) × 100
  // Other (custom): Percentage = (CGPA / Scale) × 100

  const scaleNum = parseFloat(scale);
  let percentage = 0;
  let formula = '';

  if (scale === '10') {
    // Common Indian university formula
    percentage = (cgpa - 0.75) * 10;
    formula = 'Percentage = (CGPA - 0.75) × 10';
  } else if (scale === '4') {
    // US 4.0 scale
    percentage = (cgpa / 4) * 100;
    formula = 'Percentage = (CGPA / 4) × 100';
  } else {
    // Custom scale
    percentage = (cgpa / scaleNum) * 100;
    formula = `Percentage = (CGPA / ${scaleNum}) × 100`;
  }

  // Clamp percentage to 0-100
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <NumberField
          label="CGPA"
          value={cgpa || ''}
          step={0.01}
          min={0}
          onChange={(e) => setCgpa(parseFloat(e.target.value) || 0)}
        />
        <SelectField
          label="Grading Scale"
          value={scale}
          onChange={setScale}
          options={[
            { value: '10', label: '10-point scale (India)' },
            { value: '4', label: '4.0 scale (US)' },
            { value: '7', label: '7-point scale' },
            { value: '5', label: '5-point scale' },
          ]}
        />
      </div>

      <ResultPanel>
        <ResultStat label="Equivalent Percentage" value={`${clampedPercentage.toFixed(2)}%`} emphasis />
        <p className="mt-2 text-xs text-ink-500">Formula used: {formula}</p>
      </ResultPanel>

      <InlineNote>
        This conversion is an estimate. Different universities use different formulas. Always check your university&apos;s
        official conversion policy before submitting your percentage anywhere.
      </InlineNote>
    </div>
  );
}
