import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CATEGORIES, CategoryId, getToolsByCategory } from '@/config/registry';
import { AdSlot } from '@/components/layout/AdSlot';

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
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-3xl font-medium text-ink-950 dark:text-ink-50">{category.name}</h1>
        <p className="mt-2 text-ink-700 dark:text-ink-300">{category.description}</p>

        <AdSlot position="category" className="my-8" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {implemented.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="rounded-lg border border-ink-100 bg-surface p-5 shadow-sm transition-colors hover:border-moss-400 dark:border-ink-700 dark:bg-ink-100 dark:hover:border-moss-600"
            >
              <h2 className="font-display text-lg font-medium text-ink-950 dark:text-ink-50">{tool.title}</h2>
              <p className="mt-1.5 text-sm text-ink-700 dark:text-ink-300">{tool.description}</p>
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
                  className="rounded-full border border-dashed border-ink-100 px-3 py-1 text-xs text-ink-500 dark:border-ink-700 dark:text-ink-400"
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