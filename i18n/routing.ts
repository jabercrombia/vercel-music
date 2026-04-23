import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'es', 'no', 'it'],
  defaultLocale: 'en',
})
