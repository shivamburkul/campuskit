import type { Metadata } from 'next';
import { JsonFormatter } from '@/components/tools/developer/JsonFormatter';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('json-formatter');

export default function Page() {
  return <ToolPageBody slug="json-formatter" Component={JsonFormatter} />;
}
