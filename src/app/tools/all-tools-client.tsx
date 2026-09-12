'use client';

import Link from 'next/link';
import { useRef, useEffect } from 'react';
import { CATEGORIES, CategoryId, ToolMeta } from '@/config/registry';
import {
  Calculator,
  CalendarCheck,
  Wallet,
  FileText,
  Image as ImageIcon,
  Type,
  Cpu,
  Code2,
  Clock,
  BookOpen,
  GraduationCap,
  Percent,
  Target,
  Hash,
  Layers,
  Scissors,
  Maximize2,
  FilePlus,
  Diff,
  Binary,
  Zap,
  Timer,
  Hourglass,
  FlaskConical,
  Languages,
} from 'lucide-react';

const CATEGORY_ICONS: Record<CategoryId, React.ReactNode> = {
  academic: <GraduationCap size={22} />,
  attendance: <CalendarCheck size={22} />,
  finance: <Wallet size={22} />,
  pdf: <FileText size={22} />,
  image: <ImageIcon size={22} />,
  text: <Type size={22} />,
  engineering: <Cpu size={22} />,
  developer: <Code2 size={22} />,
  everyday: <Clock size={22} />,
  study: <BookOpen size={22} />,
  science: <FlaskConical size={22} />,
  language: <Languages size={22} />,
};

const TOOL_ICONS: Record<string, React.ReactNode> = {
  'cgpa-calculator': <GraduationCap size={28} />,
  'gpa-calculator': <Calculator size={28} />,
  'grade-calculator': <Percent size={28} />,
  'percentage-calculator': <Percent size={28} />,
  'required-marks-calculator': <Target size={28} />,
  'target-gpa-calculator': <Target size={28} />,
  'attendance-calculator': <CalendarCheck size={28} />,
  'attendance-classes-needed': <Hash size={28} />,
  'attendance-classes-can-miss': <Hash size={28} />,
  'subject-wise-attendance': <Layers size={28} />,
  'expense-splitter': <Wallet size={28} />,
  'grocery-expense-splitter': <Wallet size={28} />,
  'emi-calculator': <Calculator size={28} />,
  'simple-interest-calculator': <Calculator size={28} />,
  'compound-interest-calculator': <Calculator size={28} />,
  'savings-goal-calculator': <Target size={28} />,
  'pdf-merge': <FilePlus size={28} />,
  'pdf-split': <Scissors size={28} />,
  'image-to-pdf': <FileText size={28} />,
  'image-compressor': <ImageIcon size={28} />,
  'image-resizer': <Maximize2 size={28} />,
  'image-format-converter': <ImageIcon size={28} />,
  'word-counter': <Type size={28} />,
  'text-cleaner': <Type size={28} />,
  'find-and-replace': <Type size={28} />,
  'text-diff': <Diff size={28} />,
  'json-formatter': <Code2 size={28} />,
  'base64-tool': <Binary size={28} />,
  'url-encoder': <Code2 size={28} />,
  'uuid-generator': <Hash size={28} />,
  'jwt-decoder': <Code2 size={28} />,
  'timestamp-converter': <Clock size={28} />,
  'color-converter': <Zap size={28} />,
  'unit-converter': <Calculator size={28} />,
  'number-base-converter': <Binary size={28} />,
  'ohms-law-calculator': <Zap size={28} />,
  'statistics-calculator': <Calculator size={28} />,
  'age-calculator': <Clock size={28} />,
  'date-difference-calculator': <Clock size={28} />,
  'business-days-calculator': <CalendarCheck size={28} />,
  'tip-calculator': <Wallet size={28} />,
  'discount-calculator': <Percent size={28} />,
  'pomodoro-timer': <Timer size={28} />,
  'exam-countdown': <Hourglass size={28} />,
};

interface Props {
  tools: ToolMeta[];
  categoryIds: CategoryId[];
}

function HorizontalScroller({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      const canScrollLeft = el.scrollLeft > 0;
      const canScrollRight = el.scrollLeft < el.scrollWidth - el.clientWidth - 1;
      const scrollingDown = e.deltaY > 0;
      const scrollingUp = e.deltaY < 0;

      const shouldConvert =
        Math.abs(e.deltaY) > Math.abs(e.deltaX) &&
        ((scrollingDown && canScrollRight) || (scrollingUp && canScrollLeft));

      if (shouldConvert) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <div ref={ref} className="category-scroll">
      {children}
    </div>
  );
}

export function AllToolsClient({ tools, categoryIds }: Props) {
  const implemented = tools.filter((t) => t.implemented);

  return (
    <div className="space-y-6 sm:space-y-7">
      {categoryIds.map((id) => {
        const catTools = implemented.filter((t) => t.category === id);
        if (catTools.length === 0) return null;
        const cat = CATEGORIES[id];

        return (
          <section key={id} className="animate-fade-up overflow-visible">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/30 text-primary-600 backdrop-blur-[24px] dark:bg-primary-900/40 dark:text-primary-300">
                {CATEGORY_ICONS[id]}
              </span>
              <div>
                <h2 className="font-display text-lg font-semibold text-ink-950 dark:text-ink-50 sm:text-xl">
                  {cat.name}
                </h2>
                <p className="text-xs text-ink-500 dark:text-ink-400 sm:text-sm">{cat.description}</p>
              </div>
            </div>

            <div className="overflow-visible py-2">
              <HorizontalScroller>
                {catTools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="tool-card group"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/30 text-primary-600 transition-colors duration-300 backdrop-blur-[24px] group-hover:bg-white/50 dark:bg-primary-900/30 dark:text-primary-300 dark:group-hover:bg-primary-900/50">
                      {TOOL_ICONS[tool.slug] || <Calculator size={28} />}
                    </span>
                    <span className="px-2 text-center text-xs font-medium leading-tight text-ink-800 dark:text-ink-200 sm:text-sm">
                      {tool.shortTitle || tool.title}
                    </span>
                  </Link>
                ))}
              </HorizontalScroller>
            </div>
          </section>
        );
      })}
    </div>
  );
}
