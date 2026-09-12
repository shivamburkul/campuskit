import type { Metadata } from 'next';
import { Base64Tool } from '@/components/tools/developer/Base64Tool';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('base64-tool');

export default function Page() {
  return <ToolPageBody slug="base64-tool" Component={Base64Tool} />;
}
