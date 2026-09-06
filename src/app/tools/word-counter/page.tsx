import type { Metadata } from 'next';
import { WordCounter } from '@/components/tools/text/WordCounter';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('word-counter');

export default function Page() {
  return <ToolPageBody slug="word-counter" Component={WordCounter} />;
}
