import Link from 'next/link';
import { CATEGORIES, CategoryId } from '@/config/registry';
import { AdSlot } from './AdSlot';
import { CONTACT_EMAIL } from '@/config/site';

const CATEGORY_IDS = Object.keys(CATEGORIES) as CategoryId[];

export function SiteFooter() {
  return (
    <footer className="mt-8 border-t border-white/30 bg-white/30 backdrop-blur-[24px] saturate-180 dark:border-white/10 dark:bg-ink-900/70">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <AdSlot position="footer" className="mb-6" />
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold text-ink-950 dark:text-ink-50">Categories</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-700 dark:text-ink-300">
              {CATEGORY_IDS.slice(0, 6).map((id) => (
                <li key={id}>
                  <Link href={`/category/${id}`} className="hover:text-ink-950 dark:hover:text-ink-50 hover:underline">
                    {CATEGORIES[id].name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink-950 dark:text-ink-50">More</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-700 dark:text-ink-300">
              {CATEGORY_IDS.slice(6).map((id) => (
                <li key={id}>
                  <Link href={`/category/${id}`} className="hover:text-ink-950 dark:hover:text-ink-50 hover:underline">
                    {CATEGORIES[id].name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/tools" className="hover:text-ink-950 dark:hover:text-ink-50 hover:underline">All tools</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink-950 dark:text-ink-50">Company</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-700 dark:text-ink-300">
              <li><Link href="/about" className="hover:text-ink-950 dark:hover:text-ink-50 hover:underline">About</Link></li>
              <li><Link href="/contact" className="hover:text-ink-950 dark:hover:text-ink-50 hover:underline">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink-950 dark:text-ink-50">Legal</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-700 dark:text-ink-300">
              <li><Link href="/privacy" className="hover:text-ink-950 dark:hover:text-ink-50 hover:underline">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-ink-950 dark:hover:text-ink-50 hover:underline">Terms of Use</Link></li>
              <li><Link href="/cookies" className="hover:text-ink-950 dark:hover:text-ink-50 hover:underline">Cookie Policy</Link></li>
              <li><Link href="/disclaimer" className="hover:text-ink-950 dark:hover:text-ink-50 hover:underline">Disclaimer</Link></li>
              <li><Link href="/advertising" className="hover:text-ink-950 dark:hover:text-ink-50 hover:underline">Advertising</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-2 border-t border-white/30 pt-6 text-xs text-ink-500 dark:border-white/10 dark:text-ink-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} CampusKit. Free tools, no account required.</p>
          <p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-ink-950 dark:hover:text-ink-50 hover:underline">
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
