import type { Metadata } from 'next';
import { TargetGpaCalculator } from '@/components/tools/academic/TargetGpaCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('target-gpa-calculator');

export default function Page() {
  return <ToolPageBody slug="target-gpa-calculator" Component={TargetGpaCalculator} />;
}
