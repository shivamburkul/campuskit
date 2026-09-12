'use client';
import { useState, useMemo } from 'react';
import { analyzeText } from '@/lib/tools/text';
import { ResultStat } from '@/components/ui/Result';

export function WordCounter() {
  const [text, setText] = useState('');
  const stats = analyzeText(text);

  const wordFrequency = useMemo(() => {
    if (!text.trim()) return [];
    // No minimum length filter — short but meaningful words ("my", "is", "a")
    // are real repetitions a writer may want to see, not noise to hide.
    const words = text.toLowerCase().match(/[a-z']+/g) || [];
    const freq: Record<string, number> = {};
    words.forEach((word) => {
      freq[word] = (freq[word] || 0) + 1;
    });
    return Object.entries(freq)
      .filter(([, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);
  }, [text]);

  const topCount = wordFrequency[0]?.[1] ?? 1;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type your text here…"
        rows={14}
        className="w-full resize-y rounded-md border border-ink-100 bg-surface p-4 text-sm text-ink-900 shadow-sm outline-none focus:border-moss-500 focus:ring-1 focus:ring-moss-500"
      />
      <div className="space-y-4">
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

        {wordFrequency.length > 0 && (
          <div className="rounded-lg border border-moss-100 bg-moss-100/40 p-5">
            <p className="mb-3 text-sm font-medium text-ink-700 dark:text-ink-300">Most repeated words</p>
            <div className="space-y-2">
              {wordFrequency.map(([word, count]) => (
                <div key={word} className="flex items-center justify-between gap-2">
                  <span className="font-medium text-ink-900 dark:text-ink-50">{word}</span>
                  <div className="flex flex-1 items-center justify-end gap-2">
                    <div className="h-2 w-20 rounded-full bg-ink-100 dark:bg-ink-700">
                      <div className="h-2 rounded-full bg-primary-600" style={{ width: `${(count / topCount) * 100}%` }} />
                    </div>
                    <span className="w-8 text-right text-sm text-ink-600 dark:text-ink-400">{count}×</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
