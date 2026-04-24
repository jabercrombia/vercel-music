import { cacheLife } from 'next/cache'

const BASE = 'https://app.ticketmaster.com/discovery/v2/events.json'
const KEY = process.env.TICKETMASTER_API_KEY

export interface Concert {
  id: string
  name: string
  url: string
  date: string
  time?: string
  venue: string
  city: string
  country: string
}

export async function getConcerts(artistName: string): Promise<Concert[]> {
  'use cache'
  cacheLife('days') // set to days assuming ticketmaster updates new concerts at midnight/daily

  if (!KEY) return []

  const res = await fetch(
    `${BASE}?keyword=${encodeURIComponent(artistName)}&apikey=${KEY}&size=5&sort=date,asc&classificationName=music`
  )

  if (!res.ok) return []

  const data = await res.json()
  const events = data?._embedded?.events ?? []

  return events.map((e: any) => ({
    id: e.id,
    name: e.name,
    url: e.url,
    date: e.dates?.start?.localDate ?? '',
    time: e.dates?.start?.localTime,
    venue: e._embedded?.venues?.[0]?.name ?? '',
    city: e._embedded?.venues?.[0]?.city?.name ?? '',
    country: e._embedded?.venues?.[0]?.country?.name ?? '',
  }))
}
