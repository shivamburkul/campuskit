import type { ComponentType } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getToolBySlug } from '@/config/registry';
import { TOOL_FAQ, DEFAULT_FAQ } from '@/config/faq';
import { ToolShell } from '@/components/layout/ToolShell';

/**
 * Every tool gets its own literal directory under src/app/tools/<slug>/,
 * each statically importing only its own component (see any page.tsx
 * there for the pattern). This is deliberate: a single dynamic
 * `[slug]/page.tsx` serving all tools was tried first and measured to bundle
 * every tool's code (including pdf-lib) into one shared ~200KB client
 * chunk loaded on every tool page, because Next.js's App Router gives one
 * dynamic route pattern one client bundle regardless of the resolved param.
 * Separate literal routes get separate, minimal, properly code-split
 * bundles — confirmed in the production build output. This factory just
 * removes the boilerplate that's identical across all of them.
 */

export function buildToolMetadata(slug: string): Metadata {
  const tool = getToolBySlug(slug);
  if (!tool || !tool.implemented) return {};
  return {
    title: tool.title,
    description: tool.description,
    keywords: tool.keywords,
    alternates: { canonical: `/tools/${tool.slug}` },
    openGraph: { title: tool.title, description: tool.description },
  };
}

export function ToolPageBody({ slug, Component }: { slug: string; Component: ComponentType }) {
  const tool = getToolBySlug(slug);
  if (!tool || !tool.implemented) notFound();

  const faq = TOOL_FAQ[tool.slug] ?? DEFAULT_FAQ;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolShell tool={tool} faq={faq}>
        <Component />
      </ToolShell>
    </>
  );
}
