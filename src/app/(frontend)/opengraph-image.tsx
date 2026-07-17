import { ImageResponse } from 'next/og'

export const alt = 'Trusty — отзывы и рейтинги страховых компаний'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'center',
          background: '#f4f8fa',
          color: '#071b45',
          display: 'flex',
          height: '100%',
          overflow: 'hidden',
          padding: '74px 82px',
          position: 'relative',
          width: '100%',
        }}
      >
        <div
          style={{
            background: '#6d28d9',
            borderRadius: 999,
            height: 420,
            opacity: 0.08,
            position: 'absolute',
            right: -90,
            top: -120,
            width: 420,
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 930 }}>
          <div style={{ alignItems: 'center', display: 'flex', gap: 18 }}>
            <div
              style={{
                alignItems: 'center',
                background: '#6d28d9',
                borderRadius: 22,
                color: 'white',
                display: 'flex',
                fontSize: 38,
                fontWeight: 800,
                height: 82,
                justifyContent: 'center',
                width: 82,
              }}
            >
              T
            </div>
            <div style={{ fontSize: 42, fontWeight: 800, letterSpacing: 2 }}>TRUSTY</div>
          </div>
          <div style={{ fontSize: 68, fontWeight: 800, letterSpacing: -3, lineHeight: 1.05, marginTop: 54 }}>
            Страхование без неприятных сюрпризов
          </div>
          <div style={{ color: '#526077', fontSize: 28, lineHeight: 1.4, marginTop: 28 }}>
            Рейтинги, реальные отзывы и жалобы клиентов
          </div>
        </div>
        <div
          style={{
            background: '#579c9e',
            bottom: 0,
            height: 14,
            left: 0,
            position: 'absolute',
            width: '100%',
          }}
        />
      </div>
    ),
    size,
  )
}
