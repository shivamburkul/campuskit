import type { Metadata } from 'next';
import { RegexTester } from '@/components/tools/developer/RegexTester';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('regex-tester');

export default function Page() {
  return <ToolPageBody slug="regex-tester" Component={RegexTester} />;
}
