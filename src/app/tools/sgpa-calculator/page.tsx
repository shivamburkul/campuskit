import type { Metadata } from 'next';
import { SgpaCalculator } from '@/components/tools/academic/SgpaCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('sgpa-calculator');

export default function Page() {
  return <ToolPageBody slug="sgpa-calculator" Component={SgpaCalculator} />;
}
