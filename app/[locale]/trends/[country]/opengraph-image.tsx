import { ImageResponse } from 'next/og'
import { countryDisplayNames, countryFlags } from '@/lib/countries'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; country: string }>
}) {
  const { country } = await params
  const displayName = countryDisplayNames[country] ?? country
  const flag = countryFlags[country] ?? '🎵'

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
          gap: 16,
        }}
      >
        <div style={{ fontSize: 96 }}>{flag}</div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: '#ffffff',
            textAlign: 'center',
            padding: '0 60px',
          }}
        >
          Music Trends: {displayName}
        </div>
        <div style={{ fontSize: 26, color: '#a1a1aa' }}>Global Music Trends</div>
      </div>
    ),
    size
  )
}
