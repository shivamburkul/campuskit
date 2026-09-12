import type { Metadata } from 'next';
import { GroceryExpenseSplitter } from '@/components/tools/finance/GroceryExpenseSplitter';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('grocery-expense-splitter');

export default function Page() {
  return <ToolPageBody slug="grocery-expense-splitter" Component={GroceryExpenseSplitter} />;
}
