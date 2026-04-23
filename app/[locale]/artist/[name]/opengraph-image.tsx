import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; name: string }>
}) {
  const { name } = await params
  const artistName = decodeURIComponent(name)

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
        }}
      >
        <div style={{ fontSize: 24, color: '#a1a1aa', letterSpacing: 4 }}>
          ARTIST
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: '#ffffff',
            textAlign: 'center',
            padding: '0 80px',
          }}
        >
          {artistName}
        </div>
        <div style={{ fontSize: 22, color: '#71717a' }}>Global Music Trends</div>
      </div>
    ),
    size
  )
}
