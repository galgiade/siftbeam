import type { Metadata } from 'next'
import ServiceContainer from "@/app/_containers/Service/ServiceContainer"
import { userDictionaries, pickDictionary } from '@/app/dictionaries/mappings'

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params
  const dict = pickDictionary(userDictionaries, locale, 'en-US') as any
  const title = dict?.service?.title || 'AIサービス'
  const description = dict?.service?.description || 'ポリシーを選択してファイルをアップロードし、AI処理を実行できます。'
  return {
    title,
    description,
    openGraph: { title, description },
  }
}

export default async function servicePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <ServiceContainer locale={locale} />
}
