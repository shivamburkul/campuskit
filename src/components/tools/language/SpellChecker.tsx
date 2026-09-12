'use client';
import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { ResultPanel, ResultStat, InlineNote } from '@/components/ui/Result';

interface NSpell {
  correct: (word: string) => boolean;
  suggest: (word: string) => string[];
}

interface MisspelledWord {
  word: string;
  suggestions: string[];
}

// A curated allowlist for things a general English dictionary flags but that
// are completely normal in student/technical writing — not run through the
// dictionary at all.
const SKIP_WORDS = new Set(['ok', 'okay']);

export function SpellChecker() {
  const [text, setText] = useState('');
  const [checked, setChecked] = useState(false);
  const [misspelled, setMisspelled] = useState<MisspelledWord[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const spellRef = useRef<NSpell | null>(null);

  const loadSpeller = useCallback(async (): Promise<NSpell> => {
    if (spellRef.current) return spellRef.current;
    const [{ default: nspell }, affRes, dicRes] = await Promise.all([
      import('nspell'),
      fetch('/dictionaries/en/en.aff'),
      fetch('/dictionaries/en/en.dic'),
    ]);
    if (!affRes.ok || !dicRes.ok) throw new Error('Could not load the dictionary.');
    const [aff, dic] = await Promise.all([affRes.text(), dicRes.text()]);
    const spell = nspell(aff, dic) as NSpell;
    spellRef.current = spell;
    return spell;
  }, []);

  async function checkSpelling() {
    setLoading(true);
    setLoadError(null);
    try {
      const spell = await loadSpeller();
      const words = text.match(/[A-Za-z']+/g) ?? [];
      const seen = new Set<string>();
      const misspelledWords: MisspelledWord[] = [];

      for (const raw of words) {
        const word = raw.toLowerCase();
        if (word.length <= 1 || seen.has(word) || SKIP_WORDS.has(word)) continue;
        seen.add(word);
        if (!spell.correct(raw) && !spell.correct(word)) {
          misspelledWords.push({ word: raw, suggestions: spell.suggest(raw).slice(0, 4) });
        }
      }

      setMisspelled(misspelledWords);
      setChecked(true);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Could not check spelling right now.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => { setText(e.target.value); setChecked(false); }}
        rows={10}
        placeholder="Type or paste your text here..."
        className="w-full resize-y rounded-xl border border-ink-200/70 bg-surface px-4 py-3 text-ink-900 shadow-sm outline-none transition-all duration-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
      />

      <Button type="button" onClick={checkSpelling} disabled={!text.trim() || loading}>
        {loading ? 'Checking…' : 'Check Spelling'}
      </Button>

      {loadError && <InlineNote tone="warning">{loadError}</InlineNote>}

      {checked && !loadError && (
        <ResultPanel>
          {misspelled.length === 0 ? (
            <ResultStat label="Result" value="No spelling errors found! 🎉" emphasis />
          ) : (
            <>
              <ResultStat label="Potential Misspellings" value={misspelled.length} emphasis />
              <div className="mt-4 space-y-2">
                {misspelled.map((item, index) => (
                  <div key={index} className="flex flex-wrap items-center gap-2 border-b border-ink-100 pb-2 last:border-b-0 dark:border-ink-700">
                    <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700 dark:bg-red-900/30 dark:text-red-300">
                      {item.word}
                    </span>
                    {item.suggestions.length > 0 && (
                      <span className="text-sm text-ink-500 dark:text-ink-400">
                        → {item.suggestions.join(', ')}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </ResultPanel>
      )}

      <InlineNote>
        Checked against a full English dictionary, entirely in your browser — nothing is uploaded. It may
        still flag proper nouns, names, and specialized technical terms that aren&apos;t in a general
        dictionary.
      </InlineNote>
    </div>
  );
}
