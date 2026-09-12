import type { Metadata } from 'next';
import { TaxDeductionCalculator } from '@/components/tools/finance/TaxDeductionCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('tax-deduction-calculator');

export default function Page() {
  return <ToolPageBody slug="tax-deduction-calculator" Component={TaxDeductionCalculator} />;
}
