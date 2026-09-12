import type { Metadata } from 'next';
import { RankPercentileCalculator } from '@/components/tools/academic/RankPercentileCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('rank-percentile-calculator');

export default function Page() {
  return <ToolPageBody slug="rank-percentile-calculator" Component={RankPercentileCalculator} />;
}
