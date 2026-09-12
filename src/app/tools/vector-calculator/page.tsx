import type { Metadata } from 'next';
import { VectorCalculator } from '@/components/tools/engineering/VectorCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('vector-calculator');

export default function Page() {
  return <ToolPageBody slug="vector-calculator" Component={VectorCalculator} />;
}
