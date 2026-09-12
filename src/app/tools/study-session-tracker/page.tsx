import type { Metadata } from 'next';
import { StudySessionTracker } from '@/components/tools/study/StudySessionTracker';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('study-session-tracker');

export default function Page() {
  return <ToolPageBody slug="study-session-tracker" Component={StudySessionTracker} />;
}
