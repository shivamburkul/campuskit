'use client';
import { useState } from 'react';
import { NumberField, TextField } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { ResultPanel, ResultStat, InlineNote } from '@/components/ui/Result';

interface Reactant {
  formula: string;
  mass: number;
  molarMass: number;
  coefficient: number;
}

function makeReactant(formula: string, mass: number, molarMass: number, coefficient: number): Reactant {
  return { formula, mass, molarMass, coefficient };
}

export function LimitingReagentCalculator() {
  const [reactants, setReactants] = useState<Reactant[]>([
    makeReactant('H2', 4, 2.016, 2),
    makeReactant('O2', 10, 32.0, 1),
  ]);

  function updateReactant(index: number, patch: Partial<Reactant>) {
    setReactants(reactants.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  function addReactant() {
    setReactants([...reactants, makeReactant('', 0, 0, 1)]);
  }

  function removeReactant(index: number) {
    setReactants(reactants.filter((_, i) => i !== index));
  }

  // General limiting-reagent logic: for each reactant, moles / stoichiometric coefficient
  // gives the number of "reaction units" it can support. The smallest value is the limiting reagent,
  // regardless of which specific compounds are involved — this works for any balanced equation
  // as long as the user supplies the correct coefficients from that equation.
  const valid = reactants.every((r) => r.formula.trim() && r.molarMass > 0 && r.coefficient > 0 && r.mass > 0);

  let result: {
    rows: { formula: string; moles: number; reactionUnits: number; isLimiting: boolean }[];
    limiting: string;
  } | null = null;

  if (valid && reactants.length >= 2) {
    const rows = reactants.map((r) => {
      const moles = r.mass / r.molarMass;
      const reactionUnits = moles / r.coefficient;
      return { formula: r.formula, moles, reactionUnits, isLimiting: false };
    });
    const minUnits = Math.min(...rows.map((r) => r.reactionUnits));
    rows.forEach((r) => {
      r.isLimiting = Math.abs(r.reactionUnits - minUnits) < 1e-9;
    });
    const limitingRow = rows.find((r) => r.isLimiting);
    result = { rows, limiting: limitingRow ? limitingRow.formula : '' };
  }

  return (
    <div className="space-y-6">
      <InlineNote>
        Enter the mass, molar mass, and the stoichiometric coefficient (from your balanced equation) for
        each reactant. For example, in 2H₂ + O₂ → 2H₂O, H₂ has coefficient 2 and O₂ has coefficient 1.
      </InlineNote>

      <h3 className="font-medium text-ink-900 dark:text-ink-50">Reactants</h3>
      {reactants.map((r, i) => (
        <div key={i} className="grid grid-cols-1 gap-3 rounded-xl border border-ink-100 p-3 dark:border-ink-700 sm:grid-cols-[1.2fr_1fr_1fr_0.8fr_auto] sm:items-end">
          <TextField
            label="Formula"
            value={r.formula}
            onChange={(e) => updateReactant(i, { formula: e.target.value })}
            placeholder="e.g. H2"
          />
          <NumberField
            label="Mass (g)"
            value={r.mass || ''}
            min={0}
            step={0.01}
            onChange={(e) => updateReactant(i, { mass: parseFloat(e.target.value) || 0 })}
          />
          <NumberField
            label="Molar mass (g/mol)"
            value={r.molarMass || ''}
            min={0}
            step={0.001}
            onChange={(e) => updateReactant(i, { molarMass: parseFloat(e.target.value) || 0 })}
          />
          <NumberField
            label="Coefficient"
            value={r.coefficient || ''}
            min={1}
            step={1}
            onChange={(e) => updateReactant(i, { coefficient: parseInt(e.target.value, 10) || 1 })}
          />
          <Button
            variant="ghost"
            type="button"
            onClick={() => removeReactant(i)}
            disabled={reactants.length <= 2}
          >
            Remove
          </Button>
        </div>
      ))}

      <Button variant="secondary" type="button" onClick={addReactant}>
        + Add Reactant
      </Button>

      {!valid && (
        <InlineNote tone="warning">
          Fill in a formula, a positive mass, molar mass, and coefficient for every reactant to see the
          result.
        </InlineNote>
      )}

      {result && (
        <ResultPanel>
          {result.rows.map((row) => (
            <ResultStat
              key={row.formula}
              label={`${row.formula} — moles used`}
              value={`${row.moles.toFixed(4)} mol (${row.reactionUnits.toFixed(4)} rxn units)`}
              emphasis={row.isLimiting}
            />
          ))}
          <ResultStat label="Limiting reagent" value={result.limiting} emphasis />
        </ResultPanel>
      )}

      <InlineNote>
        This tool calculates purely from the numbers you enter — it does not look up or balance chemical
        equations for you. Double-check your molar masses and coefficients against your own balanced
        equation.
      </InlineNote>
    </div>
  );
}
