import type { Metadata } from 'next';
import { GradeCalculator } from '@/components/tools/academic/GradeCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('grade-calculator');

export default function Page() {
  return <ToolPageBody slug="grade-calculator" Component={GradeCalculator} />;
}
