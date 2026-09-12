import type { Metadata } from 'next';
import { PdfToImageTool } from '@/components/tools/pdf/PdfToImageTool';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('pdf-to-image');

export default function Page() {
  return <ToolPageBody slug="pdf-to-image" Component={PdfToImageTool} />;
}
