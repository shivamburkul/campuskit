import type { Metadata } from 'next';
import { FlashcardMaker } from '@/components/tools/study/FlashcardMaker';
import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

export const metadata: Metadata = buildToolMetadata('flashcard-maker');

export default function Page() {
  return <ToolPageBody slug="flashcard-maker" Component={FlashcardMaker} />;
}
