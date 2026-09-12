import type { Metadata } from 'next';
import { IntegrationCalculator } from '@/components/tools/engineering/IntegrationCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('integration-calculator');

export default function Page() {
  return <ToolPageBody slug="integration-calculator" Component={IntegrationCalculator} />;
}
