'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { MouseEvent } from 'react';

interface Crumb {
  label: string;
  href: string;
}

/**
 * A link that replaces the current history entry instead of pushing a new
 * one. Breadcrumbs represent "go up a level" — if every breadcrumb click
 * pushed a fresh history entry, hopping between a few tools and their shared
 * "All Tools" parent would stack up multiple redundant entries, so the
 * physical browser back button would take several presses to actually leave
 * the tools section (or land on a stale, previously-visited tool instead of
 * the landing page). Replacing keeps the back stack matching the logical
 * hierarchy: Tool -> All Tools -> Landing, no matter how many different
 * tools or categories were visited via breadcrumbs along the way.
 */
function BreadcrumbLink({ href, children }: { href: string; children: React.ReactNode }) {
  const router = useRouter();

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    // Let modifier-key clicks (open in new tab, etc.) behave normally.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    router.replace(href);
  }

  return (
    <Link href={href} onClick={handleClick} className="hover:text-ink-900 dark:hover:text-ink-50">
      {children}
    </Link>
  );
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="mb-4 text-xs text-ink-500 dark:text-ink-400 sm:text-sm">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={item.href}>
            {isLast ? (
              <span className="text-ink-700 dark:text-ink-300 truncate">{item.label}</span>
            ) : (
              <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
            )}
            {!isLast && <span className="mx-2">/</span>}
          </span>
        );
      })}
    </nav>
  );
}
