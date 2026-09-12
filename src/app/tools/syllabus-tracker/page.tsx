import type { Metadata } from 'next';
import { SyllabusTracker } from '@/components/tools/study/SyllabusTracker';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('syllabus-tracker');

export default function Page() {
  return <ToolPageBody slug="syllabus-tracker" Component={SyllabusTracker} />;
}
