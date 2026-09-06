import type { Metadata } from 'next';
import { AttendanceCalculator } from '@/components/tools/attendance/AttendanceCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('attendance-calculator');

export default function Page() {
  return <ToolPageBody slug="attendance-calculator" Component={AttendanceCalculator} />;
}
