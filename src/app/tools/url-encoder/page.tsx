import type { Metadata } from 'next';
import { UrlEncoderTool } from '@/components/tools/developer/UrlEncoderTool';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('url-encoder');

export default function Page() {
  return <ToolPageBody slug="url-encoder" Component={UrlEncoderTool} />;
}
