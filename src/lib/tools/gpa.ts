// Generic, formula-agnostic GPA / CGPA engine.
// IMPORTANT: CampusKit never invents a university's official formula.
// This module implements the two formula *shapes* that essentially every
// published grading scheme reduces to. The scheme-specific numbers
// (grade points, credit weights) live in src/lib/data/universities.ts and
// must be sourced from an official document before being added.

export interface CourseEntry {
  /** Course/subject label, for display only */
  label: string;
  /** Credits or weight assigned to this course */
  credits: number;
  /** Grade point earned (e.g. 10, 9, 8 on a 10-point scale, or a percentage) */
  gradePoint: number;
}

export interface WeightedGpaResult {
  totalCredits: number;
  totalGradePoints: number;
  gpa: number;
}

/** Credit-weighted GPA: sum(credits * gradePoint) / sum(credits) */
export function calculateWeightedGpa(courses: CourseEntry[]): WeightedGpaResult {
  const validCourses = courses.filter((c) => c.credits > 0);
  const totalCredits = validCourses.reduce((sum, c) => sum + c.credits, 0);
  const totalGradePoints = validCourses.reduce((sum, c) => sum + c.credits * c.gradePoint, 0);

  if (totalCredits === 0) {
    return { totalCredits: 0, totalGradePoints: 0, gpa: 0 };
  }

  const gpa = totalGradePoints / totalCredits;
  return {
    totalCredits,
    totalGradePoints,
    gpa: roundTo(gpa, 3),
  };
}

export interface SemesterEntry {
  label: string;
  sgpa: number;
  credits: number;
}

/** CGPA from semester-wise SGPA values, credit-weighted across semesters. */
export function calculateCgpaFromSemesters(semesters: SemesterEntry[]): WeightedGpaResult {
  const courses: CourseEntry[] = semesters
    .filter((s) => s.credits > 0)
    .map((s) => ({ label: s.label, credits: s.credits, gradePoint: s.sgpa }));
  return calculateWeightedGpa(courses);
}

/**
 * Simple (unweighted) average GPA — used by schemes that do not weight by credits.
 */
export function calculateSimpleGpa(gradePoints: number[]): number {
  const valid = gradePoints.filter((g) => Number.isFinite(g));
  if (valid.length === 0) return 0;
  return roundTo(valid.reduce((a, b) => a + b, 0) / valid.length, 3);
}

/**
 * Required future GPA to reach a target overall GPA, given credits already
 * completed and credits remaining.
 * Returns null if the target is mathematically unreachable (i.e. would need
 * a grade point above the maxScale) or already achieved.
 */
export function calculateRequiredGpa(params: {
  currentGpa: number;
  currentCredits: number;
  targetGpa: number;
  remainingCredits: number;
  maxScale: number;
}): { requiredGpa: number; achievable: boolean; alreadyMet: boolean } {
  const { currentGpa, currentCredits, targetGpa, remainingCredits, maxScale } = params;

  if (remainingCredits <= 0) {
    return { requiredGpa: 0, achievable: false, alreadyMet: currentGpa >= targetGpa };
  }

  const currentPoints = currentGpa * currentCredits;
  const totalCreditsAtEnd = currentCredits + remainingCredits;
  const requiredTotalPoints = targetGpa * totalCreditsAtEnd;
  const requiredPoints = requiredTotalPoints - currentPoints;
  const requiredGpa = requiredPoints / remainingCredits;

  return {
    requiredGpa: roundTo(requiredGpa, 3),
    achievable: requiredGpa <= maxScale,
    alreadyMet: currentGpa >= targetGpa,
  };
}

export function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}
