import type { Metadata } from 'next';
import { BusinessDaysCalculator } from '@/components/tools/everyday/BusinessDaysCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('business-days-calculator');

export default function Page() {
  return <ToolPageBody slug="business-days-calculator" Component={BusinessDaysCalculator} />;
}
