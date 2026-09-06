import { roundTo } from './gpa';

export function dateDifference(from: string, to: string) {
  const start = new Date(from);
  const end = new Date(to);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return { error: 'Enter two valid dates' as const };
  }
  const [earlier, later] = start <= end ? [start, end] : [end, start];

  let years = later.getFullYear() - earlier.getFullYear();
  let months = later.getMonth() - earlier.getMonth();
  let days = later.getDate() - earlier.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(later.getFullYear(), later.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalDays = Math.round((later.getTime() - earlier.getTime()) / 86_400_000);

  return {
    error: null,
    years,
    months,
    days,
    totalDays,
    // Derived by exact multiplication of the whole-day count above — these
    // don't imply any precision beyond the calendar-date inputs (there's no
    // time-of-day component here, so "total seconds" means "totalDays *
    // 86400", not a claim about the exact instant).
    totalWeeks: roundTo(totalDays / 7, 2),
    totalHours: totalDays * 24,
    totalMinutes: totalDays * 24 * 60,
    totalSeconds: totalDays * 24 * 60 * 60,
  };
}

export function calculateAge(birthDate: string, onDate: string = new Date().toISOString()) {
  const result = dateDifference(birthDate, onDate);
  return result;
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function addSubtractDays(dateStr: string, days: number): string | null {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function businessDaysBetween(from: string, to: string, holidays: string[] = []): number | null {
  const start = new Date(from);
  const end = new Date(to);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;

  const holidaySet = new Set(holidays);
  const [earlier, later] = start <= end ? [start, end] : [end, start];
  let count = 0;
  const cursor = new Date(earlier);

  while (cursor <= later) {
    const day = cursor.getDay();
    const iso = cursor.toISOString().slice(0, 10);
    if (day !== 0 && day !== 6 && !holidaySet.has(iso)) count++;
    cursor.setDate(cursor.getDate() + 1);
  }
  return count;
}

export function tipCalculator(bill: number, tipPercent: number, splitBetween = 1) {
  const tip = (bill * tipPercent) / 100;
  const total = bill + tip;
  return {
    tip: roundTo(tip, 2),
    total: roundTo(total, 2),
    perPerson: roundTo(total / Math.max(1, splitBetween), 2),
  };
}

export function discountCalculator(originalPrice: number, discountPercent: number) {
  const discountAmount = (originalPrice * discountPercent) / 100;
  return {
    discountAmount: roundTo(discountAmount, 2),
    finalPrice: roundTo(originalPrice - discountAmount, 2),
  };
}

export function fuelMileage(distance: number, fuelUsed: number): number {
  if (fuelUsed <= 0) return 0;
  return roundTo(distance / fuelUsed, 2);
}
