import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface ArticleContent {
  title: string;
  description: string;
  date: string;
  content: string[]; // Each item is a paragraph
  tools: { name: string; slug: string }[];
}

const articles: Record<string, ArticleContent> = {
  'cgpa-gpa-guide': {
    title: 'The Ultimate Guide to CGPA & GPA for Students',
    description: 'Understand how CGPA and GPA are calculated, why they matter, and how to use CampusKit to track your academic progress.',
    date: 'September 10, 2026',
    content: [
      'Your CGPA (Cumulative Grade Point Average) is one of the most important numbers in your academic life. It determines your eligibility for scholarships, higher education, and even job opportunities. But many students don\'t fully understand how it is calculated.',
      'In this guide, we\'ll break down the concept of CGPA and GPA, explain the standard calculation methods, and show you how you can use CampusKit to track your progress accurately.',
      'CGPA is typically calculated by weighting the grade points of each subject or semester by the credits they carry. The CampusKit CGPA Calculator allows you to enter the SGPA (Semester GPA) and credits for each semester, and it does the rest for you. This is especially helpful for planning which semesters you need to focus on.',
    ],
    tools: [
      { name: 'CGPA Calculator', slug: 'cgpa-calculator' },
      { name: 'GPA Calculator', slug: 'gpa-calculator' },
      { name: 'Target GPA Calculator', slug: 'target-gpa-calculator' },
    ],
  },
  'fix-attendance-shortage': {
    title: 'How to Fix Your Attendance Shortage (Step-by-Step)',
    description: 'Are you below the minimum attendance? This guide shows you exactly how many classes you need to attend and what you can safely miss.',
    date: 'September 10, 2026',
    content: [
      'Attendance requirements are a common source of stress for students. If your attendance falls below the minimum (usually 75%), you might be barred from exams. But you can plan your way out of this situation.',
      'The first step is to know exactly where you stand. Use the Attendance Percentage Calculator to calculate your current percentage. Then, use the Classes Needed for Target Attendance tool to find out how many classes you need to attend consecutively to get back to safety.',
      'If you\'re planning to skip a few classes, the Classes You Can Miss tool will show you your limit. This way, you can manage your schedule with confidence instead of guessing.',
    ],
    tools: [
      { name: 'Attendance Percentage Calculator', slug: 'attendance-calculator' },
      { name: 'Classes Needed for Target Attendance', slug: 'attendance-classes-needed' },
      { name: 'Classes You Can Miss', slug: 'attendance-classes-can-miss' },
    ],
  },
  'student-finance-tools': {
    title: '5 Student Finance Tools You Need Before Your First Job',
    description: 'From EMI calculators to interest calculators, these tools will help you make smart financial decisions as a student.',
    date: 'September 10, 2026',
    content: [
      'Managing money is a crucial skill that many students learn the hard way. Before you take out your first loan, use an EMI Calculator to understand your monthly payments. This will help you budget accurately and avoid financial strain.',
      'For long-term savings, a Compound Interest Calculator is invaluable. It shows you how your money can grow over time, which is the first step toward building wealth. Even simple things like splitting a bill with friends become effortless with the Expense Splitter.',
      'CampusKit gives you all these tools for free, so you can make informed decisions without any barriers.',
    ],
    tools: [
      { name: 'EMI Calculator', slug: 'emi-calculator' },
      { name: 'Compound Interest Calculator', slug: 'compound-interest-calculator' },
      { name: 'Expense Splitter', slug: 'expense-splitter' },
    ],
  },
  'text-tools-guide': {
    title: 'The Complete Guide to Text Tools for Writers & Students',
    description: 'From word counting to cleaning messy text, this guide covers every text tool on CampusKit that will save you hours of manual work.',
    date: 'September 10, 2026',
    content: [
      'Writing essays, articles, or assignments often involves tedious formatting tasks. Our text tools are designed to eliminate this friction entirely.',
      'The Word Counter gives you instant feedback on your word and character counts, ensuring your work meets length requirements. It also estimates reading and speaking time, which is invaluable for presentations.',
      'If you are pasting text from websites or PDFs, the Text Cleaner tool is essential. It collapses extra spaces, removes duplicate lines, sorts lines alphabetically, and cleans up messy formatting in a single click. This is a huge time-saver for students compiling research notes.',
      'For anyone editing large documents, the Find and Replace tool supports regular expressions, letting you make bulk edits quickly. The Text Diff tool is perfect for comparing two versions of an essay or code to see exactly what changed.',
    ],
    tools: [
      { name: 'Word Counter', slug: 'word-counter' },
      { name: 'Text Cleaner', slug: 'text-cleaner' },
      { name: 'Find and Replace', slug: 'find-and-replace' },
      { name: 'Text Diff', slug: 'text-diff' },
    ],
  },
  'developer-tools-guide': {
    title: 'Every Developer Tool You Need in One Place',
    description: 'JSON formatting, Base64 encoding, UUID generation, JWT decoding and more — this guide shows you how to use every developer utility on CampusKit.',
    date: 'September 10, 2026',
    content: [
      'Developers often juggle multiple small utilities for daily tasks. CampusKit provides all of them in one simple, free platform.',
      'The JSON Formatter is perfect for debugging APIs and making config files readable. It also includes a minifier to compress JSON for production.',
      'Base64 encoding and decoding is essential for working with file uploads and data transmission. Our tool handles both directions instantly.',
      'UUID generation is a must-have for database records. JWT decoding helps you understand authentication tokens without needing a server. Timestamp conversion makes dealing with epoch time effortless.',
    ],
    tools: [
      { name: 'JSON Formatter', slug: 'json-formatter' },
      { name: 'Base64 Tool', slug: 'base64-tool' },
      { name: 'UUID Generator', slug: 'uuid-generator' },
      { name: 'JWT Decoder', slug: 'jwt-decoder' },
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = articles[slug];
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
  };
}

export function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }));
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles[slug];
  if (!article) notFound();

  return (
    <div className="mx-auto max-w-prose px-4 py-12 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-wide text-moss-600">{article.date}</p>
      <h1 className="mt-2 font-display text-3xl font-medium text-ink-950">{article.title}</h1>
      <p className="mt-2 text-lg text-ink-700">{article.description}</p>

      <div className="mt-8 space-y-5 text-ink-800">
        {article.content.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {article.tools.length > 0 && (
        <div className="mt-8 rounded-xl border border-moss-100 bg-moss-100/40 p-6">
          <h2 className="font-display text-lg font-medium text-ink-950">Tools mentioned in this guide</h2>
          <ul className="mt-3 space-y-2">
            {article.tools.map((tool) => (
              <li key={tool.slug}>
                <Link href={`/tools/${tool.slug}`} className="text-moss-600 underline">
                  {tool.name} →
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-10 border-t border-ink-100 pt-6">
        <Link href="/blog" className="text-sm font-medium text-moss-600 hover:underline">
          ← Back to all guides
        </Link>
      </div>
    </div>
  );
}