import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { GraduationCap } from 'lucide-react';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-ink-100/40 bg-surface/80 backdrop-blur-md shadow-sm dark:border-ink-700/40 dark:bg-ink-900/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-violet-600 text-white shadow-md shadow-primary-500/20 transition-transform group-hover:scale-105">
            <GraduationCap size={20} strokeWidth={2.5} />
          </div>
          <span className="font-display text-xl font-semibold text-ink-950 dark:text-ink-50">
            Campus<span className="text-primary-600">Kit</span>
          </span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/blog"
            className="rounded-full bg-ink-100/60 px-4 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-200/70 hover:text-ink-950 dark:bg-ink-800/60 dark:text-ink-300 dark:hover:bg-ink-700/70 dark:hover:text-ink-50"
          >
            Guides
          </Link>
          <Link
            href="/about"
            className="rounded-full bg-ink-100/60 px-4 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-200/70 hover:text-ink-950 dark:bg-ink-800/60 dark:text-ink-300 dark:hover:bg-ink-700/70 dark:hover:text-ink-50"
          >
            About
          </Link>
          <Link
            href="/tools"
            className="rounded-full bg-ink-100/60 px-4 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-200/70 hover:text-ink-950 dark:bg-ink-800/60 dark:text-ink-300 dark:hover:bg-ink-700/70 dark:hover:text-ink-50"
          >
            All Tools
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}