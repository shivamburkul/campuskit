import type { Metadata } from 'next';
import { RequiredMarksCalculator } from '@/components/tools/academic/RequiredMarksCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('required-marks-calculator');

export default function Page() {
  return <ToolPageBody slug="required-marks-calculator" Component={RequiredMarksCalculator} />;
}
