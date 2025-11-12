// app/[locale]/flow/page.tsx
import type { Metadata } from 'next'
import FlowContainer from '@/app/_containers/Flow/FlowContainer'
import { flowDictionaries, pickDictionary } from '@/app/dictionaries/mappings'
import StructuredData, { generateHowToStructuredData, generateBreadcrumbStructuredData } from '@/app/_components/common/StructuredData'
import { getOGLocale, generateAlternateLanguages, generateOGImages } from '@/app/lib/seo-helpers'

// 言語別キーワード
const getFlowKeywords = (locale: string): string[] => {
  const keywords: Record<string, string[]> = {
    ja: ['使い方', 'セットアップ', '始め方', 'チュートリアル', 'ガイド', '導入手順', 'データ処理 始め方', '操作方法', 'マニュアル', '初期設定'],
    'en-US': ['how to', 'setup', 'getting started', 'tutorial', 'guide', 'onboarding', 'data processing tutorial', 'instructions', 'manual', 'initial setup'],
    'zh-CN': ['如何使用', '设置', '入门', '教程', '指南', '入门步骤', '数据处理教程', '操作说明', '手册', '初始设置'],
    ko: ['사용 방법', '설정', '시작하기', '튜토리얼', '가이드', '도입 절차', '데이터 처리 튜토리얼', '사용 설명', '매뉴얼', '초기 설정'],
  };
  return keywords[locale] || keywords['en-US'];
};

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const dict = pickDictionary(flowDictionaries, resolvedParams.locale, 'en-US')
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com'
  
  return {
    title: dict.flow.hero.title || 'Flow | siftbeam',
    description: dict.flow.hero.subtitle || 'Step-by-step guide to getting started with siftbeam data processing platform',
    keywords: getFlowKeywords(resolvedParams.locale),
    alternates: {
      canonical: `${baseUrl}/${resolvedParams.locale}/flow`,
      languages: generateAlternateLanguages('/flow', baseUrl),
    },
    openGraph: {
      title: dict.flow.hero.title || 'Flow | siftbeam',
      description: dict.flow.hero.subtitle || 'Steps to get started with siftbeam',
      url: `${baseUrl}/${resolvedParams.locale}/flow`,
      type: 'website',
      locale: getOGLocale(resolvedParams.locale),
      siteName: 'siftbeam',
      images: generateOGImages(dict.flow.hero.title || 'Flow', baseUrl),
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.flow.hero.title || 'Flow | siftbeam',
      description: dict.flow.hero.subtitle || 'Steps to get started with siftbeam',
      images: [`${baseUrl}/og-image.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function FlowPage(
  props: { params: Promise<{ locale: string }> }
) {
  const params = await props.params
  const locale = params.locale
  
  // 構造化データ
  const howToData = generateHowToStructuredData(locale);
  const breadcrumbData = generateBreadcrumbStructuredData(locale, [
    { name: locale === 'ja' ? 'ホーム' : 'Home', url: `/${locale}` },
    { name: locale === 'ja' ? '使い方' : 'How to Use', url: `/${locale}/flow` }
  ]);
  
  return (
    <>
      <StructuredData data={howToData} />
      <StructuredData data={breadcrumbData} />
      <FlowContainer params={params} />
    </>
  )
}


