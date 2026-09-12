import type { Metadata } from 'next';
import { MolarMassCalculator } from '@/components/tools/science/MolarMassCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('molar-mass-calculator');

export default function Page() {
  return <ToolPageBody slug="molar-mass-calculator" Component={MolarMassCalculator} />;
}
