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
  {
    slug: 'sgpa-guide',
    title: 'SGPA vs CGPA: What\'s the Difference and How to Calculate Both',
    description: 'SGPA measures a single semester, CGPA measures your whole degree so far. Here\'s how each is calculated and when to use which.',
    date: 'September 12, 2026',
  },
  {
    slug: 'exam-score-guide',
    title: 'How Negative Marking Actually Affects Your Exam Score',
    description: 'A wrong answer doesn\'t just cost you a mark — it costs you the mark you would have gained, twice over. Here\'s the math behind negative marking.',
    date: 'September 12, 2026',
  },
  {
    slug: 'study-planner-guide',
    title: 'Building a Study Schedule That Survives Contact With Reality',
    description: 'Most study plans fall apart by day three. Here\'s how to build one around your actual available hours instead of your ideal ones.',
    date: 'September 12, 2026',
  },
  {
    slug: 'budget-guide',
    title: 'A Simple Monthly Budget System for Students',
    description: 'You don\'t need a finance degree to budget well — just a clear split between needs, wants, and savings, and a way to track it.',
    date: 'September 12, 2026',
  },
  {
    slug: 'regex-guide',
    title: 'Regular Expressions for People Who Keep Forgetting the Syntax',
    description: 'A practical, example-first look at the regex patterns you\'ll actually use, and how to test them safely before running them on real data.',
    date: 'September 12, 2026',
  },
  {
    slug: 'matrix-guide',
    title: 'Matrix Operations Explained: Determinant, Inverse, and Why They Matter',
    description: 'What a determinant actually tells you, when a matrix has no inverse, and how these ideas show up in real engineering and computer science problems.',
    date: 'September 12, 2026',
  },
  {
    slug: 'permutation-combination-guide',
    title: 'Permutations vs Combinations: How to Tell Them Apart Instantly',
    description: 'The one question that resolves every permutation-vs-combination confusion: does order matter here?',
    date: 'September 12, 2026',
  },
  {
    slug: 'scientific-calculator-guide',
    title: 'Getting the Most Out of a Scientific Calculator (Beyond the Basics)',
    description: 'DEG vs RAD, memory keys, and why your calculator gives a different answer than your friend\'s — a practical walkthrough.',
    date: 'September 12, 2026',
  },
  {
    slug: 'time-zone-guide',
    title: 'Why Time Zone Math Is Harder Than It Looks',
    description: 'Daylight saving, half-hour offsets, and the date line all conspire to make "just add the hours" wrong. Here\'s what actually works.',
    date: 'September 12, 2026',
  },
  {
    slug: 'gst-guide',
    title: 'GST Explained: Inclusive vs Exclusive Pricing',
    description: 'The same 18% GST rate gives two different base prices depending on whether it\'s already included in the sticker price. Here\'s the formula for both.',
    date: 'September 12, 2026',
  },
  {
    slug: 'academic-progress-guide',
    title: 'How to Tell If You\'re Actually on Track for Your Target GPA',
    description: 'Raw GPA tells you where you\'ve been. This guide covers how to calculate where you need to go from here.',
    date: 'September 12, 2026',
  },
  {
    slug: 'hash-generator-guide',
    title: 'MD5 vs SHA-256: What Hashing Is Actually For',
    description: 'Hashing isn\'t encryption, and not all hash functions are safe for the same job. Here\'s when to reach for which one.',
    date: 'September 12, 2026',
  },
  {
    slug: 'image-cropper-guide',
    title: 'Cropping and Editing Images Without Losing Quality',
    description: 'The most common way people accidentally ruin a photo while "just cropping it" — and how to avoid it.',
    date: 'September 12, 2026',
  },
  {
    slug: 'case-converter-guide',
    title: 'camelCase, snake_case, kebab-case: A Field Guide',
    description: 'Every naming convention you\'ll run into as a developer, what it\'s used for, and how to convert between them instantly.',
    date: 'September 12, 2026',
  },
  {
    slug: 'compress-pdf-guide',
    title: 'Why Some PDFs Compress 90% and Others Barely Shrink at All',
    description: 'PDF compression depends entirely on what\'s inside the file. Here\'s how to tell which kind of PDF you have before you try.',
    date: 'September 12, 2026',
  },
  {
    slug: 'study-session-tracker-guide',
    title: 'Why Tracking Study Time Beats Tracking Study Plans',
    description: 'A plan tells you what you intended to do. A tracked log tells you what you actually did — and that gap is where real improvement happens.',
    date: 'September 12, 2026',
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
              className="block rounded-xl border border-white/30 bg-white/30 p-6 shadow-lg shadow-black/5 backdrop-blur-[24px] saturate-180 transition-all hover:border-white/50 hover:bg-white/50 hover:shadow-xl dark:border-white/10 dark:bg-ink-900/70 dark:shadow-black/30 dark:hover:border-white/20 dark:hover:bg-ink-900/80 dark:hover:shadow-lg"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-primary-600 dark:text-primary-400">{article.date}</p>
              <h2 className="mt-2 font-display text-xl font-semibold text-ink-950 dark:text-ink-50">{article.title}</h2>
              <p className="mt-2 text-sm text-ink-700 dark:text-ink-300">{article.description}</p>
              <span className="mt-3 inline-block text-sm font-medium text-primary-600 dark:text-primary-400">Read more →</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
