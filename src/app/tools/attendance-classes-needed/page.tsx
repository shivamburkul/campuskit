import type { Metadata } from 'next';
import { ClassesNeededCalculator } from '@/components/tools/attendance/ClassesNeededCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('attendance-classes-needed');

export default function Page() {
  return <ToolPageBody slug="attendance-classes-needed" Component={ClassesNeededCalculator} />;
}
