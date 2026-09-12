import type { Metadata } from 'next';
import { SignificantFiguresCalculator } from '@/components/tools/science/SignificantFiguresCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('significant-figures-calculator');

export default function Page() {
  return <ToolPageBody slug="significant-figures-calculator" Component={SignificantFiguresCalculator} />;
}
