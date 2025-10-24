import React from 'react';
import HomePresentation from './HomePresentation';
import type HomeLocale from '@/app/dictionaries/home/Homelocale';
import { homeDictionaries, pickDictionary } from '@/app/dictionaries/mappings';
import { DEFAULT_LOCALE, getValidLocale } from '@/app/utils/locale-utils';

export default function HomeContainer({ params }: { params: { locale: string } }) {
  // paramsからロケールを取得し、有効性をチェック
  const locale = getValidLocale(params.locale || DEFAULT_LOCALE);

  // 対応していないロケールの場合はデフォルト言語に
  const dictionary: HomeLocale = pickDictionary(homeDictionaries, locale, 'en');
  return (
      <HomePresentation locale={locale} dictionary={dictionary} />
  );
}
