import { LEGAL_LAST_UPDATED, CONTACT_EMAIL } from '@/config/site';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Terms of Use' };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-prose px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-medium text-ink-950">Terms of Use</h1>
      <p className="mt-2 text-sm text-ink-500">Last updated: {LEGAL_LAST_UPDATED}</p>
      <div className="mt-8 space-y-5 text-ink-800">
        <p>
          By using CampusKit, you agree to these terms. Please read them carefully.
          If you do not agree, please do not use our service.
        </p>

        <h2 className="font-display text-xl font-medium text-ink-950">Use of the Service</h2>
        <p>
          CampusKit provides free calculators and utilities &quot;as is&quot; for informational
          and convenience purposes. You are solely responsible for verifying results before
          relying on them for academic, financial, or official decisions. We do not provide
          professional advice.
        </p>

        <h2 className="font-display text-xl font-medium text-ink-950">No Warranty</h2>
        <p>
          We work hard to keep calculations accurate and tools reliable, but we make no
          guarantee that any tool is free of errors, uninterrupted, or fit for a specific
          purpose. The service is provided on an &quot;as is&quot; and &quot;as available&quot; basis.
        </p>

        <h2 className="font-display text-xl font-medium text-ink-950">Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>Attempt to disrupt, overload, or reverse-engineer the service in harmful ways.</li>
          <li>Use CampusKit to process content you don&apos;t have the right to process.</li>
          <li>Rely on any tool for safety-critical, medical, or legal decisions.</li>
          <li>Violate any applicable local, national, or international law.</li>
        </ul>

        <h2 className="font-display text-xl font-medium text-ink-950">Intellectual Property</h2>
        <p>
          CampusKit&apos;s design, branding, and original code are owned by its operator.
          Open-source components are used under their respective licenses. You may not copy
          or redistribute our code without permission.
        </p>

        <h2 className="font-display text-xl font-medium text-ink-950">Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, CampusKit and its operators shall not be
          liable for any indirect, incidental, special, consequential, or punitive damages
          arising from your use of the service.
        </p>

        <h2 className="font-display text-xl font-medium text-ink-950">Changes to the Service</h2>
        <p>
          Tools may be added, changed, or removed over time. We&apos;ll try to avoid breaking
          changes to commonly used tools without notice where practical.
        </p>

        <h2 className="font-display text-xl font-medium text-ink-950">Contact</h2>
        <p>
          Questions can be sent via the <a className="text-moss-600 underline" href="/contact">Contact</a> page
          or by emailing us at {CONTACT_EMAIL}.
        </p>
      </div>
    </div>
  );
}