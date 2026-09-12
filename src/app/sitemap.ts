import type { MetadataRoute } from 'next';
import { SEO } from '@/lib/constants/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SEO.siteUrl}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${SEO.siteUrl}/panduan`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SEO.siteUrl}/panduan/cara-membuat-rirekisho`, changeFrequency: 'monthly', priority: 0.8 },
  ];
}
