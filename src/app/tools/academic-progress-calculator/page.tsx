import type { Metadata } from 'next';
import { AcademicProgressCalculator } from '@/components/tools/academic/AcademicProgressCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('academic-progress-calculator');

export default function Page() {
  return <ToolPageBody slug="academic-progress-calculator" Component={AcademicProgressCalculator} />;
}
