import type { Metadata } from 'next';
import { WaterIntakeCalculator } from '@/components/tools/everyday/WaterIntakeCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('water-intake-calculator');

export default function Page() {
  return <ToolPageBody slug="water-intake-calculator" Component={WaterIntakeCalculator} />;
}
