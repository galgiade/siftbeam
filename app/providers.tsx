'use client'

import { HeroUIProvider } from "@heroui/react"
import { usePathname } from 'next/navigation'

const localeMap = {
  'en': 'en-US',
  'ja': 'ja-JP',
  'zh': 'zh-CN',
  'ko': 'ko-KR',
  'fr': 'fr-FR',
  'de': 'de-DE',
  'es': 'es-ES',
  'pt': 'pt-BR',
  'id': 'id-ID'
}

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const pathLocale = pathname.split('/')[1]
  const locale = localeMap[pathLocale as keyof typeof localeMap] || 'ja-JP'

  return (
    <HeroUIProvider locale={locale}>
      {children}
    </HeroUIProvider>
  )
}