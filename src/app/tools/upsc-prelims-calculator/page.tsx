import type { Metadata } from 'next';
import { UpscPrelimsCalculator } from '@/components/tools/exams/UpscPrelimsCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('upsc-prelims-calculator');

export default function Page() {
  return <ToolPageBody slug="upsc-prelims-calculator" Component={UpscPrelimsCalculator} />;
}
