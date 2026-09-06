'use client';
import Script from 'next/script';
import { useEffect, useState } from 'react';

const CONSENT_KEY = 'campuskit-consent';

export function Analytics() {
  const [consent, setConsent] = useState<'accepted' | 'declined' | null>(null);

  useEffect(() => {
    function read() {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (stored === 'accepted' || stored === 'declined') {
        setConsent(stored);
      }
    }
    read();
    window.addEventListener('campuskit-consent-change', read);
    return () => window.removeEventListener('campuskit-consent-change', read);
  }, []);

  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (!measurementId || consent !== 'accepted') return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}