import type { Metadata } from 'next';
import { StudyPlanner } from '@/components/tools/study/StudyPlanner';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('study-planner');

export default function Page() {
  return <ToolPageBody slug="study-planner" Component={StudyPlanner} />;
}
