import type { Metadata } from 'next';
import { WorldClock } from '@/components/tools/everyday/WorldClock';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('world-clock');

export default function Page() {
  return <ToolPageBody slug="world-clock" Component={WorldClock} />;
}
