import type { Metadata } from 'next';
import { MindMapBuilder } from '@/components/tools/study/MindMapBuilder';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('mind-map-builder');

export default function Page() {
  return <ToolPageBody slug="mind-map-builder" Component={MindMapBuilder} />;
}
