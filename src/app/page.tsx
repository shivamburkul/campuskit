import Link from 'next/link';
import { SearchBox } from '@/components/layout/SearchBox';
import { AdSlot } from '@/components/layout/AdSlot';
import { CATEGORIES, CategoryId, getImplementedTools, getToolsByCategory } from '@/config/registry';
import { ArrowRight, Sparkles } from 'lucide-react';

const FEATURED_SLUGS = [
  'cgpa-calculator',
  'attendance-calculator',
  'attendance-classes-needed',
  'expense-splitter',
  'pdf-merge',
  'image-compressor',
  'json-formatter',
  'word-counter',
];

export default function HomePage() {
  const implementedTools = getImplementedTools();
  const featured = FEATURED_SLUGS.map((slug) => implementedTools.find((t) => t.slug === slug)).filter(Boolean);
  const categoryIds = Object.keys(CATEGORIES) as CategoryId[];

  return (
    <div className="min-h-screen bg-paper dark:bg-paper">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-100/80 via-surface to-paper dark:from-paper dark:via-paper dark:to-paper">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-br from-primary-200/80 to-violet-200/80 blur-3xl dark:from-primary-500/15 dark:to-violet-500/10" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-tr from-coral-200/60 to-amber-200/60 blur-3xl dark:from-primary-500/10 dark:to-transparent" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-100/80 px-4 py-1.5 text-sm font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 backdrop-blur-sm">
            <Sparkles size={16} />
            Free for students, forever
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-bold leading-tight text-ink-950 sm:text-5xl lg:text-6xl">
            The tools you actually <br className="hidden sm:block" />
            <span className="gradient-text">reach for</span> during a semester.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ink-700 dark:text-ink-300">
            CGPA, attendance, PDFs, images, text and dev utilities — all in one place, no account required.
          </p>
          <div className="mt-8">
            <SearchBox />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-ink-500 dark:text-ink-400">
            <span>Try:</span>
            {['CGPA', 'attendance', 'compress PDF', 'JSON'].map((term) => (
              <span
                key={term}
                className="rounded-full border border-ink-200/60 bg-surface/50 px-3 py-1 text-xs backdrop-blur-sm dark:border-ink-700/60 dark:bg-ink-900/50"
              >
                {term}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-medium text-ink-950 dark:text-ink-50">Most‑used tools</h2>
          <Link href="/tools" className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:underline dark:text-primary-400">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((tool) => (
            <Link
              key={tool!.slug}
              href={`/tools/${tool!.slug}`}
              className="group rounded-xl border border-ink-100/60 bg-surface p-5 shadow-card transition-all hover:shadow-card-hover hover:border-primary-200 dark:border-ink-700 dark:bg-ink-900 dark:hover:border-primary-700/60"
            >
              <h3 className="font-display text-base font-semibold text-ink-950 group-hover:text-primary-700 dark:text-ink-50 dark:group-hover:text-primary-300">
                {tool!.title}
              </h3>
              <p className="mt-1.5 text-sm text-ink-700 dark:text-ink-300">{tool!.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <AdSlot position="homepage" className="mx-auto mb-14 max-w-6xl px-4 sm:px-6" />

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <h2 className="font-display text-2xl font-medium text-ink-950 dark:text-ink-50">Browse by category</h2>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {categoryIds.map((id) => {
            const tools = getToolsByCategory(id).filter((t) => t.implemented);
            if (tools.length === 0) return null;
            return (
              <div
                key={id}
                className="rounded-xl border border-ink-100/60 bg-surface p-5 shadow-card transition-all hover:shadow-card-hover hover:border-primary-200 dark:border-ink-700 dark:bg-ink-900 dark:hover:border-primary-700/60"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold text-ink-950 dark:text-ink-50">{CATEGORIES[id].name}</h3>
                  <Link href={`/category/${id}`} className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:underline dark:text-primary-400">
                    View all <ArrowRight size={14} />
                  </Link>
                </div>
                <p className="mt-1 text-sm text-ink-700 dark:text-ink-300">{CATEGORIES[id].description}</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {tools.slice(0, 5).map((t) => (
                    <li key={t.slug}>
                      <Link
                        href={`/tools/${t.slug}`}
                        className="inline-block rounded-full border border-ink-200/60 bg-surface/50 px-3 py-1 text-xs text-ink-700 transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 dark:border-ink-700/60 dark:text-ink-300 dark:hover:border-primary-600/40 dark:hover:bg-primary-900/20 dark:hover:text-primary-300"
                      >
                        {t.shortTitle}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}