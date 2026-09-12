import type { Metadata } from 'next';
import { CaseConverter } from '@/components/tools/text/CaseConverter';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('case-converter');

export default function Page() {
  return <ToolPageBody slug="case-converter" Component={CaseConverter} />;
}
