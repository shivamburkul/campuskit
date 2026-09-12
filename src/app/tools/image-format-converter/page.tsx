import type { Metadata } from 'next';
import { ImageFormatConverter } from '@/components/tools/image/ImageFormatConverter';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('image-format-converter');

export default function Page() {
  return <ToolPageBody slug="image-format-converter" Component={ImageFormatConverter} />;
}
