import React from 'react'
import PrivacyPresentation from './PrivacyPresentation'
import type PrivacyLocale from '@/app/dictionaries/privacy/PrivacyLocale.d.ts'
import { privacyDictionaries, pickDictionary } from '@/app/dictionaries/mappings'
import { DEFAULT_LOCALE, getValidLocale } from '@/app/utils/locale-utils'

export default function PrivacyContainer({ params }: { params: { locale: string } }) {
  // paramsからロケールを取得し、有効性をチェック
  const locale = getValidLocale(params.locale || DEFAULT_LOCALE)

  // 対応していないロケールの場合はデフォルト言語に
  const dictionary: PrivacyLocale = pickDictionary(privacyDictionaries, locale, 'en-US')
  return <PrivacyPresentation dictionary={dictionary} />
}
