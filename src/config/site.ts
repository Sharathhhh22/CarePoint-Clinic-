/**
 * Site-wide constants and configuration.
 */

export const siteConfig = {
  name: 'APPOINTLY',
  description: 'Enterprise healthcare booking platform connecting patients with verified specialists.',
  url: 'https://slot-yourself-7afv.vercel.app',
  ogImage: '/images/showcase/dashboard.jpg',
  links: {
    privacy: '/privacy',
    terms: '/terms',
  },
  booking: {
    holdDurationMinutes: 10,
    notificationMinutesBefore: 5,
    maxUpcomingDisplay: 10,
  },
  theme: {
    primaryColor: '#0d9488', // Teal-600
    brandColor: '#0f766e',  // Teal-700
  }
} as const
