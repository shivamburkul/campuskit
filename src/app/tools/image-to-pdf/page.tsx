import type { Metadata } from 'next';
import { ImageToPdfTool } from '@/components/tools/pdf/ImageToPdfTool';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('image-to-pdf');

export default function Page() {
  return <ToolPageBody slug="image-to-pdf" Component={ImageToPdfTool} />;
}
