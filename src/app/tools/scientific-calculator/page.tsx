import type { Metadata } from 'next';
import { ScientificCalculator } from '@/components/tools/engineering/ScientificCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('scientific-calculator');

export default function Page() {
  return <ToolPageBody slug="scientific-calculator" Component={ScientificCalculator} />;
}
