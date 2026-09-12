import type { Metadata } from 'next';
import { DifferentialCalculator } from '@/components/tools/engineering/DifferentialCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('differential-calculator');

export default function Page() {
  return <ToolPageBody slug="differential-calculator" Component={DifferentialCalculator} />;
}
