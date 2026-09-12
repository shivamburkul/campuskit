import type { Metadata } from 'next';
import { CATEGORIES, CategoryId, TOOLS } from '@/config/registry';
import { AllToolsClient } from './all-tools-client';

export const metadata: Metadata = {
  title: 'All tools',
  description: 'Every free tool on CampusKit, organized by category.',
  alternates: { canonical: '/tools' },
};

export default function AllToolsPage() {
  const categoryIds = Object.keys(CATEGORIES) as CategoryId[];
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-12 overflow-hidden">
      <h1 className="font-display text-2xl font-medium text-ink-950 dark:text-ink-50 sm:text-3xl">All tools</h1>
      <p className="mt-1 mb-4 text-sm text-ink-700 dark:text-ink-300 sm:mt-2 sm:mb-6 sm:text-base">
        {TOOLS.filter((t) => t.implemented).length} tools live today, more shipping regularly.
      </p>
      <div className="w-full">
        <AllToolsClient tools={TOOLS} categoryIds={categoryIds} />
      </div>
    </div>
  );
}
