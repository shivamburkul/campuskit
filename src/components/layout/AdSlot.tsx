/**
 * AdSense placement component.
 *
 * Renders nothing in production unless:
 *   - NEXT_PUBLIC_ADS_ENABLED=true
 *   - NEXT_PUBLIC_ADSENSE_PUBLISHER_ID is a real ca-pub-… ID
 *   - NEXT_PUBLIC_ADSENSE_SLOT_IDS contains a real ad unit ID for this position
 *     (JSON map), e.g. {"homepage":"1234567890","tool-top":"0987654321"}
 *
 * Never ships placeholder / fake ad unit IDs.
 */

type AdPosition = 'homepage' | 'category' | 'tool-top' | 'tool-result' | 'footer' | 'side-rail';

function readSlotMap(): Partial<Record<AdPosition, string>> {
  const raw = process.env.NEXT_PUBLIC_ADSENSE_SLOT_IDS;
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as Record<string, string>;
    return parsed ?? {};
  } catch {
    return {};
  }
}

export function AdSlot({ position, className = '' }: { position: AdPosition; className?: string }) {
  const adsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === 'true';
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID ?? '';
  const isValidPublisherId = /^ca-pub-\d{10,}$/.test(publisherId);
  const slotMap = readSlotMap();
  const slotId = slotMap[position];
  const isValidSlot = typeof slotId === 'string' && /^\d{6,}$/.test(slotId);

  if (!adsEnabled || !isValidPublisherId || !isValidSlot) {
    if (process.env.NODE_ENV !== 'production') {
      return (
        <div
          aria-hidden="true"
          className={`flex min-h-[90px] w-full items-center justify-center rounded-md border border-dashed border-ink-300 bg-ink-100/30 text-xs text-ink-500 ${className}`}
        >
          Ad slot: {position} (disabled until real AdSense unit IDs are configured)
        </div>
      );
    }
    return null;
  }

  return (
    <div data-ad-position={position} className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minHeight: '90px' }}
        data-ad-client={publisherId}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `(adsbygoogle = window.adsbygoogle || []).push({});`,
        }}
      />
    </div>
  );
}
