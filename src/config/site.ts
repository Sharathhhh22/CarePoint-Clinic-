/**
 * Site-wide constants and configuration.
 */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://slot-yourself-7afv.vercel.app'

export const siteConfig = {
  name: 'SlotUrSelf',
  title: 'SlotUrSelf | Book Doctors Instantly',
  description: 'Healthcare booking platform connecting patients directly with verified clinical specialists. Real-time slot reservation, zero waiting rooms.',
  url: siteUrl,
  ogImage: `${siteUrl}/opengraph-image`,
  contact: {
    email: 'support@sloturself.com',
    phone: '+91 80 4567 8900',
    emergencyPhone: '108',
    hours: 'Mon - Sat: 9:00 AM - 7:00 PM IST',
    address: 'Indiranagar, Bengaluru, Karnataka 560038, India',
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
