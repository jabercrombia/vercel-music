import { getTranslations } from 'next-intl/server'
import { countryDisplayNames, countryFlags } from '@/lib/countries'

export default async function NowTrendingHero({ country }: { country: string }) {
  const t = await getTranslations('Hero')
  const displayName = countryDisplayNames[country] ?? country
  const flag = countryFlags[country] ?? '🌍'

  return (
    <div className="bg-gradient-to-b from-[#1a0a0a] to-[#0a0a0a] px-4 pt-12 pb-8">
      <div className="max-w-5xl mx-auto">
        <p className="text-[#e4132d] text-sm font-semibold tracking-widest uppercase mb-2">
          {t('badge')}
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
          {flag} {t('heading', { country: displayName })}
        </h1>
        <p className="mt-3 text-zinc-400 text-base">{t('subheading')}</p>
      </div>
    </div>
  )
}
