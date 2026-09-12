import Link from 'next/link';
import { SearchBox } from '@/components/layout/SearchBox';
import { AdSlot } from '@/components/layout/AdSlot';
import { CATEGORIES, CategoryId, getImplementedTools, getToolsByCategory } from '@/config/registry';
import { ArrowRight, Sparkles, Calculator, CalendarCheck, Wallet, FileText, Image as ImageIcon, Type, Code2, Clock } from 'lucide-react';

const FEATURED_SLUGS = [
  'cgpa-calculator',
  'attendance-calculator',
  'attendance-classes-needed',
  'expense-splitter',
  'pdf-merge',
  'image-compressor',
  'json-formatter',
  'word-counter',
  'gpa-calculator',
  'percentage-calculator',
  'pomodoro-timer',
  'unit-converter',
];

const FEATURED_ICONS: Record<string, React.ReactNode> = {
  'cgpa-calculator': <Calculator size={28} />,
  'attendance-calculator': <CalendarCheck size={28} />,
  'attendance-classes-needed': <CalendarCheck size={28} />,
  'expense-splitter': <Wallet size={28} />,
  'pdf-merge': <FileText size={28} />,
  'image-compressor': <ImageIcon size={28} />,
  'json-formatter': <Code2 size={28} />,
  'word-counter': <Type size={28} />,
  'gpa-calculator': <Calculator size={28} />,
  'percentage-calculator': <Calculator size={28} />,
  'pomodoro-timer': <Clock size={28} />,
  'unit-converter': <Calculator size={28} />,
};

export default function HomePage() {
  const implementedTools = getImplementedTools();
  const featured = FEATURED_SLUGS.map((slug) => implementedTools.find((t) => t.slug === slug)).filter(Boolean);
  const categoryIds = Object.keys(CATEGORIES) as CategoryId[];

  const marqueeItems = [...featured, ...featured];

  return (
    /* Cancel layout top-padding so hero is truly full-bleed under the floating header */
    <div className="-mt-20 sm:-mt-24 min-h-screen bg-paper dark:bg-paper overflow-x-hidden">
      {/* Full-viewport hero gradient */}
      <section className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden bg-gradient-to-b from-primary-100/90 via-primary-50/50 to-paper dark:from-primary-950/40 dark:via-paper dark:to-paper pt-24 sm:pt-28 pb-16 sm:pb-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 h-[32rem] w-[32rem] rounded-full bg-gradient-to-br from-primary-200/70 to-violet-200/60 blur-3xl dark:from-primary-500/20 dark:to-violet-500/10" />
          <div className="absolute -bottom-32 -left-32 h-[32rem] w-[32rem] rounded-full bg-gradient-to-tr from-coral-200/50 to-amber-200/40 blur-3xl dark:from-primary-500/10 dark:to-transparent" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/30 px-4 py-1.5 text-sm font-medium text-primary-700 backdrop-blur-[24px] saturate-180 shadow-lg shadow-black/5 dark:bg-ink-900/70 dark:text-primary-300 dark:shadow-black/30">
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

          <div className="mx-auto mt-8 max-w-md">
            <SearchBox />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm text-ink-500 dark:text-ink-400">
            <span>Try:</span>
            {['CGPA', 'attendance', 'compress PDF', 'JSON'].map((term) => (
              <span
                key={term}
                className="rounded-full border border-white/30 bg-white/30 px-3 py-1 text-xs backdrop-blur-[24px] saturate-180 shadow-lg shadow-black/5 dark:border-white/10 dark:bg-ink-900/70 dark:shadow-black/30"
              >
                {term}
              </span>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-600/25 transition-all duration-300 hover:bg-primary-500 hover:scale-[1.03] active:scale-[0.98] dark:bg-primary-500 dark:hover:bg-primary-400 sm:px-7 sm:py-3 sm:text-base"
            >
              Explore All Tools
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="py-12 sm:py-16 overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-medium text-ink-950 dark:text-ink-50">Most‑used tools</h2>
          <Link href="/tools" className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:underline dark:text-primary-400">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {/* Removed overflow-hidden so shadows aren't clipped */}
        <div className="relative w-full overflow-visible py-4 -my-4">
          <div className="marquee-track gap-4 pl-0">
            {marqueeItems.map((tool, i) => (
              <Link
                key={`${tool!.slug}-${i}`}
                href={`/tools/${tool!.slug}`}
                className="tool-card"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/30 text-primary-600 backdrop-blur-[24px] saturate-180 dark:bg-primary-900/30 dark:text-primary-300">
                  {FEATURED_ICONS[tool!.slug] || <Calculator size={28} />}
                </span>
                <span className="px-2 text-center text-xs font-medium leading-tight text-ink-800 dark:text-ink-200 sm:text-sm">
                  {tool!.shortTitle || tool!.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <AdSlot position="homepage" className="mb-14" />
      </div>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <h2 className="font-display text-2xl font-medium text-ink-950 dark:text-ink-50">Browse by category</h2>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {categoryIds.map((id) => {
            const tools = getToolsByCategory(id).filter((t) => t.implemented);
            if (tools.length === 0) return null;
            const cat = CATEGORIES[id];
            return (
              <Link
                key={id}
                href={`/category/${id}`}
                className="group rounded-2xl border border-white/30 bg-white/30 p-5 shadow-lg shadow-black/5 backdrop-blur-[24px] saturate-180 transition-all duration-300 hover:border-white/50 hover:bg-white/50 hover:shadow-xl dark:border-white/10 dark:bg-ink-900/70 dark:shadow-black/30 dark:hover:border-white/20 dark:hover:bg-ink-900/80 dark:hover:shadow-lg"
              >
                <h3 className="font-display text-lg font-semibold text-ink-950 group-hover:text-primary-700 dark:text-ink-50 dark:group-hover:text-primary-300">
                  {cat.name}
                </h3>
                <p className="mt-1 text-sm text-ink-600 dark:text-ink-400">{cat.description}</p>
                <p className="mt-3 text-xs font-medium text-primary-600 dark:text-primary-400">
                  {tools.length} tools →
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
