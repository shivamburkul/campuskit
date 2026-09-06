'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { CATEGORIES, CategoryId, ToolMeta } from '@/config/registry';

export function AllToolsClient({ tools, categoryIds }: { tools: ToolMeta[]; categoryIds: CategoryId[] }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tools;
    return tools.filter(
      (t) => t.title.toLowerCase().includes(q) || t.keywords.some((k) => k.toLowerCase().includes(q)) || t.description.toLowerCase().includes(q)
    );
  }, [tools, query]);

  return (
    <div>
      <div className="max-w-md">
        <label htmlFor="all-tools-search" className="sr-only">
          Search all tools
        </label>
        <input
          id="all-tools-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search all tools…"
          className="w-full rounded-md border border-ink-100 bg-surface px-4 py-2.5 text-sm text-ink-900 shadow-sm outline-none transition-colors focus:border-moss-500 focus:ring-1 focus:ring-moss-500 dark:border-ink-700 dark:bg-ink-100 dark:text-ink-50 dark:focus:border-moss-400 dark:focus:ring-moss-400/40"
        />
      </div>

      {query.trim() && (
        <p className="mt-3 text-sm text-ink-500 dark:text-ink-400">
          {filtered.length} result{filtered.length === 1 ? '' : 's'} for &ldquo;{query}&rdquo;
        </p>
      )}

      {!query.trim() && (
        <nav aria-label="Jump to category" className="mt-6 flex flex-wrap gap-2">
          {categoryIds.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className="rounded-full border border-ink-100 px-3 py-1 text-xs text-ink-700 hover:border-moss-400 hover:text-moss-600 dark:border-ink-700 dark:text-ink-300 dark:hover:border-moss-600 dark:hover:text-moss-400"
            >
              {CATEGORIES[id].name}
            </a>
          ))}
        </nav>
      )}

      <div className="mt-10 space-y-10">
        {categoryIds.map((id) => {
          const categoryTools = filtered.filter((t) => t.category === id);
          if (categoryTools.length === 0) return null;
          return (
            <div key={id} id={id} className="scroll-mt-20">
              <h2 className="font-display text-xl font-medium text-ink-950 dark:text-ink-50">{CATEGORIES[id].name}</h2>
              <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {categoryTools.map((tool) => (
                  <li key={tool.slug}>
                    {tool.implemented ? (
                      <Link
                        href={`/tools/${tool.slug}`}
                        className="flex items-center justify-between rounded-md border border-ink-100 bg-surface px-4 py-3 text-sm transition-colors hover:border-moss-400 dark:border-ink-700 dark:bg-ink-100 dark:text-ink-200 dark:hover:border-moss-600"
                      >
                        <span className="text-ink-900 dark:text-ink-50">{tool.title}</span>
                      </Link>
                    ) : (
                      <div className="flex items-center justify-between rounded-md border border-dashed border-ink-100 px-4 py-3 text-sm text-ink-500 dark:border-ink-700 dark:text-ink-400">
                        <span>{tool.title}</span>
                        <span className="text-xs">Coming soon</span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
        {filtered.length === 0 && <p className="text-ink-500 dark:text-ink-400">No tools match &ldquo;{query}&rdquo;.</p>}
      </div>
    </div>
  );
}