// app/[locale]/flow/page.tsx
import type { Metadata } from 'next'
import FlowContainer from '@/app/_containers/Flow/FlowContainer'
import { flowDictionaries, pickDictionary } from '@/app/dictionaries/mappings'

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const dict = pickDictionary(flowDictionaries, resolvedParams.locale, 'en-US')
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com'
  
  return {
    title: dict.flow.hero.title || 'Flow | siftbeam',
    description: dict.flow.hero.subtitle || 'Steps to get started with siftbeam',
    keywords: ['使い方', 'セットアップ', '始め方', 'チュートリアル', 'how to', 'setup', 'getting started', 'tutorial'],
    alternates: {
      canonical: `${baseUrl}/${resolvedParams.locale}/flow`,
    },
    openGraph: {
      title: dict.flow.hero.title || 'Flow | siftbeam',
      description: dict.flow.hero.subtitle || 'Steps to get started with siftbeam',
      url: `${baseUrl}/${resolvedParams.locale}/flow`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.flow.hero.title || 'Flow | siftbeam',
      description: dict.flow.hero.subtitle || 'Steps to get started with siftbeam',
    },
  }
}

export default async function FlowPage(
  props: { params: Promise<{ locale: string }> }
) {
  const params = await props.params
  return <FlowContainer params={params} />
}


