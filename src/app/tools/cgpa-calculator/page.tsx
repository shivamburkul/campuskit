import type { Metadata } from 'next';
import { CgpaCalculator } from '@/components/tools/academic/CgpaCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('cgpa-calculator');

export default function Page() {
  return <ToolPageBody slug="cgpa-calculator" Component={CgpaCalculator} />;
}
