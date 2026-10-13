import { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/features',
          '/how-it-works',
          '/departments',
          '/about',
          '/careers',
          '/contact',
          '/assistant',
          '/login',
          '/signup',
          '/privacy',
          '/terms',
          '/llms.txt',
        ],
        disallow: [
          '/api/',
          '/dashboard/',
          '/settings/',
          '/profile/',
          '/admin/',
          '/records/',
          '/doctor/',
          '/receipt/',
          '/forgot-password/',
        ],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  }
}
