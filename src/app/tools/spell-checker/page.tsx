import type { Metadata } from 'next';
import { SpellChecker } from '@/components/tools/language/SpellChecker';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('spell-checker');

export default function Page() {
  return <ToolPageBody slug="spell-checker" Component={SpellChecker} />;
}
