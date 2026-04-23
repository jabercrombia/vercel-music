'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { countryDisplayNames } from '@/lib/countries'

export default function CountrySelector({ current }: { current: string }) {
  const t = useTranslations('Charts')
  const router = useRouter()
  const countries = Object.entries(countryDisplayNames).sort(([, a], [, b]) =>
    a.localeCompare(b)
  )

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="country-select" className="text-zinc-400 text-sm whitespace-nowrap">
        {t('browseByCountry')}
      </label>
      <select
        id="country-select"
        value={current}
        onChange={(e) => router.push(`/trends/${e.target.value}`)}
        className="bg-zinc-800 text-white border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e4132d] cursor-pointer"
      >
        {countries.map(([slug, name]) => (
          <option key={slug} value={slug}>
            {name}
          </option>
        ))}
      </select>
    </div>
  )
}
