import type { MetadataRoute } from 'next';
import { SEO } from '@/lib/constants/seo';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SEO.siteUrl}/sitemap.xml`,
  };
}
