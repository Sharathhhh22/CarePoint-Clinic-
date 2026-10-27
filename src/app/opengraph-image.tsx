import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          background: 'linear-gradient(135deg, #0B1220 0%, #16213A 100%)',
          color: '#F1F5F9',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: '#0f766e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px',
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              style={{ width: '44px', height: '44px' }}
            >
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
          <span style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
            SlotUrSelf
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '900px' }}>
          <h1
            style={{
              fontSize: '64px',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#FFFFFF',
              margin: 0,
            }}
          >
            Skip the waiting room. Book doctors instantly.
          </h1>
          <p
            style={{
              fontSize: '28px',
              color: '#94A3B8',
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            Real-time clinical scheduling with verified specialists. Zero waiting rooms, atomic slot holds.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #26334F', paddingTop: '32px' }}>
          <span style={{ fontSize: '22px', color: '#14b8a6', fontWeight: 600 }}>
            sloturself.com
          </span>
          <span style={{ fontSize: '20px', color: '#64748B' }}>
            Enterprise Healthcare Platform
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
