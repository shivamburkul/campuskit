import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, CONTACT_EMAIL } from '@/config/site';

export const metadata: Metadata = {
  title: 'About',
  description: `Learn about ${SITE_NAME} — free student tools for CGPA, attendance, PDFs, images and more.`,
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="font-display text-3xl font-semibold text-ink-950 dark:text-ink-50">
        About {SITE_NAME}
      </h1>

      <div className="mt-6 space-y-5 text-base leading-relaxed text-ink-700 dark:text-ink-200">
        <p>
          CampusKit is a free utility platform built for students — CGPA and attendance
          calculators, PDF and image tools, text utilities, and developer tools that come up
          constantly during a semester, all in one place, with no account required.
        </p>

        <p>
          Most tools run entirely in your browser: your files and inputs are processed on your
          own device rather than uploaded to a server, wherever that&apos;s technically possible.
        </p>

        <p>
          CampusKit started as a side project by a computer engineering student who got
          tired of bouncing between five different ad-heavy websites to do simple, everyday
          calculations. It&apos;s built and maintained on a small budget, which is also why it&apos;s
          deliberately simple, fast, and free of unnecessary accounts, popups, or clutter.
        </p>
      </div>

      <h2 className="mt-10 font-display text-xl font-semibold text-ink-950 dark:text-ink-50">
        Our Mission
      </h2>
      <p className="mt-3 text-base leading-relaxed text-ink-700 dark:text-ink-200">
        Our goal is simple: to make every calculation a student needs fast, free, and private.
        We believe that education should not come with barriers, and that includes simple
        digital tools.
      </p>

      <h2 className="mt-10 font-display text-xl font-semibold text-ink-950 dark:text-ink-50">
        Our Commitment
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-base text-ink-700 dark:text-ink-200">
        <li>All core tools are free to use, forever.</li>
        <li>We do not require accounts for any tool.</li>
        <li>We process files locally in your browser whenever possible.</li>
        <li>We never sell your personal data.</li>
      </ul>

      <h2 className="mt-10 font-display text-xl font-semibold text-ink-950 dark:text-ink-50">
        Contact
      </h2>
      <p className="mt-3 text-base leading-relaxed text-ink-700 dark:text-ink-200">
        Questions, feedback, or bug reports? Reach us at{' '}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-medium text-primary-600 underline-offset-2 hover:underline dark:text-primary-400"
        >
          {CONTACT_EMAIL}
        </a>{' '}
        or use the{' '}
        <Link
          href="/contact"
          className="font-medium text-primary-600 underline-offset-2 hover:underline dark:text-primary-400"
        >
          contact form
        </Link>
        .
      </p>
    </div>
  );
}
