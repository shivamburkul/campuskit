import type { Metadata } from 'next';
import { TextDiffTool } from '@/components/tools/text/TextDiffTool';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('text-diff');

export default function Page() {
  return <ToolPageBody slug="text-diff" Component={TextDiffTool} />;
}
