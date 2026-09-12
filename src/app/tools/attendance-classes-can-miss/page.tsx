import type { Metadata } from 'next';
import { ClassesCanMissCalculator } from '@/components/tools/attendance/ClassesCanMissCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('attendance-classes-can-miss');

export default function Page() {
  return <ToolPageBody slug="attendance-classes-can-miss" Component={ClassesCanMissCalculator} />;
}
