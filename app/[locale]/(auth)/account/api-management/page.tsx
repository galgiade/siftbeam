import type { Metadata } from 'next'
import APIManagementContainer from "@/app/_containers/ApiKeys/ApiKeyManagementContainer";
import { pickDictionary } from '@/app/dictionaries/mappings'
import type APILocale from '@/app/dictionaries/api/api.d'
import jaApi from '@/app/dictionaries/api/ja'
import enApi from '@/app/dictionaries/api/en'
import frApi from '@/app/dictionaries/api/fr'
import deApi from '@/app/dictionaries/api/de'
import koApi from '@/app/dictionaries/api/ko'
import esApi from '@/app/dictionaries/api/es'
import ptApi from '@/app/dictionaries/api/pt'
import idApi from '@/app/dictionaries/api/id'
import zhCNApi from '@/app/dictionaries/api/zh-CN'

const apiDictionaries: Record<string, APILocale> = {
  ja: jaApi,
  en: enApi,
  'en-US': enApi,
  fr: frApi,
  de: deApi,
  ko: koApi,
  es: esApi,
  pt: ptApi,
  id: idApi,
  zh: zhCNApi,
  'zh-CN': zhCNApi,
}

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params
  const dict = pickDictionary(apiDictionaries, locale, 'en')
  return {
    title: 'API Management',
    description: dict.errors.api?.validationFailed || 'Manage your API keys and access policies',
    openGraph: {
      title: 'API Management',
      description: dict.errors.api?.validationFailed || 'Manage your API keys and access policies',
    },
  }
}

export default async function APIManagementPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    return <APIManagementContainer locale={locale}/>
}

