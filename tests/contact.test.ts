import { describe, it, expect } from 'vitest';
import { validateContactForm, hasContactErrors, buildMailtoLink } from '../src/lib/tools/contact';

const valid = {
  name: 'Shiv',
  email: 'shiv@example.com',
  subject: 'Bug report',
  message: 'The CGPA calculator gave a wrong result for my case.',
};

describe('validateContactForm', () => {
  it('accepts a fully valid submission', () => {
    expect(hasContactErrors(validateContactForm(valid))).toBe(false);
  });
  it('rejects an empty name', () => {
    expect(validateContactForm({ ...valid, name: '' }).name).toBeDefined();
  });
  it('rejects an invalid email', () => {
    expect(validateContactForm({ ...valid, email: 'not-an-email' }).email).toBeDefined();
  });
  it('rejects an empty email', () => {
    expect(validateContactForm({ ...valid, email: '' }).email).toBeDefined();
  });
  it('rejects a too-short message', () => {
    expect(validateContactForm({ ...valid, message: 'short' }).message).toBeDefined();
  });
  it('rejects an overly long message', () => {
    expect(validateContactForm({ ...valid, message: 'a'.repeat(5001) }).message).toBeDefined();
  });
  it('rejects a missing subject', () => {
    expect(validateContactForm({ ...valid, subject: '' }).subject).toBeDefined();
  });
  it('rejects overly long name', () => {
    expect(validateContactForm({ ...valid, name: 'x'.repeat(121) }).name).toBeDefined();
  });
});

describe('buildMailtoLink', () => {
  it('includes encoded subject and body', () => {
    const link = buildMailtoLink('owner@example.com', valid);
    expect(link.startsWith('mailto:owner@example.com?')).toBe(true);
    expect(link).toContain('subject=');
    expect(link).toContain('body=');
    expect(link).not.toContain(' ');
  });
});