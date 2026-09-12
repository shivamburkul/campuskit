import type { Metadata } from 'next';
import { CssMinifier } from '@/components/tools/developer/CssMinifier';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('css-minifier');

export default function Page() {
  return <ToolPageBody slug="css-minifier" Component={CssMinifier} />;
}
