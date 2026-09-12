import type { Metadata } from 'next';
import { CurrencyConverter } from '@/components/tools/finance/CurrencyConverter';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('currency-converter');

export default function Page() {
  return <ToolPageBody slug="currency-converter" Component={CurrencyConverter} />;
}
