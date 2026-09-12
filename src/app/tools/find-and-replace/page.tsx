import type { Metadata } from 'next';
import { FindAndReplaceTool } from '@/components/tools/text/FindAndReplaceTool';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('find-and-replace');

export default function Page() {
  return <ToolPageBody slug="find-and-replace" Component={FindAndReplaceTool} />;
}
