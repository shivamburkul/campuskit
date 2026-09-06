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
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-medium text-ink-950">All tools</h1>
      <p className="mt-2 text-ink-700">{TOOLS.filter((t) => t.implemented).length} tools live today, more shipping regularly.</p>
      <div className="mt-6">
        <AllToolsClient tools={TOOLS} categoryIds={categoryIds} />
      </div>
    </div>
  );
}
