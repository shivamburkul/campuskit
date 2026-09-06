import type { Metadata } from 'next';
import { PdfSplitTool } from '@/components/tools/pdf/PdfSplitTool';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('pdf-split');

export default function Page() {
  return <ToolPageBody slug="pdf-split" Component={PdfSplitTool} />;
}
