import { LEGAL_LAST_UPDATED } from '@/config/site';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Cookie Policy' };

export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-prose px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-medium text-ink-950">Cookie Policy</h1>
      <p className="mt-2 text-sm text-ink-500">Last updated: {LEGAL_LAST_UPDATED}</p>
      <div className="mt-8 space-y-5 text-ink-800">
        <p>
          By default, CampusKit does not set analytics or advertising cookies. These are disabled until explicitly
          configured. This policy explains what cookies we may use if you enable these features.
        </p>
        <h2 className="font-display text-xl font-medium text-ink-950">What are Cookies?</h2>
        <p>
          Cookies are small text files placed on your device by websites you visit. They are widely used to make
          websites work more efficiently and to provide information to the owners of the site.
        </p>
        <h2 className="font-display text-xl font-medium text-ink-950">Categories of Cookies We May Use</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li><strong>Strictly Necessary:</strong> None required for core tool functionality.</li>
          <li>
            <strong>Analytics (Optional):</strong> If enabled, Google Analytics may set cookies to measure aggregate
            usage. These are not set unless you enable them via our configuration.
          </li>
          <li>
            <strong>Advertising (Optional):</strong> If enabled, ad-network cookies may be set to serve and measure ads.
            These are not set unless you enable them via our configuration.
          </li>
        </ul>
        <h2 className="font-display text-xl font-medium text-ink-950">Your Choices</h2>
        <p>
          You can control and/or delete cookies as you wish by using your browser settings. You can delete all cookies
          that are already on your computer and you can set your browser to prevent them from being placed. If you do
          this, some functionality of the site may not work as intended.
        </p>
        <p>
          For visitors in the EEA/UK, a consent banner should be implemented before analytics/advertising cookies are
          set. This template does not include a consent-management platform out of the box, so you should implement one
          before enabling these features.
        </p>
      </div>
    </div>
  );
}
