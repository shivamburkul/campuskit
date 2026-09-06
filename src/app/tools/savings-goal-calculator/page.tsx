import type { Metadata } from 'next';
import { SavingsGoalCalculator } from '@/components/tools/finance/SavingsGoalCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('savings-goal-calculator');

export default function Page() {
  return <ToolPageBody slug="savings-goal-calculator" Component={SavingsGoalCalculator} />;
}
