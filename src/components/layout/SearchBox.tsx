'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { TOOLS } from '@/config/registry';

export function SearchBox({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 1) return [];

    const scored = TOOLS.filter((t) => t.implemented)
      .map((t) => {
        const title = t.title.toLowerCase();
        const short = (t.shortTitle || '').toLowerCase();
        const slug = t.slug.replace(/-/g, ' ');
        const keywords = t.keywords.map((k) => k.toLowerCase()).join(' ');
        const haystack = `${title} ${short} ${slug} ${keywords}`;

        let score = 0;
        if (title === q || short === q) score = 100;
        else if (title.startsWith(q) || short.startsWith(q)) score = 80;
        else if (title.includes(q) || short.includes(q)) score = 60;
        else if (slug.includes(q)) score = 50;
        else if (keywords.includes(q)) score = 40;
        else if (haystack.includes(q)) score = 20;

        return { tool: t, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((x) => x.tool);

    return scored;
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${compact ? 'max-w-md' : 'mx-auto max-w-xl'}`}>
      <input
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search tools — CGPA, attendance, PDF, JSON…"
        aria-label="Search tools"
        className="w-full rounded-full border border-white/30 bg-white/30 px-5 py-3 text-sm text-ink-900 shadow-lg shadow-black/5 outline-none transition-all duration-300 backdrop-blur-[24px] saturate-180 placeholder:text-ink-500 focus:border-primary-400 focus:bg-white/50 focus:ring-2 focus:ring-primary-400/30 dark:border-white/10 dark:bg-ink-900/70 dark:text-ink-50 dark:placeholder:text-ink-400 dark:focus:border-primary-500 dark:focus:bg-ink-900/80 dark:focus:ring-primary-500/30"
      />
      {open && query.trim().length >= 1 && (
        <ul className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-white/30 bg-white/60 shadow-lg backdrop-blur-[24px] saturate-180 dark:border-white/10 dark:bg-ink-900/80">
          {results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-ink-500 dark:text-ink-400">No tools found</li>
          ) : (
            results.map((tool) => (
              <li key={tool.slug}>
                <Link
                  href={`/tools/${tool.slug}`}
                  className="flex items-center px-4 py-2.5 text-sm hover:bg-white/40 dark:hover:bg-ink-800/60"
                  onClick={() => setOpen(false)}
                >
                  <span className="search-title-marquee min-w-0 flex-1 font-medium text-ink-950 dark:text-ink-50">
                    <span className="search-title-text">{tool.title}</span>
                  </span>
                </Link>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
