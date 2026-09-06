'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

const STORAGE_KEY = 'campuskit-consent';

/**
 * Basic consent banner for analytics cookies.
 * NOT a Google-certified CMP / IAB TCF implementation.
 */
export function ConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setShow(true);
    }
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setShow(false);
    window.dispatchEvent(new Event('campuskit-consent-change'));
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, 'declined');
    setShow(false);
    window.dispatchEvent(new Event('campuskit-consent-change'));
  }

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-ink-200 bg-surface p-4 shadow-lg dark:border-ink-700 dark:bg-ink-900"
    >
      <div className="mx-auto flex max-w-4xl flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-700 dark:text-ink-300">
          We use optional analytics cookies to understand how CampusKit is used. Advertising cookies are only used if
          ads are enabled on this deployment. See our{' '}
          <a href="/privacy" className="underline text-primary-600 dark:text-primary-400">
            Privacy Policy
          </a>{' '}
          and{' '}
          <a href="/cookies" className="underline text-primary-600 dark:text-primary-400">
            Cookie Policy
          </a>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <Button variant="secondary" type="button" onClick={decline}>
            Decline
          </Button>
          <Button variant="primary" type="button" onClick={accept}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}