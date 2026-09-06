import type { Metadata } from 'next';
import { PercentageCalculator } from '@/components/tools/academic/PercentageCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('percentage-calculator');

export default function Page() {
  return <ToolPageBody slug="percentage-calculator" Component={PercentageCalculator} />;
}
