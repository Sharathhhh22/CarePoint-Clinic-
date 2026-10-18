import { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/services',
          '/gallery',
          '/pricing',
          '/security',
          '/about',
          '/contact',
          '/privacy',
          '/terms',
          '/clinics',
          '/departments',
          '/features',
          '/how-it-works',
          '/careers',
          '/assistant',
          '/login',
          '/signup',
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
