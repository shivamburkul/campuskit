'use client';
import { useState } from 'react';
import { analyzeText } from '@/lib/tools/text';
import { ResultStat } from '@/components/ui/Result';

export function WordCounter() {
  const [text, setText] = useState('');
  const stats = analyzeText(text);
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type your text here…"
        rows={14}
        className="w-full resize-y rounded-md border border-ink-100 bg-surface p-4 text-sm text-ink-900 shadow-sm outline-none focus:border-moss-500 focus:ring-1 focus:ring-moss-500"
      />
      <div className="rounded-lg border border-moss-100 bg-moss-100/40 p-5">
        <ResultStat label="Words" value={stats.words} emphasis />
        <ResultStat label="Characters" value={stats.characters} />
        <ResultStat label="Characters (no spaces)" value={stats.charactersNoSpaces} />
        <ResultStat label="Sentences" value={stats.sentences} />
        <ResultStat label="Paragraphs" value={stats.paragraphs} />
        <ResultStat label="Lines" value={stats.lines} />
        <ResultStat label="Reading time" value={`${Math.max(1, Math.ceil(stats.readingTimeMinutes))} min`} />
        <ResultStat label="Speaking time" value={`${Math.max(1, Math.ceil(stats.speakingTimeMinutes))} min`} />
      </div>
    </div>
  );
}
