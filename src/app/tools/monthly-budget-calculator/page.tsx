import type { Metadata } from 'next';
import { MonthlyBudgetCalculator } from '@/components/tools/finance/MonthlyBudgetCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('monthly-budget-calculator');

export default function Page() {
  return <ToolPageBody slug="monthly-budget-calculator" Component={MonthlyBudgetCalculator} />;
}
