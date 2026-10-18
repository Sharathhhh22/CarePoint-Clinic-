import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#173F30',
          borderRadius: '40px',
          padding: '24px',
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          style={{ width: '130px', height: '130px' }}
        >
          {/* CarePoint Clinical Cross */}
          <rect x="10" y="3" width="4" height="18" rx="2" fill="#ffffff" />
          <rect x="3" y="10" width="18" height="4" rx="2" fill="#ffffff" />
          {/* Subtle Sage Botanical Node */}
          <circle cx="18" cy="6" r="2.5" fill="#A9C2B2" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
