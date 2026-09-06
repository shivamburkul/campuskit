'use client';
import { useEffect } from 'react';

/**
 * Registers the hand-written service worker (public/sw.js) in production
 * only. Registering in development interferes with Fast Refresh and can
 * serve stale cached bundles while iterating.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Non-fatal: the site works fully without the service worker, it
        // just loses offline/installable behavior.
      });
    });
  }, []);

  return null;
}
