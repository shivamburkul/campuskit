import type { Metadata } from 'next';
import { HtmlMinifier } from '@/components/tools/developer/HtmlMinifier';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('html-minifier');

export default function Page() {
  return <ToolPageBody slug="html-minifier" Component={HtmlMinifier} />;
}
