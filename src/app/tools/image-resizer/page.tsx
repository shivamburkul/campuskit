import type { Metadata } from 'next';
import { ImageResizerTool } from '@/components/tools/image/ImageResizerTool';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('image-resizer');

export default function Page() {
  return <ToolPageBody slug="image-resizer" Component={ImageResizerTool} />;
}
