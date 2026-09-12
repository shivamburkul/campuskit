import type { Metadata } from 'next';
import { ExamCountdown } from '@/components/tools/study/ExamCountdown';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('exam-countdown');

export default function Page() {
  return <ToolPageBody slug="exam-countdown" Component={ExamCountdown} />;
}
