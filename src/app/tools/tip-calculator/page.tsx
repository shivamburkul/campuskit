import type { Metadata } from 'next';
import { TipCalculator } from '@/components/tools/everyday/TipCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('tip-calculator');

export default function Page() {
  return <ToolPageBody slug="tip-calculator" Component={TipCalculator} />;
}
