import type { Metadata } from 'next';
import { TimestampConverter } from '@/components/tools/developer/TimestampConverter';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('timestamp-converter');

export default function Page() {
  return <ToolPageBody slug="timestamp-converter" Component={TimestampConverter} />;
}
