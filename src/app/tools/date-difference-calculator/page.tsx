import type { Metadata } from 'next';
import { DateDifferenceCalculator } from '@/components/tools/everyday/DateDifferenceCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('date-difference-calculator');

export default function Page() {
  return <ToolPageBody slug="date-difference-calculator" Component={DateDifferenceCalculator} />;
}
