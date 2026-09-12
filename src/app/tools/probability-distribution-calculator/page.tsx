import type { Metadata } from 'next';
import { ProbabilityDistributionCalculator } from '@/components/tools/engineering/ProbabilityDistributionCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('probability-distribution-calculator');

export default function Page() {
  return <ToolPageBody slug="probability-distribution-calculator" Component={ProbabilityDistributionCalculator} />;
}
