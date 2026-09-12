import type { Metadata } from 'next';
import { BmiCalculator } from '@/components/tools/finance/BmiCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('bmi-calculator');

export default function Page() {
  return <ToolPageBody slug="bmi-calculator" Component={BmiCalculator} />;
}
