import type { Metadata } from 'next';
import { TextCleaner } from '@/components/tools/text/TextCleaner';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('text-cleaner');

export default function Page() {
  return <ToolPageBody slug="text-cleaner" Component={TextCleaner} />;
}
