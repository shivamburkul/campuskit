import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact/ContactForm';

export const metadata: Metadata = { title: 'Contact', alternates: { canonical: '/contact' } };

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-paper dark:bg-paper">
      <div className="mx-auto max-w-prose px-4 py-12 sm:px-6">
        <h1 className="font-display text-3xl font-medium text-ink-950 dark:text-ink-50">Contact</h1>
        <p className="mt-3 text-ink-700 dark:text-ink-300">
          Found a bug, have a tool request, or spotted an incorrect formula? We read every message — reports about
          incorrect calculations get looked at first.
        </p>
        <div className="mt-8">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}