import type { Metadata } from 'next';
import { GstCalculator } from '@/components/tools/everyday/GstCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('gst-calculator');

export default function Page() {
  return <ToolPageBody slug="gst-calculator" Component={GstCalculator} />;
}
