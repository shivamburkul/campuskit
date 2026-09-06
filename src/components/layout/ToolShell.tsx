import { ReactNode } from 'react';
import Link from 'next/link';
import { ToolMeta, CATEGORIES, getToolsByCategory } from '@/config/registry';
import { AdSlot } from './AdSlot';
import { ArrowRight } from 'lucide-react';

export function ToolShell({
  tool,
  children,
  faq,
}: {
  tool: ToolMeta;
  children: ReactNode;
  faq?: { question: string; answer: string }[];
}) {
  const category = CATEGORIES[tool.category];
  const related = getToolsByCategory(tool.category)
    .filter((t) => t.implemented && t.slug !== tool.slug)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-paper dark:bg-paper">
      <div className="mx-auto flex max-w-[1400px] justify-center gap-8 px-4 py-10 sm:px-6">
        <aside className="sticky top-20 hidden h-fit w-[300px] shrink-0 2xl:block">
          <AdSlot position="side-rail" className="min-h-[600px]" />
        </aside>

        <div className="w-full max-w-3xl">
          <nav className="mb-6 text-sm text-ink-500 dark:text-ink-400">
            <Link href="/" className="hover:text-ink-900 dark:hover:text-ink-50">
              CampusKit
            </Link>
            <span className="mx-2">/</span>
            <Link href={`/category/${tool.category}`} className="hover:text-ink-900 dark:hover:text-ink-50">
              {category.name}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink-700 dark:text-ink-300">{tool.shortTitle}</span>
          </nav>

          <header className="mb-8">
            <h1 className="font-display text-3xl font-medium text-ink-950 dark:text-ink-50 sm:text-4xl">{tool.title}</h1>
            <p className="mt-2 max-w-prose text-ink-700 dark:text-ink-300">{tool.description}</p>
          </header>

          <AdSlot position="tool-top" className="mb-8" />

          <section className="rounded-xl border border-ink-100/60 bg-surface p-5 shadow-card sm:p-7 dark:border-ink-700 dark:bg-ink-900">
            {children}
          </section>

          {tool.longDescription && (
            <section className="mt-10">
              <h2 className="font-display text-xl font-medium text-ink-950 dark:text-ink-50">About this tool</h2>
              <div className="mt-3 text-ink-700 dark:text-ink-300 space-y-4">
                {tool.longDescription.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </section>
          )}

          <AdSlot position="tool-result" className="mt-10" />

          {related.length > 0 && (
            <section className="mt-10">
              <h2 className="font-display text-xl font-medium text-ink-950 dark:text-ink-50">Related tools</h2>
              <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/tools/${r.slug}`}
                      className="flex items-center justify-between rounded-xl border border-ink-100/60 px-4 py-3 text-sm text-ink-800 transition-colors hover:border-primary-300 hover:bg-primary-50/30 dark:border-ink-700 dark:text-ink-300 dark:hover:border-primary-700/40 dark:hover:bg-ink-800/50"
                    >
                      {r.title}
                      <ArrowRight size={14} className="text-ink-400 dark:text-ink-500" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {faq && faq.length > 0 && (
            <section className="mt-10">
              <h2 className="font-display text-xl font-medium text-ink-950 dark:text-ink-50">Frequently asked questions</h2>
              <dl className="mt-4 space-y-5">
                {faq.map((item) => (
                  <div key={item.question}>
                    <dt className="font-medium text-ink-900 dark:text-ink-200">{item.question}</dt>
                    <dd className="mt-1 text-sm text-ink-700 dark:text-ink-300">{item.answer}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </div>

        <aside className="sticky top-20 hidden h-fit w-[300px] shrink-0 2xl:block">
          <AdSlot position="side-rail" className="min-h-[600px]" />
        </aside>
      </div>
    </div>
  );
}