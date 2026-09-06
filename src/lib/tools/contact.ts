export interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactForm(values: ContactFormValues): ContactFormErrors {
  const errors: ContactFormErrors = {};

  if (!values.name.trim()) errors.name = 'Please enter your name.';
  else if (values.name.trim().length > 120) errors.name = 'Name is too long.';

  if (!values.email.trim()) {
    errors.email = 'Please enter your email so we can reply.';
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'That doesn’t look like a valid email address.';
  } else if (values.email.length > 254) {
    errors.email = 'Email is too long.';
  }

  if (!values.subject.trim()) errors.subject = 'Please choose a subject.';
  else if (values.subject.trim().length > 200) errors.subject = 'Subject is too long.';

  if (!values.message.trim()) {
    errors.message = 'Please enter a message.';
  } else if (values.message.trim().length < 10) {
    errors.message = 'Please add a little more detail (at least 10 characters).';
  } else if (values.message.length > 5000) {
    errors.message = 'Message is too long — please keep it under 5000 characters.';
  }

  return errors;
}

export function hasContactErrors(errors: ContactFormErrors): boolean {
  return Object.values(errors).some(Boolean);
}

/** Kept for tests / back-compat. Prefer the server API route for real sends. */
export function buildMailtoLink(to: string, values: ContactFormValues): string {
  const subjectLine = `[CampusKit] ${values.subject}`;
  const body = `${values.message}\n\n— ${values.name} (${values.email})`;
  return `mailto:${to}?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(body)}`;
}