import { ReactNode } from 'react';
import Link from 'next/link';
import { ToolMeta, CATEGORIES, getToolsByCategory } from '@/config/registry';
import { AdSlot } from './AdSlot';
import { Breadcrumb } from './Breadcrumb';
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
    <div className="min-h-screen bg-paper dark:bg-paper overflow-x-hidden">
      <div className="mx-auto flex max-w-[1400px] justify-center gap-8 px-4 py-6 sm:px-6 sm:py-10">
        <aside className="sticky top-20 hidden h-fit w-[300px] shrink-0 2xl:block">
          <AdSlot position="side-rail" className="min-h-[600px]" />
        </aside>

        <div className="w-full max-w-3xl min-w-0">
          <Breadcrumb
            items={[
              { label: 'All Tools', href: '/tools' },
              { label: category.name, href: `/category/${tool.category}` },
              { label: tool.shortTitle || tool.title, href: `/tools/${tool.slug}` },
            ]}
          />

          <header className="mb-6 sm:mb-8">
            <h1 className="font-display text-2xl font-medium text-ink-950 dark:text-ink-50 sm:text-3xl sm:text-4xl">{tool.title}</h1>
            <p className="mt-1 max-w-prose text-sm text-ink-700 dark:text-ink-300 sm:text-base">{tool.description}</p>
          </header>

          <AdSlot position="tool-top" className="mb-6 sm:mb-8" />

          <section className="rounded-xl border border-white/30 bg-white/30 p-4 shadow-lg shadow-black/5 backdrop-blur-[24px] saturate-180 sm:p-5 sm:p-7 dark:border-white/10 dark:bg-ink-900/70 dark:shadow-black/30 overflow-x-auto">
            {children}
          </section>

          {tool.longDescription && (
            <section className="mt-8 sm:mt-10">
              <h2 className="font-display text-lg font-medium text-ink-950 dark:text-ink-50 sm:text-xl">About this tool</h2>
              <div className="mt-2 rounded-xl border border-white/30 bg-white/30 p-5 text-sm text-ink-700 backdrop-blur-[24px] saturate-180 shadow-lg shadow-black/5 dark:border-white/10 dark:bg-ink-900/70 dark:text-ink-300 dark:shadow-black/30 sm:mt-3 sm:p-6 sm:text-base space-y-3 sm:space-y-4">
                {tool.longDescription.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </section>
          )}

          <AdSlot position="tool-result" className="mt-8 sm:mt-10" />

          {related.length > 0 && (
            <section className="mt-8 sm:mt-10">
              <h2 className="font-display text-lg font-medium text-ink-950 dark:text-ink-50 sm:text-xl">Related tools</h2>
              <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:mt-4">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/tools/${r.slug}`}
                      className="flex items-center justify-between rounded-xl border border-white/30 bg-white/30 px-3 py-2.5 text-sm text-ink-800 backdrop-blur-[24px] saturate-180 shadow-lg shadow-black/5 transition-colors hover:border-white/50 hover:bg-white/50 dark:border-white/10 dark:bg-ink-900/70 dark:text-ink-300 dark:shadow-black/30 dark:hover:border-white/20 dark:hover:bg-ink-900/80 sm:px-4 sm:py-3"
                    >
                      <span className="truncate">{r.title}</span>
                      <ArrowRight size={14} className="text-ink-400 dark:text-ink-500 shrink-0 ml-2" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {faq && faq.length > 0 && (
            <section className="mt-8 sm:mt-10">
              <h2 className="font-display text-lg font-medium text-ink-950 dark:text-ink-50 sm:text-xl">Frequently asked questions</h2>
              <dl className="mt-3 space-y-4 sm:mt-4 sm:space-y-5">
                {faq.map((item) => (
                  <div key={item.question} className="rounded-xl border border-white/30 bg-white/30 p-5 backdrop-blur-[24px] saturate-180 shadow-lg shadow-black/5 dark:border-white/10 dark:bg-ink-900/70 dark:shadow-black/30">
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
