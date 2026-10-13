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
              background: '#0d9488',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px',
              fontWeight: 900,
              color: '#FFFFFF',
            }}
          >
            S
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
