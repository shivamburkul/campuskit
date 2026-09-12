import type { Metadata } from 'next';
import { PdfCompressTool } from '@/components/tools/pdf/PdfCompressTool';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('compress-pdf');

export default function Page() {
  return <ToolPageBody slug="compress-pdf" Component={PdfCompressTool} />;
}
