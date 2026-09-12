import type { Metadata } from 'next';
import { GpaCalculator } from '@/components/tools/academic/GpaCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('gpa-calculator');

export default function Page() {
  return <ToolPageBody slug="gpa-calculator" Component={GpaCalculator} />;
}
