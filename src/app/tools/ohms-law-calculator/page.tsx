import type { Metadata } from 'next';
import { OhmsLawCalculator } from '@/components/tools/engineering/OhmsLawCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('ohms-law-calculator');

export default function Page() {
  return <ToolPageBody slug="ohms-law-calculator" Component={OhmsLawCalculator} />;
}
