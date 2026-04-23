# API Reference

## Last.fm Endpoints

Base URL: `https://ws.audioscrobbler.com/2.0/`

All requests require `&format=json` and `&api_key={LASTFM_API_KEY}`.

---

### `geo.getTopTracks`

Returns the top tracks for a given country.

```
GET /?method=geo.getTopTracks&country={country}&api_key={key}&format=json&limit=20
```

| Parameter | Type | Description |
|---|---|---|
| `country` | string | Full country name, space-separated lowercase (e.g. `united states`) |
| `limit` | number | Max results. App uses `20`. |

**Response shape used:**
```ts
{
  tracks: {
    track: Track[]
  }
}
```

**`Track` type:**
```ts
interface Track {
  name: string
  artist: { name: string }
  listeners: string          // numeric string
  image: Image[]
  url: string
}
```

---

### `geo.getTopArtists`

Returns the top artists for a given country.

```
GET /?method=geo.getTopArtists&country={country}&api_key={key}&format=json&limit=10
```

| Parameter | Type | Description |
|---|---|---|
| `country` | string | Full country name, space-separated lowercase |
| `limit` | number | Max results. App uses `10`. |

**Response shape used:**
```ts
{
  topartists: {
    artist: Artist[]
  }
}
```

**`Artist` type:**
```ts
interface Artist {
  name: string
  listeners: string          // numeric string
  image: Image[]
  url: string
}
```

---

### `artist.getInfo`

Returns metadata and bio for a named artist.

```
GET /?method=artist.getInfo&artist={name}&api_key={key}&format=json&lang={locale}
```

| Parameter | Type | Description |
|---|---|---|
| `artist` | string | Artist name (URL-encoded) |
| `lang` | string | ISO 639-1 locale code for bio translation (e.g. `es`, `no`). Optional — defaults to English. |

**Response shape used:**
```ts
{
  artist: {
    name: string
    listeners: string
    playcount: string
    url: string
    image: Image[]
    bio: { summary: string; content: string }
    similar: { artist: SimilarArtist[] }
    tags: { tag: Tag[] }
  }
}
```

---

### `artist.getTopTracks`

Returns the most-played tracks for a named artist.

```
GET /?method=artist.getTopTracks&artist={name}&api_key={key}&format=json&limit=10
```

| Parameter | Type | Description |
|---|---|---|
| `artist` | string | Artist name (URL-encoded) |
| `limit` | number | Max results. App uses `10`. |

**Response shape used:**
```ts
{
  toptracks: {
    track: Track[]   // Track.listeners may be absent; playcount is present instead
  }
}
```

---

### Shared types

```ts
interface Image {
  '#text': string   // image URL (empty string when unavailable)
  size: 'small' | 'medium' | 'large' | 'extralarge'
}
```

### Error responses

Last.fm returns HTTP `200` even on errors. The app checks for the `error` field:

```ts
{ error: number; message: string }
```

Common error codes:

| Code | Meaning |
|---|---|
| `6` | Artist / country not found |
| `10` | Invalid API key |
| `29` | Rate limit exceeded |

---

## App Routes

| Route | Description |
|---|---|
| `/` | Edge rewrite → `/[locale]/trends/[country]` |
| `/[locale]` | Redirects to `/[locale]/trends/united-states` |
| `/[locale]/trends/[country]` | ISR chart page for a country |
| `/[locale]/artist/[name]` | ISR artist detail page |

**Supported locales:** `en`, `es`, `no`, `it`

**Supported countries (`[country]` slug):**

| Slug | Display Name | ISO |
|---|---|---|
| `united-states` | United States | US |
| `united-kingdom` | United Kingdom | GB |
| `australia` | Australia | AU |
| `mexico` | Mexico | MX |
| `spain` | Spain | ES |
| `norway` | Norway | NO |
| `italy` | Italy | IT |

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `LASTFM_API_KEY` | Yes | Last.fm API key. Get one free at [last.fm/api/account/create](https://www.last.fm/api/account/create). |

Set in `.env.local` for local development:

```
LASTFM_API_KEY=your_api_key_here
```

Set in **Vercel Dashboard → Project → Settings → Environment Variables** for production.
