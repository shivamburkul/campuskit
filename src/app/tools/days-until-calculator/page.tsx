import type { Metadata } from 'next';
import { DaysUntilCalculator } from '@/components/tools/everyday/DaysUntilCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('days-until-calculator');

export default function Page() {
  return <ToolPageBody slug="days-until-calculator" Component={DaysUntilCalculator} />;
}
