import type { Metadata } from 'next';
import { UnitConverterTool } from '@/components/tools/engineering/UnitConverterTool';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('unit-converter');

export default function Page() {
  return <ToolPageBody slug="unit-converter" Component={UnitConverterTool} />;
}
