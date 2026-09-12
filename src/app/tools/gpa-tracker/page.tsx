import type { Metadata } from 'next';
import { GpaTracker } from '@/components/tools/study/GpaTracker';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('gpa-tracker');

export default function Page() {
  return <ToolPageBody slug="gpa-tracker" Component={GpaTracker} />;
}
