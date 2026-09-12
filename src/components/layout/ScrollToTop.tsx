'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Forces every route change (including browser back/forward) to land at the
 * top of the new page, instead of the browser/Next.js restoring whatever
 * scroll position that page was at last time it was visited.
 *
 * Without this, going back to a page you'd scrolled down on shows a visible
 * "lands at top, then jumps/animates down to where you were" flash — this
 * disables that restoration entirely so navigation is always instant and
 * always starts at the top, on every device.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  // Take manual control of scroll restoration as early as possible so the
  // browser doesn't try to restore a previous position on back/forward.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // On every route change, snap to the top instantly (no animation) — this
  // covers forward navigation, back navigation, and everything in between.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
