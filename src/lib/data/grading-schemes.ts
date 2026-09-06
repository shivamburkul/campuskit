/**
 * Grading-scheme reference data.
 *
 * CampusKit does NOT claim these are any specific university's official,
 * binding formula. Grading systems vary by country, university, and even
 * by department/batch year, and they change over time. Each scheme below
 * is labeled with its source type and a verification notice. The GPA tool
 * always lets a student enter custom grade points directly instead of
 * relying on a preset, and always shows a "verify with your institution"
 * disclaimer.
 *
 * To add a real university-specific scheme:
 *  1. Find the university's official academic-regulations document (PDF/website).
 *  2. Add an entry below with `sourceUrl` pointing to that document and
 *     `verifiedDate` set to today.
 *  3. Never guess or interpolate values that aren't explicitly published.
 */

export interface GradeBand {
  label: string; // e.g. "A+", "O", "First Class"
  minPercentage?: number;
  maxPercentage?: number;
  gradePoint: number;
}

export interface GradingScheme {
  id: string;
  name: string;
  country: string;
  scaleMax: number;
  description: string;
  sourceType: 'generic-reference' | 'official-document';
  sourceUrl?: string;
  verifiedDate?: string;
  bands: GradeBand[];
}

export const GRADING_SCHEMES: GradingScheme[] = [
  {
    id: 'generic-10-point',
    name: 'Generic 10-point scale (common reference)',
    country: 'India (widely used pattern — verify locally)',
    scaleMax: 10,
    description:
      'A widely used 10-point grading pattern seen across many Indian universities (UGC-style). This is a REFERENCE ONLY — confirm your own university\'s exact grade-point boundaries before relying on this for official purposes.',
    sourceType: 'generic-reference',
    bands: [
      { label: 'O (Outstanding)', minPercentage: 90, maxPercentage: 100, gradePoint: 10 },
      { label: 'A+ (Excellent)', minPercentage: 80, maxPercentage: 89.99, gradePoint: 9 },
      { label: 'A (Very Good)', minPercentage: 70, maxPercentage: 79.99, gradePoint: 8 },
      { label: 'B+ (Good)', minPercentage: 60, maxPercentage: 69.99, gradePoint: 7 },
      { label: 'B (Above Average)', minPercentage: 55, maxPercentage: 59.99, gradePoint: 6 },
      { label: 'C (Average)', minPercentage: 50, maxPercentage: 54.99, gradePoint: 5 },
      { label: 'P (Pass)', minPercentage: 40, maxPercentage: 49.99, gradePoint: 4 },
      { label: 'F (Fail)', minPercentage: 0, maxPercentage: 39.99, gradePoint: 0 },
    ],
  },
  {
    id: 'us-4-point',
    name: 'Generic US 4.0 scale (common reference)',
    country: 'United States (widely used pattern — verify locally)',
    scaleMax: 4,
    description:
      'The common unweighted 4.0 GPA pattern used by many US institutions. Many schools use +/- variants (e.g. A- = 3.7) — check your registrar\'s published scale.',
    sourceType: 'generic-reference',
    bands: [
      { label: 'A', minPercentage: 93, maxPercentage: 100, gradePoint: 4.0 },
      { label: 'A-', minPercentage: 90, maxPercentage: 92.99, gradePoint: 3.7 },
      { label: 'B+', minPercentage: 87, maxPercentage: 89.99, gradePoint: 3.3 },
      { label: 'B', minPercentage: 83, maxPercentage: 86.99, gradePoint: 3.0 },
      { label: 'B-', minPercentage: 80, maxPercentage: 82.99, gradePoint: 2.7 },
      { label: 'C+', minPercentage: 77, maxPercentage: 79.99, gradePoint: 2.3 },
      { label: 'C', minPercentage: 73, maxPercentage: 76.99, gradePoint: 2.0 },
      { label: 'D', minPercentage: 60, maxPercentage: 69.99, gradePoint: 1.0 },
      { label: 'F', minPercentage: 0, maxPercentage: 59.99, gradePoint: 0 },
    ],
  },
];

export function getSchemeById(id: string): GradingScheme | undefined {
  return GRADING_SCHEMES.find((s) => s.id === id);
}
