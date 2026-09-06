import { NextRequest, NextResponse } from 'next/server';
import {
  validateContactForm,
  hasContactErrors,
  ContactFormValues,
} from '@/lib/tools/contact';

export const runtime = 'nodejs';

const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;
const ALLOWED_ATTACHMENT_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'application/pdf',
  'text/plain',
]);

const hits = new Map<string, number[]>();
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 5;

function clientKey(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

function rateLimited(key: string): boolean {
  const now = Date.now();
  const prev = (hits.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (prev.length >= RATE_MAX) {
    hits.set(key, prev);
    return true;
  }
  prev.push(now);
  hits.set(key, prev);
  return false;
}

async function sendWithResend(opts: {
  to: string;
  from: string;
  replyTo: string;
  subject: string;
  text: string;
  apiKey: string;
  attachment?: { filename: string; content: Buffer; contentType: string };
}): Promise<{ ok: boolean; error?: string }> {
  const payload: Record<string, unknown> = {
    from: opts.from,
    to: [opts.to],
    reply_to: opts.replyTo,
    subject: opts.subject,
    text: opts.text,
  };

  if (opts.attachment) {
    payload.attachments = [
      {
        filename: opts.attachment.filename,
        content: opts.attachment.content.toString('base64'),
        content_type: opts.attachment.contentType,
      },
    ];
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${opts.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    return { ok: false, error: body || `Resend HTTP ${res.status}` };
  }
  return { ok: true };
}

export async function POST(req: NextRequest) {
  const to = process.env.CONTACT_EMAIL;
  const from = process.env.EMAIL_FROM;
  const apiKey = process.env.EMAIL_API_KEY || process.env.RESEND_API_KEY;

  if (!to || !from || !apiKey) {
    return NextResponse.json(
      {
        error:
          'Contact email is not configured on the server. Set CONTACT_EMAIL, EMAIL_FROM, and EMAIL_API_KEY.',
      },
      { status: 503 }
    );
  }

  if (rateLimited(clientKey(req))) {
    return NextResponse.json(
      { error: 'Too many messages. Please wait a minute and try again.' },
      { status: 429 }
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data.' }, { status: 400 });
  }

  const website = String(form.get('website') ?? '');
  if (website.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  const values: ContactFormValues = {
    name: String(form.get('name') ?? ''),
    email: String(form.get('email') ?? ''),
    subject: String(form.get('subject') ?? ''),
    message: String(form.get('message') ?? ''),
  };

  const errors = validateContactForm(values);
  if (hasContactErrors(errors)) {
    return NextResponse.json({ error: 'Validation failed.', fields: errors }, { status: 400 });
  }

  if (/[\r\n]/.test(values.subject) || /[\r\n]/.test(values.name)) {
    return NextResponse.json({ error: 'Invalid characters in input.' }, { status: 400 });
  }

  let attachment:
    | { filename: string; content: Buffer; contentType: string }
    | undefined;

  const file = form.get('attachment');
  if (file && typeof file !== 'string' && 'size' in file && (file as File).size > 0) {
    const f = file as File;
    if (f.size > MAX_ATTACHMENT_BYTES) {
      return NextResponse.json({ error: 'Attachment must be under 5 MB.' }, { status: 400 });
    }
    const type = f.type || 'application/octet-stream';
    if (!ALLOWED_ATTACHMENT_TYPES.has(type)) {
      return NextResponse.json(
        { error: 'Unsupported attachment type. Use PNG, JPEG, WebP, GIF, PDF, or plain text.' },
        { status: 400 }
      );
    }
    const buf = Buffer.from(await f.arrayBuffer());
    const safeName = (f.name || 'attachment').replace(/[^\w.\-()+ ]/g, '_').slice(0, 120);
    attachment = { filename: safeName, content: buf, contentType: type };
  }

  const subject = `[CampusKit] ${values.subject}`.slice(0, 200);
  const text = [
    values.message,
    '',
    '—',
    `From: ${values.name}`,
    `Reply-To: ${values.email}`,
  ].join('\n');

  try {
    const result = await sendWithResend({
      to,
      from,
      replyTo: values.email.trim(),
      subject,
      text,
      apiKey,
      attachment,
    });

    if (!result.ok) {
      console.error('[contact] email provider error', result.error);
      return NextResponse.json(
        { error: 'Could not send your message. Please try again later.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[contact] unexpected error', err);
    return NextResponse.json(
      { error: 'Could not send your message. Please try again later.' },
      { status: 500 }
    );
  }
}