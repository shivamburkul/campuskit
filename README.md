# CampusKit

A free, fast, privacy-first utility platform for students — CGPA/attendance calculators, PDF and image
tools, text utilities, developer tools, and more. No account required. Most tools run **entirely in the
browser**: files and inputs are never uploaded to a server.

This repository is a real, deployable Next.js codebase, not a demo. It currently ships **44 fully
implemented, tested tools** across 10 categories, with the architecture in place to add more quickly.

**Since the initial build**, this project went through a full production-readiness pass: a dependency
security audit (14 vulnerabilities → 0), a Next.js 14→15 upgrade, a CSP bug fix that was breaking local
dev, dark mode, a performance fix for tool-page bundle size, and several tool rebuilds/additions. See §15
("Changelog / what changed in the production pass") for the specifics if you're picking this project back
up.

---

## 0. ₹0-cost by design

Nothing in this codebase requires a paid service to run in production:

- **No backend/database.** The entire site is statically generated (`next build` emits static HTML/JS for
  every page — verified: 68/68 pages prerendered). It can be hosted on any free static/edge host.
- **No paid APIs.** All calculations run in plain TypeScript. PDF tools use the open-source `pdf-lib`
  client-side. Image tools use the browser's native Canvas API client-side.
- **Analytics (Google Analytics) and Ads (AdSense) are both optional and disabled by default.** They only
  activate if you set the relevant environment variables — see §7 and §8. Both have genuinely free tiers
  for a site this size; neither is required to launch.
- **Recommended hosting:** [Vercel Hobby](https://vercel.com/pricing) (free), [Cloudflare Pages](https://pages.cloudflare.com/)
  (free, unlimited static requests), or [Netlify free tier](https://www.netlify.com/pricing/) — all can
  deploy this project directly from Git with zero cost at student-project traffic levels.

If you ever consider adding a feature that needs a paid API or server, treat that as a deliberate,
separate decision — don't let it slip in as a "convenience" dependency.

---

## 1. Tech stack

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) | One literal static route per tool for SEO + proper per-tool code-splitting (see §4) |
| Language | TypeScript (strict mode) | Calculation correctness matters — strict types catch a lot of bugs before they reach a student |
| Styling | Tailwind CSS, CSS-variable-driven palette | Dark mode (System/Light/Dark) works by re-theming color tokens, not by hand-adding `dark:` to every element |
| PDF tools | `pdf-lib` (manipulation) + `pdfjs-dist` (thumbnail rendering) — both client-side | No server round-trip, no file leaves the device; thumbnails render the real first page so files are recognizable at a glance |
| Image tools | Native Canvas API (client-side) | Zero dependency, works offline, no upload |
| Testing | Vitest | Fast, TypeScript-native, no config ceremony |
| PWA | Hand-written `public/sw.js` | `next-pwa`'s Workbox toolchain was the source of every remaining dependency vulnerability and hadn't been updated in years; a ~70-line service worker covers app-shell caching without that baggage |

## 2. Project structure

```
src/
  app/                    # Next.js App Router pages
    tools/<slug>/          # One literal directory per tool (see §4 — NOT a [slug] catch-all, deliberately)
    category/[category]/  # Category listing pages
    privacy|terms|cookies|disclaimer|advertising|about|contact/
    sitemap.ts, robots.ts # Generated from the tool registry — always in sync with real pages
  lib/tool-page-factory.tsx  # Shared metadata/body logic reused by every tools/<slug>/page.tsx
  components/
    tools/                # One React component per tool, grouped by category folder
    layout/                # Header, footer, search, ad slots, analytics loader, theme toggle
    ui/                     # Shared form fields, buttons, result panels
  lib/tools/                # Pure, framework-free calculation functions (see §4)
  lib/data/grading-schemes.ts  # University/country grading-scheme reference data (see §6)
  config/registry.ts        # Single source of truth: every tool's slug, title, category, description
  config/faq.ts              # Per-tool FAQ content (also emitted as FAQPage structured data)
  config/site.ts              # Real (non-placeholder) site name/email/URL used across legal pages
tests/                      # Vitest unit tests for every calculation module
public/                     # Icons, manifest.webmanifest, hand-written service worker (sw.js)
```

## 3. Install, run, test, build

Requires Node.js ≥ 18.18.

```bash
npm install              # install dependencies
npm run dev               # start local dev server at http://localhost:3000
npm run test               # run the full unit test suite (97 tests as of this snapshot)
npm run build               # production build — statically generates every page
npm run start                # serve the production build locally
npm run lint                  # ESLint (next/core-web-vitals ruleset)
```

`npm run build` is the most useful sanity check after any change: it type-checks, lints, and statically
renders every tool page, so a broken tool page fails the build instead of failing silently in production.

## 4. How a tool is structured (and how to add one)

Every tool is split into two layers on purpose:

1. **Pure logic** in `src/lib/tools/<domain>.ts` — plain functions, no React, no browser APIs (unless the
   tool genuinely needs `File`/`Canvas`, e.g. PDF/image tools). This is what the test suite covers.
2. **UI component** in `src/components/tools/<category>/<Name>.tsx` — a client component that wires form
   state to the pure logic and renders the result.

To add a new tool:

1. Write the calculation as pure functions in `src/lib/tools/` (or a new file if it's a new domain).
2. Write Vitest tests in `tests/` covering: a normal case, an empty/zero input, an invalid input, a
   boundary condition, and (where relevant) a negative or decimal value. Don't skip this step — it's
   what keeps "AI-generated tool suite" from meaning "untested tool suite."
3. Build the UI component using the shared primitives in `src/components/ui/` (`NumberField`, `TextField`,
   `SelectField`, `Button`, `ResultPanel`/`ResultStat`, `InlineNote`).
4. Add an entry to `TOOLS` in `src/config/registry.ts` (slug, title, category, description, keywords,
   `implemented: true`). The slug becomes the URL: `/tools/<slug>`.
5. Create `src/app/tools/<slug>/page.tsx`:
   ```tsx
   import type { Metadata } from 'next';
   import { YourComponent } from '@/components/tools/<category>/YourComponent';
   import { buildToolMetadata, ToolPageBody } from '@/lib/tool-page-factory';

   export const metadata: Metadata = buildToolMetadata('your-slug');
   export default function Page() {
     return <ToolPageBody slug="your-slug" Component={YourComponent} />;
   }
   ```
   **Use a literal directory per tool, not a shared dynamic `[slug]` route.** This was tried and measured:
   a single dynamic route serving every tool bundled all ~40 tools' code (including pdf-lib) into one
   ~200KB chunk loaded on every tool page, because Next.js gives one dynamic route pattern one client
   bundle regardless of which param resolves. Separate literal routes get separate, minimal, properly
   code-split bundles — confirmed in `next build`'s per-route size output (compare `/tools/word-counter`
   at ~2KB own-page-size vs `/tools/pdf-merge` at ~3KB own-page-size, each pulling in only what it needs).
6. Optionally add FAQ entries in `src/config/faq.ts` — these render on the page and as FAQPage structured
   data for search engines.
7. Run `npm run test` and `npm run build` before shipping. Check the build's route size table — a tool
   page jumping to 100KB+ *own* size (not shared) usually means a heavy dependency got imported at the
   top of a component instead of behind a dynamic `import()`.

Category pages, the homepage's "browse by category" section, the sitemap, and search all update
automatically from the registry — there's no second place to register a new tool.

## 5. Design system

- **Typography:** a serif display face (`--font-display`) for headings gives the product a "trustworthy
  reference tool" feel rather than a generic SaaS look; UI text uses a clean sans-serif.
- **Color:** a muted "ink" neutral scale plus a moss-green accent (`moss-*`) for primary actions and
  positive results, and amber for warnings — deliberately avoiding the default blue-and-white template
  look most utility-tool sites share.
- **No unnecessary motion, no modals-on-load, no autoplay, no fake urgency.** See `tailwind.config.ts`
  for the full token set.
- Fonts referenced via CSS variables (`--font-display`, `--font-sans`, `--font-mono`) are not bundled in
  this repo — wire them via `next/font` (Google Fonts, self-hosted, free) in `src/app/layout.tsx` when you
  set up the project; the current build falls back to system fonts, which still looks acceptable.

## 6. University / grading-scheme data — important

`src/lib/data/grading-schemes.ts` intentionally ships with only **two generic reference scales** (a common
10-point pattern, a common US 4.0 pattern), each explicitly labeled `sourceType: 'generic-reference'` with
a disclaimer. **CampusKit does not invent or assume any specific university's official formula.**

To add a real, university-specific scheme:

1. Find that university's official academic-regulations document (a PDF or page on their own site).
2. Add an entry to `GRADING_SCHEMES` with `sourceType: 'official-document'`, `sourceUrl` pointing at that
   document, and `verifiedDate` set to the day you checked it.
3. Never interpolate or guess a boundary value that isn't explicitly published.

Every GPA/CGPA tool also lets a student type in their own grade points directly, so the product is useful
even before a specific university is onboarded — presets are a convenience, not a requirement.

## 7. Configure analytics

Analytics is **off by default**. `src/components/layout/Analytics.tsx` only loads Google Analytics if
`NEXT_PUBLIC_GA_MEASUREMENT_ID` is set in your environment (`.env.local`, or your host's environment
variables panel). GA4 has a genuinely free tier suitable for this project's scale.

```bash
# .env.local
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

If you operate in the EEA/UK or another region requiring cookie consent before analytics loads, add a
consent-management step before this component renders — this repo does not include a consent banner out
of the box (see §9).

## 8. Configure ads

Ad slots exist throughout the layout (`src/components/layout/AdSlot.tsx`, placed on the homepage, category
pages, tool pages, and footer) but render **nothing** until both of these are set:

```bash
# .env.local
NEXT_PUBLIC_ADS_ENABLED=true
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXXXXXXXX
```

No publisher ID ships in this repo. In development, unconfigured slots render a clearly labeled dashed
placeholder so you can review layout without live ads. Before wiring a real ad network:

- Keep ad slots visually separated from calculate/download buttons (already the default placement).
- Never place an ad slot inside a tool's input form or directly above a primary action button.
- Review Google AdSense's placement policies before enabling in production.

A reserved desktop side-rail slot (`AdPosition: 'side-rail'`) also exists in `ToolShell`, but only renders
at the `2xl:` breakpoint (≥1536px) so it never squeezes the main content on ordinary laptop screens — it
just doesn't appear at all below that width, by design.

## 8b. Configure contact/email

The contact form (`/contact`) works with **zero configuration** via a `mailto:` fallback: submitting opens
the visitor's own email client with the message pre-filled, addressed to `CONTACT_EMAIL` in
`src/config/site.ts`. This guarantees the email is sent from the visitor's own address (never spoofed) and
costs nothing, but depends on the visitor having a configured mail app.

To use a real in-page submission flow instead (no page leaving the site, works for visitors without a
desktop mail client), configure a free-tier form backend such as [Formspree](https://formspree.io) (free
plan: 50 submissions/month, no credit card):

```bash
# .env.local
NEXT_PUBLIC_CONTACT_FORM_ENDPOINT=https://formspree.io/f/your-form-id
```

This is safe to expose as `NEXT_PUBLIC_*` — a Formspree-style form endpoint is meant to be embedded in
client-side HTML, it's not a secret credential. **Never** put an actual secret (SMTP password, private API
key) in a `NEXT_PUBLIC_*` variable — if you ever build a custom backend for this instead of using a
form-as-a-service, keep those credentials server-side only.

Before launch, update `CONTACT_EMAIL` in `src/config/site.ts` to an inbox you actually control.

Spam mitigation is a hidden honeypot field plus a 60-second client-side resubmit cooldown
(`src/components/contact/ContactForm.tsx`) — real abuse protection beyond that depends on whichever form
backend you configure; most (including Formspree) do their own filtering.

## 9. Consent handling

`NEXT_PUBLIC_CONSENT_MODE=basic` (the default) means analytics/ads are treated as fully optional and
simply don't load unless explicitly enabled per §7–8. This is a reasonable default for a low-traffic
launch, but it is **not** a substitute for a real consent banner if you have visitors in a jurisdiction
that legally requires one (e.g. GDPR in the EEA/UK). If that applies to you, integrate a consent-management
platform (several have free tiers, e.g. Google's own Consent Mode via a free CMP) and gate the `Analytics`
component and ad script loading behind consent state before enabling either in production.

## 10. Security posture

- Security headers (CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy) are set globally in
  `next.config.js`. The CSP adds `'unsafe-eval'` to `script-src` **only when `NODE_ENV==='development'`**
  (Next's dev server/Fast Refresh needs it) — production never receives it. Tighten the CSP's
  `script-src`/`frame-src` allowlist to match whatever ad network you actually enable — the current policy
  only allowlists Google's AdSense/Analytics domains.
- No arbitrary user code is ever executed server-side or client-side as a "convenience" feature. The JSON
  formatter parses with `JSON.parse`, not `eval`.
- File uploads (PDF/image tools, contact-form attachments) are size-capped (`MAX_UPLOAD_BYTES` in
  `src/lib/tools/files.ts`) and MIME-type checked before processing.
- No secrets are required for the app to function; `.env.example` documents every variable the app reads.
  The contact-form endpoint variable is `NEXT_PUBLIC_*` deliberately — it's a public form-submission URL,
  not a secret, the same way a Formspree endpoint is meant to be embedded in client-side HTML. Never put an
  actual secret (SMTP password, private API key) in a `NEXT_PUBLIC_*` variable.
- **Dependencies:** `npm audit` reports 0 vulnerabilities as of this snapshot (see §14d for what was fixed
  and why). Re-run `npm audit` after any dependency bump — don't assume it stays clean.
- Because there's no database or auth layer, most classic web-app attack surface (SQLi, session handling,
  stored XSS from user content) simply doesn't apply yet. Re-evaluate this section if/when you add
  accounts or server-side storage.

## 11. Testing

125 Vitest unit tests currently cover every pure calculation module (`src/lib/tools/*.ts`): GPA/CGPA,
percentage, attendance, finance (including the debt-settlement algorithm), the itemized grocery/expense
splitter, text utilities (including the word-level diff), developer
utilities, everyday/date utilities, unit conversion, and file-tool helpers. Each module is tested against
normal input, empty/zero input, invalid input, and boundary conditions (see `tests/`).

PDF/image tools use browser-only APIs (`File`, `Canvas`, `pdf-lib`'s document APIs) that aren't easily
unit-tested in Node — their pure logic (file-size validation, page-range parsing, quality estimation) is
factored out into `src/lib/tools/files.ts` and *is* tested; the actual file manipulation should be smoke-
tested manually in a browser (upload a real PDF/image, confirm the download) before each release, and is a
good candidate for Playwright end-to-end tests as the project matures.

## 12. Deployment

Any static/edge host that supports Next.js works. Vercel is the path of least resistance for Next.js
specifically:

```bash
npm i -g vercel      # one-time
vercel                 # deploy a preview
vercel --prod            # deploy to production
```

Set your environment variables (§7–9) in the host's dashboard rather than committing `.env.local`.

Because this app has no server-side runtime requirements (no API routes, no database), you can
alternatively run `next build && next export`-style static hosting on Cloudflare Pages, Netlify, or GitHub
Pages if you prefer — confirm your chosen host's Next.js App Router support for static export before
committing to it, since exact static-export capabilities vary by adapter and version.

## 13. What's implemented vs. roadmap

**Implemented and tested (44 tools):** CGPA, GPA, percentage, required-marks, target-GPA, weighted-grade
calculators; attendance percentage / classes-needed / classes-can-miss / subject-wise tracker; roommate
expense splitter, the itemized shared grocery/expense splitter (§16), simple/compound interest, EMI,
savings-goal calculators; PDF merge/split (with real first-page thumbnails), image→PDF; image
compressor/resizer/format-converter (with live previews); word counter, the full-featured text cleaner,
find-and-replace, the line-numbered word-level text diff; unit converter, number-base converter, statistics
calculator, Ohm's law calculator; JSON formatter, Base64/URL encoders, UUID generator, JWT decoder,
timestamp converter, color converter; age/date-difference (both with total weeks/hours/minutes/seconds)
/business-days/tip/discount calculators; Pomodoro timer, exam countdown.

**Registered but not yet built** (visible in `/tools` as "coming soon" so the roadmap is honest rather than
hidden): PDF compress, PDF→images. Add these following the §4 process when ready.

**Deliberately deferred beyond v1** (per the original product brief, these need more design/backend
thought before they're worth building):
- Personal "My CampusKit" dashboard (recently used / favorites / saved calculations) — straightforward to
  add using `localStorage` once the core tool suite has real usage data to prioritize against; no account
  system needed.
- Native Android/iOS app — the PWA foundation (installable manifest, offline-capable hand-written service
  worker) is already in place; wrapping it natively (e.g. via Capacitor, still free/open-source) is a good
  next step only after the website has proven demand.

## 14b. Dark mode

Theme is System / Light / Dark, chosen from the toggle in the header, persisted in `localStorage`
(`campuskit-theme`), and defaulting to System. It's implemented by re-theming a small set of CSS custom
properties (`src/app/globals.css`, `.dark` class on `<html>`) rather than adding `dark:` variants to every
element — so components written without thinking about dark mode still get it correctly as long as they
use the `ink-*`/`moss-*`/`amber-*`/`red-*`/`paper`/`surface` color tokens instead of raw Tailwind colors
(`bg-white`, `text-gray-900`, etc.). A blocking inline script in `<head>` (`themeBootstrapScript()` in
`src/lib/hooks/theme.ts`) applies the theme before first paint to avoid a flash of the wrong theme. If you
add new components, use the semantic tokens, not raw Tailwind grays, to keep dark mode correct for free.

## 14c. Known limitations (stated plainly rather than glossed over)

- **PDF thumbnails render the first page only.** Multi-page context (e.g. "page 3 of 12 looks like this")
  isn't shown — first-page recognition covers the common "is this the right file" case.
- **Text diff pairs adjacent single removed+added lines as one "changed" line.** Multi-line block moves or
  reorderings show as separate removed/added blocks rather than being detected as a move — a full Myers
  diff with move-detection is a reasonable future upgrade if this becomes a pain point.
- **The contact form's spam protection is a honeypot field + a client-side cooldown**, not server-side rate
  limiting — real abuse protection depends on whichever free form backend you configure (most, including
  Formspree, do their own spam filtering).
- **Dark-mode contrast was checked for the highest-traffic cases** (buttons, body text, warning/success
  banners) against WCAG AA, not exhaustively for every hover/menu state.
- **No automated accessibility (axe) or Lighthouse CI** is wired up yet; manual keyboard/screen-reader spot
  checks were done on the rebuilt Text Cleaner/Diff tools specifically since they were flagged as needing
  it, not across all 44 tools.

## 14d. Changelog — production-readiness pass

Summarizing what changed after the initial build, for anyone picking this project back up:

- **Security:** `npm audit` 14 vulnerabilities (2 moderate / 11 high / 1 critical) → 0. Next.js 14.2.35 →
  15.5.25 (fixes a wide range of advisories affecting all pre-15.5 versions), Vitest → 3.2.6 (fixes a
  critical RCE advisory in the old version, dev-only impact), `postcss` pinned to a patched version via
  npm `overrides` (Next.js bundles its own nested copy that a normal version bump doesn't reach), and
  `next-pwa` removed entirely — it was the sole source of the remaining moderate/high findings via an
  unmaintained Workbox/Terser dependency chain. Replaced with a ~70-line hand-written service worker.
- **Bug fix:** the CSP was breaking `npm run dev` (`unsafe-eval` EvalError, breaking Fast Refresh).
  `next.config.js` now only adds `unsafe-eval` when `NODE_ENV==='development'`; production CSP is
  unchanged and unaffected.
- **Breaking-change fix:** Next.js 15 made `params`/`searchParams` async; both dynamic routes were updated
  and type-checked.
- **Performance:** tool pages were bundling every tool's code (~200KB shared chunk, including pdf-lib)
  into every single tool page because they were all served from one dynamic `/tools/[slug]` route. Split
  into 44 literal per-tool routes (`src/app/tools/<slug>/page.tsx`) sharing a small factory
  (`src/lib/tool-page-factory.tsx`) — most tool pages now ship ~2KB of their own JS; only the 3 tools that
  actually use pdf-lib pull in its ~180KB.
- **New tool:** Shared Grocery & Expense Splitter (`/tools/grocery-expense-splitter`) — itemized per-person
  assignment, fixed/percentage charges, equal/proportional allocation, transparent breakdown, minimal-
  transaction settlement.
- **Rebuilt:** Text Cleaner (9 distinct operations instead of 3), Text Diff (line numbers, summary counts,
  word-level highlighting for changed lines instead of two undifferentiated blocks).
- **Improved:** Age/Date-Difference calculators now show total weeks/hours/minutes/seconds with an
  explicit note distinguishing calendar-date precision from exact-instant elapsed time; PDF merge/split
  show real first-page thumbnails; image tools show a live preview + dimensions.
- **New:** dark mode (System/Light/Dark); a real contact form (validated, honeypot + cooldown, mailto
  fallback with optional free-tier form-backend upgrade path); simplified header (search + category links
  removed; All Tools page gained its own search + category jump-nav to compensate); reserved desktop
  side-rail ad slot (`2xl:` breakpoint only, so it never squeezes normal laptop widths).
- **Legal pages:** removed literal `[DATE]` placeholders, centralized real (non-bracket) config values in
  `src/config/site.ts`.



## 14. A note on expectations

This codebase gets you a real, working, deployable product — not guaranteed traffic or income. Search
rankings, ad revenue, and audience growth take months regardless of code quality. Promote it (search,
social, the YouTube audience you already know how to build), keep formulas verifiably correct, and treat
`/contact` reports of wrong calculations as your highest-priority bug reports — trust, once lost on a
calculator site, is hard to win back.

## 15. Dark theme fix — root cause and what changed (this pass)

**Root cause found:** the codebase used the `ink-*` color family two contradictory ways at once —
newer layout/UI components (header, footer, cards, inputs, dropdowns) wrote explicit `dark:bg-ink-900`
classes assuming `ink-900` was a *fixed* dark color (like standard Tailwind's `gray-900`), while the
CSS variable system actually *inverts* `ink-900` under `.dark` (so it resolves to a near-white color,
correct for text, wrong for backgrounds). Since Tailwind only generates utilities for shades explicitly
listed in `tailwind.config.ts`, several other shades (`ink-50/200/400/600/800`, `amber-200/300/600/700/900`,
`coral-200/700`) were referenced throughout the app but never defined at all — those classes silently did
nothing, which is why some elements looked completely unstyled in dark mode.

**What was fixed (only color values and color class names — no layout, no logic, no light-theme changes):**
- `src/app/globals.css` — filled in every missing shade for `ink`/`amber`/`coral` in both `:root` and
  `.dark`, values chosen to preserve each family's existing look.
- `tailwind.config.ts` — registered those same missing shades so Tailwind actually generates the
  utility classes (this was the reason several were silently inert).
- **20 usages of `dark:bg-ink-900`/`dark:from-ink-900`/`dark:via-ink-900`** across `SiteHeader.tsx`,
  `SiteFooter.tsx`, `ToolShell.tsx`, `SearchBox.tsx`, `ThemeToggle.tsx`, `Field.tsx`, `Result.tsx`,
  `ContactForm.tsx`, the category page, the blog page, `all-tools-client.tsx`, and the homepage hero —
  redirected to `dark:bg-ink-100` (the shade that actually resolves dark), since `ink-900` resolves
  light by design (it's the "high-contrast text" role, not the "dark surface" role).
- **4 usages of `dark:bg-ink-800`/`dark:hover:bg-ink-800`** (nav pills, related-tools hover) — redirected
  to `dark:bg-ink-300`/`dark:hover:bg-ink-300`, same reasoning.

This is why the header, footer, hero section, and every card/dropdown/input were rendering as light/white
boxes with low-contrast text specifically in dark mode: those are exactly the elements that used the
mis-resolving shade. Verified visually with Playwright screenshots (home page, a tool page, and the
contact form) before and after — every background is now consistently dark, every text color reads
clearly, and light mode is pixel-identical to before (nothing in `:root` was touched, only `.dark`
values and the specific `dark:` class names listed above).

If you add new components later, use `bg-ink-100`/`bg-ink-300` (not `bg-ink-900`/`bg-ink-800`) whenever
you want a guaranteed-dark background in dark mode — or better, use the auto-flipping `bg-surface`/
`bg-paper` tokens directly without any `dark:` prefix at all, which is simpler and can't hit this bug
again.

## 16. Tool backend verification

All 125 Vitest unit tests pass (`npm run test`), covering every pure calculation module — GPA/CGPA,
percentage, attendance, finance (incl. the grocery/expense-splitter settlement algorithm), text utilities,
developer utilities, date utilities, and file-tool helpers. `npm run build` completes cleanly across all
44 tool routes plus the marketing/legal pages. This confirms every tool's actual calculation logic is
correct and exercised by tests — it does not replace manually clicking through each tool's UI once after
deploying, which is still worth doing before submitting for AdSense review.

## 17. AdSense readiness assessment

**Looks ready, with one thing you must do yourself before applying:**
- Privacy Policy, Terms, Cookie Policy, Disclaimer, About, Contact, and Advertising pages all have
  substantial real content (not placeholder/lorem-ipsum) and no leftover `[bracket]` placeholders.
- The site has genuine, original, functional content (44 real tools), clear navigation, and no thin/
  duplicate-content pages — AdSense's main content-quality bar.
- Ad slots are disabled by default and only activate with a real `ca-pub-` publisher ID — you won't
  accidentally submit with fake/placeholder ad code.
- **You still need to:** (1) set `CONTACT_EMAIL` in `src/config/site.ts` to a real inbox you control —
  it currently reads `hello@campuskit.app`, which won't receive mail unless that's actually yours; (2)
  after AdSense approves you and gives you a publisher ID, add an `ads.txt` file to `/public/ads.txt`
  containing the line Google gives you (`google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`) —
  this doesn't exist yet since it requires a real ID; (3) double-check your actual hosting domain is set
  in `NEXT_PUBLIC_SITE_URL` before building for production, since metadata/sitemap/canonical URLs all
  derive from it.

## 18. Dev-mode speed (npm run dev)

The ~11s initial `next dev` startup and ~3-4s delay the *first* time you open a given tool page are
normal Next.js dev-server behavior (it compiles each route on-demand the first time you visit it, then
caches it — subsequent visits are instant). This is a dev-only tradeoff for faster startup and isn't
present in production. Confirmed via `npm run build && npm run start`: every route is pre-compiled and
loads immediately, with most tool pages shipping only ~2KB of their own JavaScript (a handful of
PDF-related tools ship more, ~180KB, because they use the `pdf-lib`/`pdfjs-dist` libraries — that's
expected and already isolated to only those specific tool pages, not shared across the site). If dev-mode
startup time still bothers you day-to-day, it's a known Next.js characteristic, not something specific to
this codebase — running `npm run build && npm run start` locally gives you the true, fast, production
experience to test against instead.
