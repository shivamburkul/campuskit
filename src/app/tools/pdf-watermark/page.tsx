import type { Metadata } from 'next';
import { PdfWatermark } from '@/components/tools/pdf/PdfWatermark';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('pdf-watermark');

export default function Page() {
  return <ToolPageBody slug="pdf-watermark" Component={PdfWatermark} />;
}
