'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TOOLS } from '@/config/registry';

export function SearchBox({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return TOOLS.filter(
      (t) =>
        t.implemented &&
        (t.title.toLowerCase().includes(q) ||
          t.keywords.some((k) => k.toLowerCase().includes(q)))
    ).slice(0, 8);
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
        placeholder="Search tools — CGPA, attendance, compress PDF, JSON…"
        aria-label="Search tools"
        className="w-full rounded-md border border-ink-100 bg-surface px-4 py-2.5 text-sm text-ink-900 shadow-sm outline-none transition-colors focus:border-moss-500 focus:ring-1 focus:ring-moss-500 dark:border-ink-700 dark:bg-ink-100 dark:text-ink-50 dark:focus:border-moss-400 dark:focus:ring-moss-400/40"
      />
      {open && results.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-md border border-ink-100 bg-surface shadow-lg dark:border-ink-700 dark:bg-ink-100">
          {results.map((tool) => (
            <li key={tool.slug}>
              <Link
                href={`/tools/${tool.slug}`}
                className="block px-4 py-2.5 text-sm text-ink-800 hover:bg-moss-100/50 dark:text-ink-200 dark:hover:bg-ink-700/50"
                onClick={() => setOpen(false)}
              >
                <span className="font-medium text-ink-950 dark:text-ink-50">{tool.title}</span>
                <span className="ml-2 text-xs text-ink-500 dark:text-ink-400">{tool.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}