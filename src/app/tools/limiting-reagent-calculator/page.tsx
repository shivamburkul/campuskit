import type { Metadata } from 'next';
import { LimitingReagentCalculator } from '@/components/tools/science/LimitingReagentCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('limiting-reagent-calculator');

export default function Page() {
  return <ToolPageBody slug="limiting-reagent-calculator" Component={LimitingReagentCalculator} />;
}
