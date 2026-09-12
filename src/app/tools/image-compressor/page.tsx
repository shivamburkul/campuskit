import type { Metadata } from 'next';
import { ImageCompressorTool } from '@/components/tools/image/ImageCompressorTool';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('image-compressor');

export default function Page() {
  return <ToolPageBody slug="image-compressor" Component={ImageCompressorTool} />;
}
