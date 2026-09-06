import type { Metadata } from 'next';
import { CompoundInterestCalculator } from '@/components/tools/finance/CompoundInterestCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('compound-interest-calculator');

export default function Page() {
  return <ToolPageBody slug="compound-interest-calculator" Component={CompoundInterestCalculator} />;
}
