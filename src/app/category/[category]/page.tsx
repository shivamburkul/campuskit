import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CATEGORIES, CategoryId, getToolsByCategory } from '@/config/registry';
import { AdSlot } from '@/components/layout/AdSlot';
import { Breadcrumb } from '@/components/layout/Breadcrumb';

type Params = { category: string };

export function generateStaticParams() {
  return Object.keys(CATEGORIES).map((category) => ({ category }));
}

function isCategoryId(value: string): value is CategoryId {
  return value in CATEGORIES;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { category } = await params;
  if (!isCategoryId(category)) return {};
  const meta = CATEGORIES[category];
  return { title: meta.name, description: meta.description, alternates: { canonical: `/category/${category}` } };
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { category: categoryParam } = await params;
  if (!isCategoryId(categoryParam)) notFound();
  const category = CATEGORIES[categoryParam];
  const tools = getToolsByCategory(categoryParam);
  const implemented = tools.filter((t) => t.implemented);
  const comingSoon = tools.filter((t) => !t.implemented);

  return (
    <div className="min-h-screen bg-paper dark:bg-paper">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <Breadcrumb
          items={[
            { label: 'All Tools', href: '/tools' },
            { label: category.name, href: `/category/${categoryParam}` },
          ]}
        />
        <h1 className="font-display text-2xl font-medium text-ink-950 dark:text-ink-50 sm:text-3xl">{category.name}</h1>
        <p className="mt-2 mb-8 text-sm text-ink-700 dark:text-ink-300 sm:text-base">{category.description}</p>

        <AdSlot position="category" className="my-6 sm:my-8" />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {implemented.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="rounded-lg border border-white/30 bg-white/30 p-4 shadow-lg shadow-black/5 backdrop-blur-[24px] saturate-180 transition-colors hover:border-white/50 hover:bg-white/50 dark:border-white/10 dark:bg-ink-900/70 dark:shadow-black/30 dark:hover:border-white/20 dark:hover:bg-ink-900/80 sm:p-5"
            >
              <h2 className="font-display text-base font-medium text-ink-950 dark:text-ink-50 sm:text-lg">{tool.title}</h2>
              <p className="mt-1 text-xs text-ink-700 dark:text-ink-300 sm:text-sm">{tool.description}</p>
            </Link>
          ))}
        </div>

        {comingSoon.length > 0 && (
          <div className="mt-10">
            <h2 className="text-sm font-medium uppercase tracking-wide text-ink-500 dark:text-ink-400">Coming soon</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {comingSoon.map((tool) => (
                <li
                  key={tool.slug}
                  className="rounded-full border border-dashed border-white/30 bg-white/30 px-3 py-1 text-xs text-ink-500 backdrop-blur-[24px] saturate-180 dark:border-white/10 dark:bg-ink-900/70 dark:text-ink-400"
                >
                  {tool.shortTitle}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
