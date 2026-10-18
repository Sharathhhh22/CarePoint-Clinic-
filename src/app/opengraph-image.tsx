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
          background: 'linear-gradient(135deg, #102B21 0%, #173F30 100%)',
          color: '#FAFAF7',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: '#173F30',
              border: '2px solid #A9C2B2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px',
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              style={{ width: '40px', height: '40px' }}
            >
              <rect x="9" y="3" width="6" height="18" rx="2" fill="#FAFAF7" />
              <rect x="3" y="9" width="18" height="6" rx="2" fill="#FAFAF7" />
              <circle cx="12" cy="12" r="2.5" fill="#173F30" />
            </svg>
          </div>
          <span style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.02em', color: '#FAFAF7' }}>
            CarePoint Clinic
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '900px' }}>
          <h1
            style={{
              fontSize: '60px',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: '#FAFAF7',
              margin: 0,
            }}
          >
            Compassionate Outpatient Clinical Excellence
          </h1>
          <p
            style={{
              fontSize: '26px',
              color: '#D4E2D9',
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            Board-certified specialists, zero waiting friction, and modern coordinated appointments.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid rgba(255,255,255,0.15)', paddingTop: '32px' }}>
          <span style={{ fontSize: '22px', color: '#A9C2B2', fontWeight: 600 }}>
            carepointclinic.com
          </span>
          <span style={{ fontSize: '20px', color: '#B7C9BE' }}>
            Compassionate Modern Healthcare
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
