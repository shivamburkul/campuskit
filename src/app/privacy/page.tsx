import { LEGAL_LAST_UPDATED, CONTACT_EMAIL } from '@/config/site';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-prose px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-medium text-ink-950">Privacy Policy</h1>
      <p className="mt-2 text-sm text-ink-500">Last updated: {LEGAL_LAST_UPDATED}</p>

      <div className="prose-content mt-8 space-y-5 text-ink-800">
        <p>
          CampusKit (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is built to need as little of your personal data as possible. This page explains
          exactly what we collect, why we collect it, and what choices you have.
        </p>

        <h2 className="font-display text-xl font-medium text-ink-950">What we collect</h2>
        <p>
          Most tools run entirely in your browser. Calculator inputs, PDF/image files you process, and text you paste into
          utilities are not uploaded to CampusKit servers unless a feature explicitly says otherwise.
        </p>

        <h2 className="font-display text-xl font-medium text-ink-950">Analytics</h2>
        <p>
          If analytics is enabled and you accept cookies, we may use Google Analytics to understand aggregate traffic
          (pages viewed, device type, approximate region). Analytics is not loaded until you accept the cookie banner.
        </p>

        <h2 className="font-display text-xl font-medium text-ink-950">Local storage</h2>
        <p>
          Preferences such as theme choice may be stored in your browser&apos;s local storage on your device — not on our
          servers.
        </p>

        <h2 className="font-display text-xl font-medium text-ink-950">Contact Form</h2>
        <p>
          When you use our contact form, we collect your name, email address, and message. This data is used solely to
          respond to your inquiry.
        </p>
        <p>
          Messages are delivered through our email provider (for example Resend) so we can reply to you. The provider
          processes the message content, your email address (as Reply-To), and any optional attachment solely to
          deliver that email. We do not run our own mail server and we do not keep a separate message archive on
          CampusKit servers beyond what the email provider retains under their own policies.
        </p>

        <h2 className="font-display text-xl font-medium text-ink-950">Your Rights (GDPR/CCPA)</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            <strong>Access:</strong> You can ask us what data we hold about you.
          </li>
          <li>
            <strong>Deletion:</strong> You can ask us to delete any data we hold about you.
          </li>
          <li>
            <strong>Correction:</strong> You can ask us to correct any inaccurate data.
          </li>
          <li>
            <strong>Withdrawal of Consent:</strong> You can withdraw your consent for analytics at any time.
          </li>
        </ul>
        <p>
          To exercise these rights, email us at {CONTACT_EMAIL}. We will respond within 30 days as required by law.
        </p>

        <h2 className="font-display text-xl font-medium text-ink-950">Advertising</h2>
        <p>
          If/when third-party advertising is enabled on CampusKit, the ad network (e.g. Google AdSense) may use cookies
          or similar technologies to serve relevant ads and measure performance, subject to their own privacy policy.
        </p>

        <h2 className="font-display text-xl font-medium text-ink-950">Contact</h2>
        <p>
          Questions about this policy can be sent via the{' '}
          <a className="text-primary-600 underline" href="/contact">
            Contact
          </a>{' '}
          page or by emailing us directly at {CONTACT_EMAIL}.
        </p>

        <h2 className="font-display text-xl font-medium text-ink-950">Changes</h2>
        <p>We may update this policy as CampusKit grows. Material changes will be reflected by updating the date above.</p>
      </div>
    </div>
  );
}
