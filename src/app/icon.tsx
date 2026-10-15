import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f766e',
          borderRadius: '8px',
          padding: '3px',
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          style={{ width: '22px', height: '22px' }}
        >
          {/* Concept A: Cross with time-slot contour */}
          <path
            d="M 8 2 H 5 C 3.9 2 3 2.9 3 4 V 8 H 1.5 C 0.7 8 0 8.7 0 9.5 V 14.5 C 0 15.3 0.7 16 1.5 16 H 3 V 20 C 3 21.1 3.9 22 5 22 H 8.5 C 7.5 18 7.5 14 8 10 C 8.2 7 8 4 8 2 Z"
            fill="#ffffff"
          />
          <path
            d="M 11 2 C 11.5 5 11.5 8 12 11 C 12.5 15 12 18 11.5 22 H 16 C 17.1 22 18 21.1 18 20 V 16 H 21.5 C 22.3 16 23 15.3 23 14.5 V 9.5 C 23 8.7 22.3 8 21.5 8 H 18 V 4 C 18 2.9 17.1 2 16 2 H 11 Z"
            fill="#0f172a"
          />
          <rect x="18" y="3" width="3" height="3" rx="0.5" fill="#5eead4" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
