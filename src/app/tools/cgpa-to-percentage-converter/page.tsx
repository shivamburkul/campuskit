import type { Metadata } from 'next';
import { CgpaToPercentageConverter } from '@/components/tools/academic/CgpaToPercentageConverter';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('cgpa-to-percentage-converter');

export default function Page() {
  return <ToolPageBody slug="cgpa-to-percentage-converter" Component={CgpaToPercentageConverter} />;
}
