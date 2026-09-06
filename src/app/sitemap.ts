import type { MetadataRoute } from 'next';
import { CATEGORIES, CategoryId, getImplementedTools } from '@/config/registry';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/tools`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.1 },
    { url: `${SITE_URL}/terms`, changeFrequency: 'yearly', priority: 0.1 },
    { url: `${SITE_URL}/cookies`, changeFrequency: 'yearly', priority: 0.1 },
    { url: `${SITE_URL}/disclaimer`, changeFrequency: 'yearly', priority: 0.1 },
    { url: `${SITE_URL}/advertising`, changeFrequency: 'yearly', priority: 0.1 },
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

  return [...staticPages, ...categoryPages, ...toolPages];
}
