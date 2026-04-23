import type { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vercel-music.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: '%s — Global Music Trends',
    default: 'Global Music Trends',
  },
  description: 'Real-time music charts personalized by your country, powered by Last.fm.',
  openGraph: {
    siteName: 'Global Music Trends',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
