import type { Metadata } from 'next';
import { ImageEditorTool } from '@/components/tools/image/ImageEditorTool';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('image-editor');

export default function Page() {
  return <ToolPageBody slug="image-editor" Component={ImageEditorTool} />;
}
