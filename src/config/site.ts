/**
 * Site-wide constants and configuration.
 */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://slot-yourself-7afv.vercel.app'

export const siteConfig = {
  name: 'CarePoint Clinic',
  title: 'CarePoint Clinic | Compassionate Modern Healthcare',
  description: 'Outpatient clinical care connecting patients directly with verified medical specialists. Real-time appointments, modern facilities, zero friction.',
  url: siteUrl,
  ogImage: `${siteUrl}/opengraph-image`,
  contact: {
    email: 'care@carepointclinic.com',
    phone: '+1 (800) 289-2273',
    emergencyPhone: '911',
    hours: 'Mon - Fri: 8:00 AM - 8:00 PM EST, Sat: 9:00 AM - 4:00 PM',
    address: '452 Healthcare Boulevard, Suite 300, Boston, MA 02115',
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
