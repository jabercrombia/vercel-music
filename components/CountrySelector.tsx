'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { countryDisplayNames } from '@/lib/countries'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function CountrySelector({ current }: { current: string }) {
  const t = useTranslations('Charts')
  const router = useRouter()
  const countries = Object.entries(countryDisplayNames).sort(([, a], [, b]) =>
    a.localeCompare(b)
  )

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="country-select" className="text-muted-foreground text-sm whitespace-nowrap">
        {t('browseByCountry')}
      </label>
      <Select value={current} onValueChange={(val) => router.push(`/trends/${val}`)}>
        <SelectTrigger id="country-select" className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {countries.map(([slug, name]) => (
            <SelectItem key={slug} value={slug}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
