import type { Metadata } from 'next';
import { DiscountCalculator } from '@/components/tools/everyday/DiscountCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('discount-calculator');

export default function Page() {
  return <ToolPageBody slug="discount-calculator" Component={DiscountCalculator} />;
}
