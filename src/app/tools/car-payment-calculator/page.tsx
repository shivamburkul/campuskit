import type { Metadata } from 'next';
import { CarPaymentCalculator } from '@/components/tools/finance/CarPaymentCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('car-payment-calculator');

export default function Page() {
  return <ToolPageBody slug="car-payment-calculator" Component={CarPaymentCalculator} />;
}
