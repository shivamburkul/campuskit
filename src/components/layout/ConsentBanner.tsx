'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

const STORAGE_KEY = 'campuskit-consent';

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
      className="fixed bottom-3 left-1/2 z-50 -translate-x-1/2 transition-all duration-500 ease-out sm:bottom-4"
      style={{ width: 'min(94%, 56rem)' }}
    >
      <div
        className="flex flex-col items-center gap-2 rounded-2xl border px-4 py-3 shadow-lg sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:rounded-full sm:px-6 sm:py-3.5 backdrop-blur-[24px] saturate-180"
        style={{
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          backdropFilter: 'blur(24px) saturate(180%)',
        }}
      >
        <p className="text-center text-[11px] leading-relaxed text-ink-700 dark:text-ink-300 sm:text-left sm:text-sm">
          We use optional analytics cookies to understand how CampusKit is used.
          <span className="hidden sm:inline"> </span>
          <br className="sm:hidden" />
          See our{' '}
          <a href="/privacy" className="whitespace-nowrap text-primary-600 underline hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
            Privacy Policy
          </a>{' '}
          and{' '}
          <a href="/cookies" className="whitespace-nowrap text-primary-600 underline hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
            Cookie Policy
          </a>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <Button variant="secondary" type="button" onClick={decline} className="px-3 py-1 text-[10px] sm:px-5 sm:py-2 sm:text-sm">
            Decline
          </Button>
          <Button variant="primary" type="button" onClick={accept} className="px-3 py-1 text-[10px] sm:px-5 sm:py-2 sm:text-sm">
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
