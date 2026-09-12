import { roundTo } from './gpa';

export function attendancePercentage(attended: number, total: number): number {
  if (total <= 0) return 0;
  return roundTo((attended / total) * 100, 2);
}

/**
 * How many *additional consecutive classes* (assumed all attended) are
 * needed to reach a target percentage.
 * Formula: (attended + x) / (total + x) >= target/100
 *          x >= (target*total - 100*attended) / (100 - target)
 */
export function classesNeededForTarget(params: {
  attended: number;
  total: number;
  targetPercentage: number;
}): { classesNeeded: number; alreadyMet: boolean; impossible: boolean } {
  const { attended, total, targetPercentage } = params;

  if (targetPercentage >= 100) {
    return { classesNeeded: 0, alreadyMet: false, impossible: attended < total };
  }
  const currentPct = attendancePercentage(attended, total);
  if (currentPct >= targetPercentage) {
    return { classesNeeded: 0, alreadyMet: true, impossible: false };
  }

  const numerator = targetPercentage * total - 100 * attended;
  const denominator = 100 - targetPercentage;
  const raw = numerator / denominator;
  const classesNeeded = Math.ceil(Math.max(raw, 0));

  return { classesNeeded, alreadyMet: false, impossible: false };
}

/**
 * How many *upcoming* classes (out of a known number of remaining classes)
 * can be missed while an end-of-term attendance stays >= target.
 * Assumes the student attends every remaining class except the missed ones.
 */
export function classesCanMiss(params: {
  attended: number;
  total: number;
  remainingClasses: number;
  targetPercentage: number;
}): { canMiss: number; wouldEndAt: number; noRemaining: boolean } {
  const { attended, total, remainingClasses, targetPercentage } = params;

  if (remainingClasses === 0) {
    return { canMiss: 0, wouldEndAt: attendancePercentage(attended, total), noRemaining: true };
  }

  const finalTotal = total + remainingClasses;
  const maxMissed = attended + remainingClasses - (targetPercentage / 100) * finalTotal;
  const canMiss = Math.max(0, Math.floor(maxMissed));
  const wouldEndAt = attendancePercentage(attended + remainingClasses - canMiss, finalTotal);

  return { canMiss, wouldEndAt, noRemaining: false };
}

export interface SubjectAttendance {
  subject: string;
  attended: number;
  total: number;
}

export function subjectWiseSummary(subjects: SubjectAttendance[], targetPercentage: number) {
  return subjects.map((s) => {
    const pct = attendancePercentage(s.attended, s.total);
    const status: 'safe' | 'warning' | 'shortage' =
      pct >= targetPercentage ? 'safe' : pct >= targetPercentage - 10 ? 'warning' : 'shortage';
    return { ...s, percentage: pct, status };
  });
}
