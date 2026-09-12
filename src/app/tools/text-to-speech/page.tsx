import type { Metadata } from 'next';
import { TextToSpeech } from '@/components/tools/language/TextToSpeech';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('text-to-speech');

export default function Page() {
  return <ToolPageBody slug="text-to-speech" Component={TextToSpeech} />;
}
