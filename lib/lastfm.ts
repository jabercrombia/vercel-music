import { cacheLife } from 'next/cache'

const BASE = 'https://ws.audioscrobbler.com/2.0/'
const KEY = process.env.LASTFM_API_KEY

export interface Track {
  name: string
  artist: { name: string }
  listeners: string
  image: { '#text': string; size: string }[]
  url: string
}

export interface Artist {
  name: string
  listeners: string
  image: { '#text': string; size: string }[]
  url: string
}

export interface ArtistInfo {
  name: string
  stats: { listeners: string; playcount: string }
  url: string
  image: { '#text': string; size: string }[]
  bio: { summary: string; content: string }
  similar: { artist: { name: string; url: string; image: { '#text': string; size: string }[] }[] }
  tags: { tag: { name: string; url: string }[] }
}

export async function getArtistInfo(name: string, lang?: string): Promise<ArtistInfo | null> {
  'use cache'
  cacheLife('hours')

  const langParam = lang ? `&lang=${encodeURIComponent(lang)}` : ''
  const res = await fetch(
    `${BASE}?method=artist.getInfo&artist=${encodeURIComponent(name)}&api_key=${KEY}&format=json${langParam}`
  )
  const data = await res.json()
  if (data?.error) {
    console.error('[lastfm] getArtistInfo error:', data.error, data.message)
    return null
  }
  return data?.artist ?? null
}

export async function getArtistTopTracks(name: string): Promise<Track[]> {
  'use cache'
  cacheLife('hours')

  const res = await fetch(
    `${BASE}?method=artist.getTopTracks&artist=${encodeURIComponent(name)}&api_key=${KEY}&format=json&limit=10`
  )
  const data = await res.json()
  if (data?.error) {
    console.error('[lastfm] getArtistTopTracks error:', data.error, data.message)
    return []
  }
  return data?.toptracks?.track ?? []
}

function slugToName(slug: string): string {
  return decodeURIComponent(slug).replace(/-/g, ' ')
}

export async function getTopTracks(countrySlug: string): Promise<Track[]> {
  'use cache'
  cacheLife('hours')

  const country = slugToName(countrySlug)
  const res = await fetch(
    `${BASE}?method=geo.getTopTracks&country=${encodeURIComponent(country)}&api_key=${KEY}&format=json&limit=10`
  )
  const data = await res.json()
  if (data?.error) {
    console.error('[lastfm] getTopTracks error:', data.error, data.message)
    return []
  }
  return data?.tracks?.track ?? []
}

export async function getTopArtists(countrySlug: string): Promise<Artist[]> {
  'use cache'
  cacheLife('hours')

  const country = slugToName(countrySlug)
  const res = await fetch(
    `${BASE}?method=geo.getTopArtists&country=${encodeURIComponent(country)}&api_key=${KEY}&format=json&limit=8`
  )
  const data = await res.json()
  if (data?.error) {
    console.error('[lastfm] getTopArtists error:', data.error, data.message)
    return []
  }
  return data?.topartists?.artist ?? []
}
