import type { Metadata } from 'next';
import { SleepCycleCalculator } from '@/components/tools/everyday/SleepCycleCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('sleep-cycle-calculator');

export default function Page() {
  return <ToolPageBody slug="sleep-cycle-calculator" Component={SleepCycleCalculator} />;
}
