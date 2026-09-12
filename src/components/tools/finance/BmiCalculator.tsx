'use client';
import { useState } from 'react';
import { NumberField } from '@/components/ui/Field';
import { ResultPanel, ResultStat } from '@/components/ui/Result';

export function BmiCalculator() {
  const [heightCm, setHeightCm] = useState(170);
  const [weightKg, setWeightKg] = useState(65);

  const heightM = heightCm / 100;
  const bmi = heightM > 0 ? weightKg / (heightM * heightM) : 0;
  const roundedBmi = Math.round(bmi * 10) / 10;

  function getCategory(bmiValue: number): { label: string; color: string } {
    if (bmiValue < 18.5) return { label: 'Underweight', color: 'text-blue-600 dark:text-blue-400' };
    if (bmiValue < 25) return { label: 'Normal Weight', color: 'text-green-600 dark:text-green-400' };
    if (bmiValue < 30) return { label: 'Overweight', color: 'text-amber-600 dark:text-amber-400' };
    return { label: 'Obese', color: 'text-red-600 dark:text-red-400' };
  }

  const category = getCategory(roundedBmi);

  // Healthy weight range for height
  const minHealthy = 18.5 * heightM * heightM;
  const maxHealthy = 24.9 * heightM * heightM;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <NumberField
          label="Height (cm)"
          value={heightCm || ''}
          min={50}
          max={250}
          onChange={(e) => setHeightCm(parseFloat(e.target.value) || 0)}
        />
        <NumberField
          label="Weight (kg)"
          value={weightKg || ''}
          min={20}
          max={300}
          onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
        />
      </div>

      <ResultPanel>
        <ResultStat label="Your BMI" value={roundedBmi} emphasis />
        <p className={`mt-2 text-lg font-semibold ${category.color}`}>{category.label}</p>
        <div className="mt-4 border-t border-ink-200/60 pt-4">
          <p className="text-sm font-medium text-ink-700 dark:text-ink-300">Healthy Weight Range for Your Height:</p>
          <p className="text-lg font-semibold text-ink-950 dark:text-ink-50">
            {minHealthy.toFixed(1)} kg – {maxHealthy.toFixed(1)} kg
          </p>
        </div>
      </ResultPanel>

      <div className="mt-4">
        <p className="text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">BMI Categories:</p>
        <div className="space-y-1 text-sm text-ink-600 dark:text-ink-400">
          <p><span className="font-medium text-blue-600 dark:text-blue-400">Underweight:</span> Below 18.5</p>
          <p><span className="font-medium text-green-600 dark:text-green-400">Normal:</span> 18.5 – 24.9</p>
          <p><span className="font-medium text-amber-600 dark:text-amber-400">Overweight:</span> 25 – 29.9</p>
          <p><span className="font-medium text-red-600 dark:text-red-400">Obese:</span> 30 and above</p>
        </div>
      </div>
    </div>
  );
}
