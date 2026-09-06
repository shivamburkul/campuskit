<div align="center">

# CampusKit

**Free, fast, privacy-first utilities for students — CGPA, attendance, PDF, image, text, and developer tools in one place.**

No account required. Most tools run entirely in your browser.

[Live Site](#) · [Report a Bug](#contact) · [Request a Tool](#contact)

</div>

---

## Overview

CampusKit is a Next.js web app bundling **44 tools across 10 categories** that students reach for
constantly — GPA calculators, attendance trackers, PDF utilities, image compressors, text tools, and
developer utilities — built as a single, coherent, fast product rather than a pile of ad-stuffed
calculator widgets.

- ⚡ **Fast** — statically generated per-tool routes, most pages ship only a few KB of JS
- 🔒 **Private by default** — PDF/image/text tools process files client-side; nothing is uploaded
- 🆓 **No account, no paywall** — every tool is free, with optional ad support that's off until configured
- 🌗 **Light & dark themes** — system-aware, persisted, no flash of unstyled content
- ✅ **Tested** — pure calculation logic covered by an automated test suite
- 📱 **Installable** — PWA-ready with offline support for tools that work offline

---

## Tool Categories

| Category | Examples |
|---|---|
| Academic | CGPA/GPA calculator, grade calculator, required-marks calculator |
| Attendance | Attendance percentage, classes-needed, classes-can-miss, subject tracker |
| Student Finance | Expense splitter, grocery splitter, EMI, interest calculators |
| PDF Tools | Merge, split, image-to-PDF (with real page thumbnails) |
| Image Tools | Compress, resize, convert format |
| Text Tools | Word counter, text cleaner, find & replace, word-level diff |
| Engineering & Math | Unit converter, number base converter, statistics, Ohm's law |
| Developer Tools | JSON formatter, Base64/URL encoders, UUID, JWT decoder, timestamp, color converter |
| Everyday | Age & date-difference calculators, business days, tip, discount |
| Study & Focus | Pomodoro timer, exam countdown |

Full list, always in sync with the code: [`src/config/registry.ts`](src/config/registry.ts)

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router), TypeScript (strict) |
| Styling | Tailwind CSS, CSS-variable-driven theming (light/dark) |
| PDF | `pdf-lib` (manipulation) + `pdfjs-dist` (thumbnails) — client-side only |
| Images | Native Canvas API — client-side only |
| Testing | Vitest |
| PWA | Hand-written service worker (`public/sw.js`) |
| Icons | `lucide-react` |

No database. No required backend. The entire site is statically generated.

---

## Getting Started

### Prerequisites
- Node.js ≥ 18.18

### Installation

```bash
git clone <your-repo-url>
cd campuskit
npm install
cp .env.example .env.local
```

### Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000). First route compile is slower (Next.js dev-mode
behavior) — subsequent navigation is instant. Production builds don't have this delay.

### Testing

```bash
npm run test          # run once
npm run test:watch    # watch mode
```

### Production build

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── tools/<slug>/       # One literal route per tool (see "Adding a Tool")
│   ├── category/[category]/
│   ├── blog/
│   ├── api/contact/        # Server-side contact form handler
│   └── privacy, terms, cookies, disclaimer, about, contact, advertising
├── components/
│   ├── tools/              # One component per tool, grouped by category
│   ├── layout/             # Header, footer, search, theme toggle, ad slots
│   └── ui/                 # Shared form fields, buttons, result panels
├── lib/
│   ├── tools/               # Pure calculation logic (fully unit-tested)
│   └── tool-page-factory.tsx  # Shared metadata/body logic for tool routes
├── config/
│   ├── registry.ts          # Single source of truth for every tool's metadata
│   ├── site.ts               # Site name, contact email, canonical URL
│   └── faq.ts                 # Per-tool FAQ content (also emitted as structured data)
tests/                        # Vitest unit tests, one file per calculation module
public/                       # Icons, manifest, service worker
```

---

## Adding a New Tool

1. **Logic** — write pure functions in `src/lib/tools/`, with unit tests in `tests/` covering normal,
   empty, invalid, and boundary inputs.
2. **UI** — build the component in `src/components/tools/<category>/` using the shared primitives in
   `src/components/ui/`.
3. **Register** — add an entry to `TOOLS` in `src/config/registry.ts`.
4. **Route** — create `src/app/tools/<slug>/page.tsx`:

   ```tsx
   import type { Metadata } from 'next';
   import { YourComponent } from '@/components/tools/<category>/YourComponent';
   import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

   export const metadata: Metadata = buildToolMetadata('your-slug');
   export default function Page() {
     return <ToolPageBody slug="your-slug" Component={YourComponent} />;
   }
   ```

   Use a literal directory per tool, not a shared `[slug]` catch-all — this keeps each tool's JS bundle
   isolated and small.
5. **Verify** — `npm run test && npm run build`.

Category pages, the sitemap, and search all update automatically from the registry.

---

## Environment Variables

See [`.env.example`](.env.example) for the full list. All are optional — the app runs with zero
configuration.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL used in metadata, sitemap, and Open Graph tags |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Enables Google Analytics if set |
| `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` + `NEXT_PUBLIC_ADS_ENABLED` | Enables ad slots if both are set |
| `CONTACT_EMAIL`, `EMAIL_FROM`, `EMAIL_API_KEY` | Server-side only — power the contact form API route |

Never prefix a secret with `NEXT_PUBLIC_` — those variables are shipped to the browser.

---

## Theming

Light/dark/system theme, chosen via the header toggle and persisted in `localStorage`. Implemented with
CSS custom properties (`src/app/globals.css`) rather than per-component `dark:` overrides where possible,
so new components inherit correct theming automatically by using the semantic tokens (`bg-surface`,
`text-ink-900`, etc.) instead of raw Tailwind colors.

---

## Deployment

Any Next.js-compatible host works. [Vercel](https://vercel.com) is the path of least friction:

```bash
npm i -g vercel
vercel --prod
```

Set environment variables in your host's dashboard, not in a committed file. After your ads.txt line is
issued by your ad network, add it as `public/ads.txt`.

---

## Contributing

1. Fork and branch from `main`
2. Make your change, following the "Adding a New Tool" pattern where applicable
3. Run `npm run test && npm run lint && npm run build`
4. Open a pull request with a clear description

---

## License

MIT — see [LICENSE](LICENSE).

---

<div align="center">

Built for students who are tired of five different ad-choked websites to do one calculation.

</div>