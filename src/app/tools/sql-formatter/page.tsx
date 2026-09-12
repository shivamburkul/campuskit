import type { Metadata } from 'next';
import { SqlFormatter } from '@/components/tools/developer/SqlFormatter';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('sql-formatter');

export default function Page() {
  return <ToolPageBody slug="sql-formatter" Component={SqlFormatter} />;
}
