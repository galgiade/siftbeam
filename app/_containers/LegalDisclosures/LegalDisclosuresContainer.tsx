import React from 'react'
import LegalDisclosuresPresentation from './LegalDisclosuresPresentation'
import type LegalDisclosuresLocale from '@/app/dictionaries/legalDisclosures/legalDisclosures.d.ts'
import { legalDisclosuresDictionaries, pickDictionary } from '@/app/dictionaries/mappings'
import { DEFAULT_LOCALE, getValidLocale } from '@/app/utils/locale-utils'

export default function LegalDisclosuresContainer({ params }: { params: { locale: string } }) {
  // paramsからロケールを取得し、有効性をチェック
  const locale = getValidLocale(params.locale || DEFAULT_LOCALE)

  // 対応していないロケールの場合はデフォルト言語に
  const dictionary: LegalDisclosuresLocale = pickDictionary(legalDisclosuresDictionaries as Record<string, LegalDisclosuresLocale>, locale, 'en-US')
  return <LegalDisclosuresPresentation dictionary={dictionary} />
}
