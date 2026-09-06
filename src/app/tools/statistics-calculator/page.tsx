import type { Metadata } from 'next';
import { StatisticsCalculator } from '@/components/tools/engineering/StatisticsCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('statistics-calculator');

export default function Page() {
  return <ToolPageBody slug="statistics-calculator" Component={StatisticsCalculator} />;
}
