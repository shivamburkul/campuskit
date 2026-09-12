import type { Metadata } from 'next';
import { MarkdownPreview } from '@/components/tools/developer/MarkdownPreview';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('markdown-preview');

export default function Page() {
  return <ToolPageBody slug="markdown-preview" Component={MarkdownPreview} />;
}
