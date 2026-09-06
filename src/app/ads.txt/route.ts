import { NextResponse } from 'next/server';

/**
 * Serves /ads.txt.
 * Emits a real IAB line only when a real publisher ID is configured.
 */
export function GET() {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID ?? '';
  const pubMatch = publisherId.match(/^ca-(pub-\d{10,})$/);

  const body = pubMatch
    ? `google.com, ${pubMatch[1]}, DIRECT, f08c47fec0942fa0\n`
    : `# ads.txt — configure NEXT_PUBLIC_ADSENSE_PUBLISHER_ID (ca-pub-…) before enabling ads.\n# Example line after you have a real publisher ID:\n# google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0\n`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}