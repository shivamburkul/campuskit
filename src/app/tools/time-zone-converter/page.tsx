import type { Metadata } from 'next';
import { TimeZoneConverter } from '@/components/tools/everyday/TimeZoneConverter';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('time-zone-converter');

export default function Page() {
  return <ToolPageBody slug="time-zone-converter" Component={TimeZoneConverter} />;
}
