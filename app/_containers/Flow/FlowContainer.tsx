import React from 'react';
import FlowPresentation from './FlowPresentation';
import { DEFAULT_LOCALE, getValidLocale } from '@/app/utils/locale-utils';
import type { FlowLocale } from '@/app/dictionaries/flow/flow.d.ts';
import { flowDictionaries, pickDictionary } from '@/app/dictionaries/mappings';

export default function FlowContainer({ params }: { params: { locale: string } }) {
  // paramsからロケールを取得し、有効性をチェック
  const locale = getValidLocale(params.locale || DEFAULT_LOCALE);

  // フローページ用の辞書を取得
  const dictionary: FlowLocale = pickDictionary(flowDictionaries, locale, 'en');
  return (
      <FlowPresentation locale={locale} dictionary={dictionary.flow} />
  );
}
