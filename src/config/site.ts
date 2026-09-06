/**
 * Central, real (non-placeholder) site configuration referenced by legal
 * pages, the contact form, and metadata. Before a public launch, replace
 * CONTACT_EMAIL with an inbox you actually control, and re-run
 * `npm run build` (search the repo for CONTACT_EMAIL to confirm every
 * reference updated).
 */
export const SITE_NAME = 'CampusKit';
export const CONTACT_EMAIL = 'campuskitofficial@gmail.com'; // Updated with your business email
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

/** Bump this whenever a legal page's substance changes. */
export const LEGAL_LAST_UPDATED = 'September 2026';