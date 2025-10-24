import React from 'react'
import TermsPresentation from './TermsPresentation'
import type TermsLocale from '@/app/dictionaries/terms/TermsLocale.d.ts'
import { termsDictionaries, pickDictionary } from '@/app/dictionaries/mappings'
import { DEFAULT_LOCALE, getValidLocale } from '@/app/utils/locale-utils'

export default function TermsContainer({ params }: { params: { locale: string } }) {
  // paramsからロケールを取得し、有効性をチェック
  const locale = getValidLocale(params.locale || DEFAULT_LOCALE)

  // 対応していないロケールの場合はデフォルト言語に
  const dictionary: TermsLocale = pickDictionary(termsDictionaries as Record<string, TermsLocale>, locale, 'en-US')
  return <TermsPresentation dictionary={dictionary} />
}
