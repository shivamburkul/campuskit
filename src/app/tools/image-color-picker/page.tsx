import type { Metadata } from 'next';
import { ImageColorPicker } from '@/components/tools/image/ImageColorPicker';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('image-color-picker');

export default function Page() {
  return <ToolPageBody slug="image-color-picker" Component={ImageColorPicker} />;
}
