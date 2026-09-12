'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { GraduationCap, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isToolsPage = pathname === '/tools';
  const hideAllTools = isHome || isToolsPage;
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showHamburger, setShowHamburger] = useState(false);
  const [allToolsInMenu, setAllToolsInMenu] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const checkWidth = () => {
      const header = document.querySelector('header');
      const nav = document.querySelector('nav');
      const allToolsBtn = document.querySelector('a[href="/tools"]');
      if (!header || !nav) return;
      
      const headerWidth = header.offsetWidth;
      
      const navItems = nav.querySelectorAll('a:not(.theme-toggle-wrapper a)');
      let totalWidth = 0;
      navItems.forEach((item) => {
        totalWidth += (item as HTMLElement).offsetWidth + 8;
      });
      
      const themeToggle = nav.querySelector('.theme-toggle-wrapper');
      if (themeToggle) {
        totalWidth += (themeToggle as HTMLElement).offsetWidth + 8;
      }
      
      const availableWidth = headerWidth - 110 - 20;
      
      if (totalWidth > availableWidth) {
        setShowHamburger(true);
        
        if (allToolsBtn && !hideAllTools) {
          const allToolsWidth = (allToolsBtn as HTMLElement).offsetWidth;
          const navWithoutTools = totalWidth - allToolsWidth - 8;
          if (navWithoutTools + 50 > availableWidth) {
            setAllToolsInMenu(true);
          } else {
            setAllToolsInMenu(false);
          }
        } else {
          setAllToolsInMenu(false);
        }
      } else {
        setShowHamburger(false);
        setAllToolsInMenu(false);
      }
    };

    checkWidth();
    window.addEventListener('resize', checkWidth);
    window.addEventListener('orientationchange', () => {
      setTimeout(checkWidth, 300);
    });
    
    setTimeout(checkWidth, 100);
    setTimeout(checkWidth, 500);
    
    return () => {
      window.removeEventListener('resize', checkWidth);
      window.removeEventListener('orientationchange', checkWidth);
    };
  }, [hideAllTools, pathname]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-3 left-1/2 z-50 -translate-x-1/2 transition-[top] duration-300 ease-out ${
          scrolled ? 'top-2' : 'top-3'
        }`}
        style={{ width: 'min(94%, 56rem)' }}
      >
        <div
          className={`flex items-center justify-between gap-2 rounded-full border px-3 py-2 shadow-lg sm:gap-6 sm:px-6 sm:py-3 transition-[background-color,border-color,box-shadow] duration-300 ${
            scrolled
              ? 'border-white/30 bg-white/40 shadow-black/10 dark:border-white/10 dark:bg-ink-900/80 dark:shadow-black/40'
              : 'border-white/40 bg-white/30 shadow-black/8 dark:border-white/10 dark:bg-ink-900/70 dark:shadow-black/30'
          }`}
          style={{
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            backdropFilter: 'blur(24px) saturate(180%)',
          }}
        >
          <Link href="/" className="flex items-center gap-1.5 group flex-shrink-0 sm:gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-violet-600 text-white shadow-md shadow-primary-500/25 transition-transform duration-300 group-hover:scale-110 sm:h-9 sm:w-9">
              <GraduationCap size={14} strokeWidth={2.5} className="sm:size-[18px]" />
            </div>
            <span className="font-display text-xs font-semibold tracking-tight text-ink-950 dark:text-ink-50 whitespace-nowrap sm:text-base">
              Campus<span className="text-primary-600 dark:text-primary-400">Kit</span>
            </span>
          </Link>

          <nav className="flex items-center gap-1 flex-shrink-0 sm:gap-3">
            {!showHamburger ? (
              <>
                <Link
                  href="/blog"
                  className="rounded-full px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-ink-700 transition-all duration-300 hover:bg-white/40 hover:text-ink-950 dark:text-ink-300 dark:hover:bg-ink-800/60 dark:hover:text-ink-50 sm:px-4 sm:py-1.5 sm:text-xs"
                >
                  Guides
                </Link>
                <Link
                  href="/about"
                  className="rounded-full px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-ink-700 transition-all duration-300 hover:bg-white/40 hover:text-ink-950 dark:text-ink-300 dark:hover:bg-ink-800/60 dark:hover:text-ink-50 sm:px-4 sm:py-1.5 sm:text-xs"
                >
                  About
                </Link>
                {!hideAllTools && (
                  <Link
                    href="/tools"
                    className="rounded-full bg-primary-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-md shadow-primary-600/25 transition-all duration-300 hover:bg-primary-500 hover:shadow-primary-500/40 hover:scale-[1.03] active:scale-[0.98] dark:bg-primary-500 dark:hover:bg-primary-400 sm:px-4 sm:py-1.5 sm:text-xs"
                  >
                    All Tools
                  </Link>
                )}
              </>
            ) : (
              <>
                {!allToolsInMenu && !hideAllTools && (
                  <Link
                    href="/tools"
                    className="rounded-full bg-primary-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-md shadow-primary-600/25 transition-all duration-300 hover:bg-primary-500 hover:shadow-primary-500/40 hover:scale-[1.03] active:scale-[0.98] dark:bg-primary-500 dark:hover:bg-primary-400 sm:px-4 sm:py-1.5 sm:text-xs"
                  >
                    All Tools
                  </Link>
                )}
              </>
            )}
            <div className="theme-toggle-wrapper">
              <ThemeToggle />
            </div>
            {showHamburger && (
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-200/50 bg-white/40 text-ink-700 transition-all duration-300 hover:bg-ink-100/70 hover:scale-110 active:scale-95 dark:border-ink-700/50 dark:bg-ink-800/40 dark:text-ink-200 dark:hover:bg-ink-700/60"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={16} /> : <Menu size={16} />}
              </button>
            )}
          </nav>
        </div>
      </header>

      {menuOpen && showHamburger && (
        <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)}>
          <div
            className="absolute right-4 top-[72px] w-48 rounded-xl border border-white/30 bg-white/90 py-1 shadow-lg backdrop-blur-xl dark:border-ink-700/60 dark:bg-ink-900/90"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex flex-col">
              <Link
                href="/blog"
                className="px-4 py-2.5 text-sm text-ink-700 transition-colors hover:bg-ink-50 dark:text-ink-200 dark:hover:bg-ink-800/60"
                onClick={() => setMenuOpen(false)}
              >
                Guides
              </Link>
              <Link
                href="/about"
                className="px-4 py-2.5 text-sm text-ink-700 transition-colors hover:bg-ink-50 dark:text-ink-200 dark:hover:bg-ink-800/60"
                onClick={() => setMenuOpen(false)}
              >
                About
              </Link>
              {(!hideAllTools && allToolsInMenu) && (
                <Link
                  href="/tools"
                  className="px-4 py-2.5 text-sm font-medium text-primary-600 transition-colors hover:bg-ink-50 dark:text-primary-400 dark:hover:bg-ink-800/60"
                  onClick={() => setMenuOpen(false)}
                >
                  All Tools
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
