import React from 'react';
import PricingPresentation from './PricingPresentation';
import type PricingLocale from '@/app/dictionaries/pricing/pricing.d.ts';
import { pricingDictionaries, pickDictionary } from '@/app/dictionaries/mappings';
import { DEFAULT_LOCALE, getValidLocale } from '@/app/utils/locale-utils';

export default function PricingContainer({ params }: { params: { locale: string } }) {
  // paramsからロケールを取得し、有効性をチェック
  const locale = getValidLocale(params.locale || DEFAULT_LOCALE);

  // 対応していないロケールの場合はデフォルト言語に
  const dictionary: PricingLocale = pickDictionary(pricingDictionaries, locale, 'en');
  return (
      <PricingPresentation locale={locale} dictionary={dictionary.pricing} />
  );
}
