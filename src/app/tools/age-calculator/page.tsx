import type { Metadata } from 'next';
import { AgeCalculator } from '@/components/tools/everyday/AgeCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('age-calculator');

export default function Page() {
  return <ToolPageBody slug="age-calculator" Component={AgeCalculator} />;
}
