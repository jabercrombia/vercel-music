import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import createMDX from '@next/mdx'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const withMDX = createMDX({})

const nextConfig: NextConfig = {
  experimental: {
    mdxRs: { mdxType: 'gfm' },
    useCache: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lastfm.freetls.fastly.net',
      },
      {
        protocol: 'https',
        hostname: '*.last.fm',
      },
    ],
  },

  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
}

export default withNextIntl(withMDX(nextConfig))
