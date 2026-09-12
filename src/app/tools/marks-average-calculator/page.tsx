import type { Metadata } from 'next';
import { MarksAverageCalculator } from '@/components/tools/academic/MarksAverageCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('marks-average-calculator');

export default function Page() {
  return <ToolPageBody slug="marks-average-calculator" Component={MarksAverageCalculator} />;
}
