import type { Metadata } from 'next';
import { RetirementCalculator } from '@/components/tools/finance/RetirementCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('retirement-calculator');

export default function Page() {
  return <ToolPageBody slug="retirement-calculator" Component={RetirementCalculator} />;
}
