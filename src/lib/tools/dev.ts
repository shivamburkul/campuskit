export function formatJson(input: string, indent = 2): { output: string; error: string | null } {
  try {
    const parsed = JSON.parse(input);
    return { output: JSON.stringify(parsed, null, indent), error: null };
  } catch (e) {
    return { output: '', error: e instanceof Error ? e.message : 'Invalid JSON' };
  }
}

export function minifyJson(input: string): { output: string; error: string | null } {
  try {
    const parsed = JSON.parse(input);
    return { output: JSON.stringify(parsed), error: null };
  } catch (e) {
    return { output: '', error: e instanceof Error ? e.message : 'Invalid JSON' };
  }
}

export function validateJson(input: string): { valid: boolean; error: string | null } {
  try {
    JSON.parse(input);
    return { valid: true, error: null };
  } catch (e) {
    return { valid: false, error: e instanceof Error ? e.message : 'Invalid JSON' };
  }
}

export function encodeBase64(input: string): string {
  if (typeof window !== 'undefined') {
    return window.btoa(unescape(encodeURIComponent(input)));
  }
  return Buffer.from(input, 'utf-8').toString('base64');
}

const BASE64_PATTERN = /^[A-Za-z0-9+/]*={0,2}$/;

export function decodeBase64(input: string): { output: string; error: string | null } {
  const cleaned = input.trim();
  if (cleaned.length === 0 || cleaned.length % 4 !== 0 || !BASE64_PATTERN.test(cleaned)) {
    return { output: '', error: 'Invalid Base64 string' };
  }
  try {
    if (typeof window !== 'undefined') {
      return { output: decodeURIComponent(escape(window.atob(cleaned))), error: null };
    }
    return { output: Buffer.from(cleaned, 'base64').toString('utf-8'), error: null };
  } catch {
    return { output: '', error: 'Invalid Base64 string' };
  }
}

export function encodeUrl(input: string): string {
  return encodeURIComponent(input);
}

export function decodeUrl(input: string): { output: string; error: string | null } {
  try {
    return { output: decodeURIComponent(input), error: null };
  } catch {
    return { output: '', error: 'Invalid URL-encoded string' };
  }
}

export function generateUuidV4(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // RFC4122 fallback
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function unixToDate(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toISOString();
}

export function dateToUnix(isoString: string): number | null {
  const t = new Date(isoString).getTime();
  if (Number.isNaN(t)) return null;
  return Math.floor(t / 1000);
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!match) return null;
  return {
    r: parseInt(match[1]!, 16),
    g: parseInt(match[2]!, 16),
    b: parseInt(match[3]!, 16),
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  return `#${[clamp(r), clamp(g), clamp(b)].map((n) => n.toString(16).padStart(2, '0')).join('')}`;
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

/** Decodes a JWT's header/payload WITHOUT verifying the signature. Never trust unverified claims. */
export function decodeJwt(token: string): { header: unknown; payload: unknown; error: string | null } {
  const parts = token.split('.');
  if (parts.length !== 3) {
    return { header: null, payload: null, error: 'A JWT must have 3 dot-separated parts' };
  }
  try {
    const decodePart = (p: string) => {
      const base64 = p.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
      const json = typeof window !== 'undefined' ? decodeURIComponent(escape(window.atob(padded))) : Buffer.from(padded, 'base64').toString('utf-8');
      return JSON.parse(json);
    };
    return { header: decodePart(parts[0]!), payload: decodePart(parts[1]!), error: null };
  } catch {
    return { header: null, payload: null, error: 'Could not decode token — check it is a valid JWT' };
  }
}

const BASE_DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz';

export function numberBaseConvert(value: string, fromBase: number, toBase: number): { output: string; error: string | null } {
  const trimmed = value.trim().toLowerCase();
  if (trimmed.length === 0) return { output: '', error: 'Enter a value to convert' };

  const validDigits = new Set(BASE_DIGITS.slice(0, fromBase));
  for (const char of trimmed) {
    if (!validDigits.has(char)) {
      return { output: '', error: `"${value}" is not valid in base ${fromBase}` };
    }
  }

  try {
    const parsed = parseInt(trimmed, fromBase);
    if (Number.isNaN(parsed)) return { output: '', error: `"${value}" is not valid in base ${fromBase}` };
    return { output: parsed.toString(toBase).toUpperCase(), error: null };
  } catch {
    return { output: '', error: 'Conversion failed' };
  }
}
