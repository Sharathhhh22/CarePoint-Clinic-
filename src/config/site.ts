/**
 * Site-wide constants and configuration.
 */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sloturself.com'

export const siteConfig = {
  name: 'SlotUrSelf',
  title: 'SlotUrSelf | Book Doctors Instantly',
  description: 'Enterprise healthcare booking platform connecting patients directly with verified clinical specialists. Real-time availability, zero waiting rooms.',
  url: siteUrl,
  ogImage: `${siteUrl}/opengraph-image`,
  contact: {
    email: 'support@sloturself.com',
    phone: '1-800-756-8669',
    emergencyPhone: '108',
  },
  links: {
    privacy: '/privacy',
    terms: '/terms',
    careers: '/careers',
    assistant: '/assistant',
    departments: '/departments',
    features: '/features',
    howItWorks: '/how-it-works',
    contact: '/contact',
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
