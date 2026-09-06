import type { Metadata } from 'next';
import { JwtDecoder } from '@/components/tools/developer/JwtDecoder';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('jwt-decoder');

export default function Page() {
  return <ToolPageBody slug="jwt-decoder" Component={JwtDecoder} />;
}
