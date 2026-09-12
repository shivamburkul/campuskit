'use client';
import { useState } from 'react';
import { TextField } from '@/components/ui/Field';
import { ResultPanel, ResultStat, InlineNote } from '@/components/ui/Result';

// Atomic masses (approximate, g/mol) — IUPAC standard atomic weights, rounded.
const ELEMENTS: Record<string, number> = {
  H: 1.008, He: 4.0026, Li: 6.94, Be: 9.0122, B: 10.81, C: 12.011,
  N: 14.007, O: 15.999, F: 18.998, Ne: 20.180, Na: 22.990, Mg: 24.305,
  Al: 26.982, Si: 28.085, P: 30.974, S: 32.06, Cl: 35.45, K: 39.098,
  Ar: 39.948, Ca: 40.078, Sc: 44.956, Ti: 47.867, V: 50.942, Cr: 51.996,
  Mn: 54.938, Fe: 55.845, Co: 58.933, Ni: 58.693, Cu: 63.546, Zn: 65.38,
  Ga: 69.723, Ge: 72.630, As: 74.922, Se: 78.971, Br: 79.904, Kr: 83.798,
  Rb: 85.468, Sr: 87.62, Y: 88.906, Zr: 91.224, Ag: 107.87, Cd: 112.41,
  Sn: 118.71, Sb: 121.76, I: 126.90, Te: 127.60, Xe: 131.29, Ba: 137.33,
  Au: 196.97, Hg: 200.59, Pb: 207.2, Bi: 208.98, Pt: 195.08, W: 183.84,
};

function parseFormula(formula: string): { element: string; count: number }[] {
  const clean = formula.trim();
  if (!clean) throw new Error('Enter a chemical formula.');

  // Recursive-descent parser supporting nested parentheses, e.g. Ca(OH)2, Mg3(PO4)2.
  let i = 0;
  function parseGroup(): Record<string, number> {
    const counts: Record<string, number> = {};
    while (i < clean.length && clean[i] !== ')') {
      if (clean[i] === '(') {
        i += 1; // skip '('
        const inner = parseGroup();
        if (clean[i] !== ')') throw new Error('Mismatched parentheses in formula.');
        i += 1; // skip ')'
        let numStr = '';
        while (i < clean.length && /\d/.test(clean[i]!)) {
          numStr += clean[i];
          i += 1;
        }
        const multiplier = numStr ? parseInt(numStr, 10) : 1;
        for (const [el, cnt] of Object.entries(inner)) {
          counts[el] = (counts[el] ?? 0) + cnt * multiplier;
        }
      } else if (/[A-Z]/.test(clean[i]!)) {
        let element = clean[i]!;
        i += 1;
        if (i < clean.length && /[a-z]/.test(clean[i]!)) {
          element += clean[i];
          i += 1;
        }
        if (!ELEMENTS[element]) {
          throw new Error(`Unknown element: ${element}`);
        }
        let numStr = '';
        while (i < clean.length && /\d/.test(clean[i]!)) {
          numStr += clean[i];
          i += 1;
        }
        const count = numStr ? parseInt(numStr, 10) : 1;
        counts[element] = (counts[element] ?? 0) + count;
      } else {
        throw new Error(`Unexpected character: "${clean[i]}"`);
      }
    }
    return counts;
  }

  const result = parseGroup();
  if (i < clean.length) throw new Error('Mismatched parentheses in formula.');

  const entries = Object.entries(result).map(([element, count]) => ({ element, count }));
  if (entries.length === 0) throw new Error('Invalid formula.');
  return entries;
}

export function MolarMassCalculator() {
  const [formula, setFormula] = useState('H2O');
  const [error, setError] = useState<string | null>(null);
  const [breakdown, setBreakdown] = useState<{ element: string; count: number; mass: number }[]>([]);
  const [totalMass, setTotalMass] = useState(0);

  function handleCalculate() {
    try {
      const parsed = parseFormula(formula);
      const nextBreakdown = parsed.map(({ element, count }) => ({
        element,
        count,
        mass: ELEMENTS[element]! * count,
      }));
      const total = nextBreakdown.reduce((sum, item) => sum + item.mass, 0);

      setBreakdown(nextBreakdown);
      setTotalMass(total);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid formula');
      setBreakdown([]);
      setTotalMass(0);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-3 items-end">
        <TextField
          label="Chemical Formula"
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
          hint="e.g., H2O, NaCl, C6H12O6, Ca(OH)2"
        />
        <button
          onClick={handleCalculate}
          className="px-5 py-3 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-500 transition-colors"
        >
          Calculate
        </button>
      </div>

      {error && <InlineNote tone="warning">{error}</InlineNote>}

      {breakdown.length > 0 && (
        <ResultPanel>
          <div className="space-y-2">
            {breakdown.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>
                  {item.element} × {item.count} = {item.mass.toFixed(3)} g/mol
                </span>
              </div>
            ))}
            <div className="border-t border-ink-200 pt-2 mt-2">
              <ResultStat label="Molar Mass" value={`${totalMass.toFixed(3)} g/mol`} emphasis />
            </div>
          </div>
        </ResultPanel>
      )}

      <InlineNote>
        Approximate atomic masses used. Actual values may vary slightly. Always verify with your textbook or periodic table.
      </InlineNote>
    </div>
  );
}
