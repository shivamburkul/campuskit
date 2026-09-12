import type { Metadata } from 'next';
import { MatrixCalculator } from '@/components/tools/engineering/MatrixCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('matrix-calculator');

export default function Page() {
  return <ToolPageBody slug="matrix-calculator" Component={MatrixCalculator} />;
}
