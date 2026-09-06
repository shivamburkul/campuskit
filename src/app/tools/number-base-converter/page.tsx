import type { Metadata } from 'next';
import { NumberBaseConverter } from '@/components/tools/engineering/NumberBaseConverter';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('number-base-converter');

export default function Page() {
  return <ToolPageBody slug="number-base-converter" Component={NumberBaseConverter} />;
}
