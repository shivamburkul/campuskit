import type { Metadata } from 'next';
import { PermutationCombinationCalculator } from '@/components/tools/engineering/PermutationCombinationCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('permutation-combination-calculator');

export default function Page() {
  return <ToolPageBody slug="permutation-combination-calculator" Component={PermutationCombinationCalculator} />;
}
