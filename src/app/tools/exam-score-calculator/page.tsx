import type { Metadata } from 'next';
import { ExamScoreCalculator } from '@/components/tools/academic/ExamScoreCalculator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('exam-score-calculator');

export default function Page() {
  return <ToolPageBody slug="exam-score-calculator" Component={ExamScoreCalculator} />;
}
