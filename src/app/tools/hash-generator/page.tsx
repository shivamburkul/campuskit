import type { Metadata } from 'next';
import { HashGenerator } from '@/components/tools/developer/HashGenerator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('hash-generator');

export default function Page() {
  return <ToolPageBody slug="hash-generator" Component={HashGenerator} />;
}
