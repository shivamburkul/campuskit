'use client';
import { useState } from 'react';
import { NumberField, SelectField } from '@/components/ui/Field';
import { ResultPanel, ResultStat } from '@/components/ui/Result';

export function WaterIntakeCalculator() {
  const [weight, setWeight] = useState(65);
  const [activity, setActivity] = useState<'low' | 'moderate' | 'high'>('moderate');
  const [climate, setClimate] = useState<'temperate' | 'hot'>('temperate');

  // Base: 35ml per kg
  const baseWater = weight * 35;

  // Activity multiplier
  const activityMultiplier = activity === 'low' ? 1 : activity === 'moderate' ? 1.2 : 1.5;
  const activityWater = baseWater * activityMultiplier;

  // Climate adjustment
  const climateMultiplier = climate === 'hot' ? 1.2 : 1;
  const totalWater = activityWater * climateMultiplier;

  const totalLiters = totalWater / 1000;
  const glasses = Math.ceil(totalWater / 250); // 250ml per glass

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <NumberField
          label="Weight (kg)"
          value={weight || ''}
          min={30}
          max={200}
          onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
        />
        <SelectField
          label="Activity Level"
          value={activity}
          onChange={(v) => setActivity(v as 'low' | 'moderate' | 'high')}
          options={[
            { value: 'low', label: 'Low (sedentary)' },
            { value: 'moderate', label: 'Moderate (exercise 3-4×/wk)' },
            { value: 'high', label: 'High (daily exercise)' },
          ]}
        />
        <SelectField
          label="Climate"
          value={climate}
          onChange={(v) => setClimate(v as 'temperate' | 'hot')}
          options={[
            { value: 'temperate', label: 'Temperate' },
            { value: 'hot', label: 'Hot/Humid' },
          ]}
        />
      </div>

      <ResultPanel>
        <ResultStat label="Daily Water Intake" value={`${totalLiters.toFixed(2)} liters`} emphasis />
        <ResultStat label="Total per Day" value={`${Math.round(totalWater)} ml`} />
        <ResultStat label="Glasses (250ml)" value={glasses} />
      </ResultPanel>

      <p className="text-xs text-ink-500 dark:text-ink-400">
        This is a general rule-of-thumb estimate, not medical advice — individual needs vary with health
        conditions, medications, and other factors. Check with a doctor for personalized guidance,
        especially before significantly increasing your water intake.
      </p>
    </div>
  );
}
