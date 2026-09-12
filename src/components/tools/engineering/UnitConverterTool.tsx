'use client';
import { useState, useMemo } from 'react';
import { NumberField, SelectField } from '@/components/ui/Field';
import { ResultStat } from '@/components/ui/Result';
import { UNIT_CATEGORIES, convertUnit, convertTemperature } from '@/lib/tools/units';

const CATEGORY_OPTIONS = [...Object.keys(UNIT_CATEGORIES), 'temperature'];
const TEMP_UNITS = ['celsius', 'fahrenheit', 'kelvin'];

export function UnitConverterTool() {
  const [category, setCategory] = useState('length');
  const isTemp = category === 'temperature';
  const unitOptions = isTemp ? TEMP_UNITS : Object.keys(UNIT_CATEGORIES[category]?.units ?? {});
  const [from, setFrom] = useState(unitOptions[0] ?? 'meter');
  const [to, setTo] = useState(unitOptions[1] ?? unitOptions[0] ?? 'meter');
  const [value, setValue] = useState(1);

  function handleCategoryChange(next: string) {
    setCategory(next);
    const nextUnits = next === 'temperature' ? TEMP_UNITS : Object.keys(UNIT_CATEGORIES[next]?.units ?? {});
    setFrom(nextUnits[0] ?? 'meter');
    setTo(nextUnits[1] ?? nextUnits[0] ?? 'meter');
  }

  const result = useMemo(() => {
    if (isTemp) return convertTemperature(value, from as 'celsius', to as 'celsius');
    return convertUnit(category, value, from, to);
  }, [category, from, to, value, isTemp]);

  return (
    <div className="space-y-5">
      <SelectField label="Category" value={category} onChange={handleCategoryChange} options={CATEGORY_OPTIONS.map((c) => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <NumberField label="Value" value={value} onChange={(e) => setValue(parseFloat(e.target.value) || 0)} />
        <SelectField label="From" value={from} onChange={setFrom} options={unitOptions.map((u) => ({ value: u, label: u }))} />
        <SelectField label="To" value={to} onChange={setTo} options={unitOptions.map((u) => ({ value: u, label: u }))} />
      </div>
      <ResultStat label="Result" value={result === null ? '—' : Math.round((result + Number.EPSILON) * 1e6) / 1e6} emphasis />
    </div>
  );
}
