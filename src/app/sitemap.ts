import type { MetadataRoute } from 'next';
import { CATEGORIES, CategoryId, getImplementedTools } from '@/config/registry';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export default function sitemap(): MetadataRoute.Sitemap {
  // All blog posts
  const blogPosts: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/blog/cgpa-gpa-guide`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/blog/fix-attendance-shortage`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/blog/student-finance-tools`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/blog/text-tools-guide`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/blog/developer-tools-guide`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/blog/sgpa-guide`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/blog/exam-score-guide`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/blog/study-planner-guide`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/blog/budget-guide`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/blog/regex-guide`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/blog/matrix-guide`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/blog/permutation-combination-guide`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/blog/scientific-calculator-guide`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/blog/time-zone-guide`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/blog/gst-guide`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/blog/academic-progress-guide`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/blog/hash-generator-guide`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/blog/image-cropper-guide`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/blog/case-converter-guide`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/blog/compress-pdf-guide`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/blog/study-session-tracker-guide`, changeFrequency: 'monthly', priority: 0.6 },
  ];

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/tools`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/terms`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/cookies`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/disclaimer`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/advertising`, changeFrequency: 'yearly', priority: 0.2 },
  ];

  const categoryPages: MetadataRoute.Sitemap = (Object.keys(CATEGORIES) as CategoryId[]).map((id) => ({
    url: `${SITE_URL}/category/${id}`,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  const toolPages: MetadataRoute.Sitemap = getImplementedTools().map((tool) => ({
    url: `${SITE_URL}/tools/${tool.slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...toolPages, ...blogPosts];
}
