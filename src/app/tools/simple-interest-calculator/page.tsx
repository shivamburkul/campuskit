import type { Metadata } from 'next';
import { SimpleInterestCalculator } from '@/components/tools/finance/SimpleInterestCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('simple-interest-calculator');

export default function Page() {
  return <ToolPageBody slug="simple-interest-calculator" Component={SimpleInterestCalculator} />;
}
