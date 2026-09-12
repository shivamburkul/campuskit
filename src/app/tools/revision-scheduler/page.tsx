import type { Metadata } from 'next';
import { RevisionScheduler } from '@/components/tools/study/RevisionScheduler';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('revision-scheduler');

export default function Page() {
  return <ToolPageBody slug="revision-scheduler" Component={RevisionScheduler} />;
}
