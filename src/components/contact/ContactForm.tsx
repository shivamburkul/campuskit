'use client';
import { FormEvent, useState } from 'react';
import { TextField, SelectField } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { InlineNote } from '@/components/ui/Result';
import { validateContactForm, hasContactErrors, ContactFormValues } from '@/lib/tools/contact';
import { formatBytes, isFileSizeAllowed } from '@/lib/tools/files';

const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;
const ALLOWED_EXT = /\.(png|jpe?g|webp|gif|pdf|txt)$/i;

type Status = 'idle' | 'submitting' | 'success' | 'error';

const SUBJECTS = ['Wrong calculation / bug report', 'Tool request', 'General feedback', 'Something else'];

export function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>({ name: '', email: '', subject: '', message: '' });
  const [attachment, setAttachment] = useState<File | null>(null);
  const [errors, setErrors] = useState<ReturnType<typeof validateContactForm>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState('');

  function handleAttachment(file: File | null) {
    setAttachmentError(null);
    if (!file) {
      setAttachment(null);
      return;
    }
    if (!isFileSizeAllowed(file.size, MAX_ATTACHMENT_BYTES)) {
      setAttachmentError(`Attachment must be under ${formatBytes(MAX_ATTACHMENT_BYTES)}.`);
      setAttachment(null);
      return;
    }
    if (!ALLOWED_EXT.test(file.name)) {
      setAttachmentError('Supported types: PNG, JPEG, WebP, GIF, PDF, TXT.');
      setAttachment(null);
      return;
    }
    setAttachment(file);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError(null);

    if (honeypot.trim() !== '') {
      setStatus('success');
      return;
    }

    const nextErrors = validateContactForm(values);
    setErrors(nextErrors);
    if (hasContactErrors(nextErrors)) return;

    setStatus('submitting');
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('subject', values.subject);
      formData.append('message', values.message);
      formData.append('website', honeypot);
      if (attachment) formData.append('attachment', attachment);

      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      });

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        fields?: ReturnType<typeof validateContactForm>;
      };

      if (!response.ok) {
        if (data.fields) setErrors(data.fields);
        setServerError(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }

      setStatus('success');
      setValues({ name: '', email: '', subject: '', message: '' });
      setAttachment(null);
      setErrors({});
    } catch {
      setServerError('Network error. Please check your connection and try again.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-primary-200/60 bg-primary-50/40 p-6 dark:border-primary-700/40 dark:bg-primary-50/15">
        <p className="font-medium text-ink-950 dark:text-primary-300">Your message has been sent successfully.</p>
        <p className="mt-1 text-sm text-ink-700 dark:text-ink-400">
          We read every message, especially reports about incorrect calculations.
        </p>
        <Button variant="secondary" type="button" className="mt-4" onClick={() => setStatus('idle')}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="absolute -left-[9999px] -top-[9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <TextField
            label="Name"
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          />
          {errors.name && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.name}</p>}
        </div>
        <div>
          <TextField
            label="Email"
            type="email"
            value={values.email}
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          />
          {errors.email && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email}</p>}
        </div>
      </div>

      <div>
        <SelectField
          label="Subject"
          value={values.subject}
          onChange={(v) => setValues((prev) => ({ ...prev, subject: v }))}
          options={[{ value: '', label: 'Choose one…' }, ...SUBJECTS.map((s) => ({ value: s, label: s }))]}
        />
        {errors.subject && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.subject}</p>}
      </div>

      <div>
        <label htmlFor="contact-message" className="text-sm font-medium text-ink-700 dark:text-ink-300">
          Message
        </label>
        <textarea
          id="contact-message"
          value={values.message}
          onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
          rows={6}
          className="mt-1.5 w-full resize-y rounded-xl border border-ink-200/70 bg-surface px-4 py-3 text-sm shadow-sm outline-none transition-all duration-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50 dark:focus:border-primary-500 dark:focus:ring-primary-500/30"
        />
        {errors.message && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.message}</p>}
      </div>

      <div>
        <label htmlFor="contact-attachment" className="text-sm font-medium text-ink-700 dark:text-ink-300">
          Attachment{' '}
          <span className="font-normal text-ink-500 dark:text-ink-400">
            (optional, max {formatBytes(MAX_ATTACHMENT_BYTES)})
          </span>
        </label>
        <input
          id="contact-attachment"
          type="file"
          accept=".png,.jpg,.jpeg,.webp,.gif,.pdf,.txt,image/*,application/pdf,text/plain"
          className="mt-1.5 block w-full text-sm text-ink-700 dark:text-ink-300"
          onChange={(e) => handleAttachment(e.target.files?.[0] ?? null)}
        />
        {attachment && (
          <p className="mt-1 text-xs text-ink-600 dark:text-ink-400">
            Selected: {attachment.name} ({formatBytes(attachment.size)})
          </p>
        )}
        {attachmentError && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{attachmentError}</p>}
      </div>

      {(status === 'error' || serverError) && (
        <InlineNote tone="warning">
          {serverError || 'Something went wrong. Please try again in a moment.'}
        </InlineNote>
      )}

      <Button type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Send message'}
      </Button>

      <p className="text-xs text-ink-500 dark:text-ink-400">
        We only use your email to reply to this message. See our{' '}
        <a href="/privacy" className="underline text-primary-600 dark:text-primary-400">
          Privacy Policy
        </a>{' '}
        for details.
      </p>
    </form>
  );
}