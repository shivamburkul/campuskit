import type { Metadata } from 'next';
import { ColorConverter } from '@/components/tools/developer/ColorConverter';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('color-converter');

export default function Page() {
  return <ToolPageBody slug="color-converter" Component={ColorConverter} />;
}
