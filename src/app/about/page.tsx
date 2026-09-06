import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'About CampusKit' };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-prose px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-medium text-ink-950">About CampusKit</h1>
      <div className="mt-8 space-y-5 text-ink-800">
        <p>
          CampusKit is a free utility platform built for students — CGPA and attendance calculators, PDF and image
          tools, text utilities, and developer tools that come up constantly during a semester, all in one place, with
          no account required.
        </p>
        <p>
          Most tools run entirely in your browser: your files and inputs are processed on your own device rather than
          uploaded to a server, wherever that&apos;s technically possible.
        </p>
        <p>
          CampusKit started as a side project by a computer engineering student who got tired of bouncing between five
          different ad-heavy websites to do simple, everyday calculations. It&apos;s built and maintained on a small
          budget, which is also why it&apos;s deliberately simple, fast, and free of unnecessary accounts, popups, or
          clutter.
        </p>
        <h2 className="font-display text-xl font-medium text-ink-950">Our Mission</h2>
        <p>
          Our goal is simple: to make every calculation a student needs fast, free, and private. We believe that
          education should not come with barriers, and that includes simple digital tools.
        </p>
        <h2 className="font-display text-xl font-medium text-ink-950">Our Commitment</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>All core tools are free to use, forever.</li>
          <li>We do not require accounts for any tool.</li>
          <li>We process files locally in your browser whenever possible.</li>
          <li>We never sell your personal data.</li>
        </ul>
      </div>
    </div>
  );
}