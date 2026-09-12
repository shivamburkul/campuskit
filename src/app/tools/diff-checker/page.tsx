import type { Metadata } from 'next';
import { DiffChecker } from '@/components/tools/developer/DiffChecker';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('diff-checker');

export default function Page() {
  return <ToolPageBody slug="diff-checker" Component={DiffChecker} />;
}
