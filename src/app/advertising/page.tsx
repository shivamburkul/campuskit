import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Advertising' };

export default function AdvertisingPage() {
  return (
    <div className="mx-auto max-w-prose px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-medium text-ink-950">Advertising</h1>
      <div className="mt-8 space-y-5 text-ink-800">
        <p>
          CampusKit is free to use and may be supported in part by advertising once traffic and product maturity
          justify it. Our approach:
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li>Ads are placed in clearly separated slots — never disguised as buttons, results, or navigation.</li>
          <li>Ads never interrupt an in-progress calculation or file download.</li>
          <li>We do not use deceptive ad formats designed to cause accidental clicks.</li>
          <li>Ad placements are reviewed against usability before being enabled in production.</li>
        </ul>
        <p>
          Any ad network we use (e.g. Google AdSense) may independently collect data per its own privacy policy — see
          our <a className="text-moss-600 underline" href="/privacy">Privacy Policy</a> and{' '}
          <a className="text-moss-600 underline" href="/cookies">Cookie Policy</a>.
        </p>
      </div>
    </div>
  );
}