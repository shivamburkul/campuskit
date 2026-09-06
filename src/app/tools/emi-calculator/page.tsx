import type { Metadata } from 'next';
import { EmiCalculator } from '@/components/tools/finance/EmiCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('emi-calculator');

export default function Page() {
  return <ToolPageBody slug="emi-calculator" Component={EmiCalculator} />;
}
