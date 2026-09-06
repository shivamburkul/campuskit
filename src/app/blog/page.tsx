import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'CampusKit Guides & Tutorials',
  description: 'Practical guides and tutorials for students to make the most of CampusKit tools.',
  alternates: { canonical: '/blog' },
};

const articles = [
  {
    slug: 'cgpa-gpa-guide',
    title: 'The Ultimate Guide to CGPA & GPA for Students',
    description: 'Understand how CGPA and GPA are calculated, why they matter, and how to use CampusKit to track your academic progress.',
    date: 'September 10, 2026',
  },
  {
    slug: 'fix-attendance-shortage',
    title: 'How to Fix Your Attendance Shortage (Step-by-Step)',
    description: 'Are you below the minimum attendance? This guide shows you exactly how many classes you need to attend and what you can safely miss.',
    date: 'September 10, 2026',
  },
  {
    slug: 'student-finance-tools',
    title: '5 Student Finance Tools You Need Before Your First Job',
    description: 'From EMI calculators to interest calculators, these tools will help you make smart financial decisions as a student.',
    date: 'September 10, 2026',
  },
  {
    slug: 'text-tools-guide',
    title: 'The Complete Guide to Text Tools for Writers & Students',
    description: 'From word counting to cleaning messy text, this guide covers every text tool on CampusKit that will save you hours of manual work.',
    date: 'September 10, 2026',
  },
  {
    slug: 'developer-tools-guide',
    title: 'Every Developer Tool You Need in One Place',
    description: 'JSON formatting, Base64 encoding, UUID generation, JWT decoding and more — this guide shows you how to use every developer utility on CampusKit.',
    date: 'September 10, 2026',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-paper dark:bg-paper">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-3xl font-medium text-ink-950 dark:text-ink-50">CampusKit Guides</h1>
        <p className="mt-2 text-ink-700 dark:text-ink-300">
          Practical, step-by-step guides to help you get the most out of every CampusKit tool.
        </p>

        <div className="mt-8 space-y-6">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="block rounded-xl border border-ink-100 bg-surface p-6 shadow-card transition-all hover:border-moss-400 hover:shadow-card-hover dark:border-ink-700 dark:bg-ink-100 dark:hover:border-moss-600 dark:hover:shadow-lg"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-moss-600 dark:text-moss-400">{article.date}</p>
              <h2 className="mt-2 font-display text-xl font-semibold text-ink-950 dark:text-ink-50">{article.title}</h2>
              <p className="mt-2 text-sm text-ink-700 dark:text-ink-300">{article.description}</p>
              <span className="mt-3 inline-block text-sm font-medium text-moss-600 dark:text-moss-400">Read more →</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}