import type { Metadata } from 'next';
import { UuidGenerator } from '@/components/tools/developer/UuidGenerator';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('uuid-generator');

export default function Page() {
  return <ToolPageBody slug="uuid-generator" Component={UuidGenerator} />;
}
