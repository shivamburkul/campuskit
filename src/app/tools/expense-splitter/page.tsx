import type { Metadata } from 'next';
import { ExpenseSplitter } from '@/components/tools/finance/ExpenseSplitter';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('expense-splitter');

export default function Page() {
  return <ToolPageBody slug="expense-splitter" Component={ExpenseSplitter} />;
}
