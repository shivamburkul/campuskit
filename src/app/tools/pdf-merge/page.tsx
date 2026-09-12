import type { Metadata } from 'next';
import { PdfMergeTool } from '@/components/tools/pdf/PdfMergeTool';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('pdf-merge');

export default function Page() {
  return <ToolPageBody slug="pdf-merge" Component={PdfMergeTool} />;
}
