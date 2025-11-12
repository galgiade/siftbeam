// app/[locale]/pricing/page.tsx
import type { Metadata } from 'next'
import PricingContainer from '@/app/_containers/Pricing/PricingContainer'
import { pricingDictionaries, pickDictionary } from '@/app/dictionaries/mappings'
import StructuredData, { generatePricingStructuredData, generateBreadcrumbStructuredData } from '@/app/_components/common/StructuredData'
import { generatePageMetadata, getOGLocale, generateAlternateLanguages, generateOGImages } from '@/app/lib/seo-helpers'

// 言語別キーワード
const getPricingKeywords = (locale: string): string[] => {
  const keywords: Record<string, string[]> = {
    ja: ['料金', '価格', 'プラン', '従量課金', 'コスト', '料金プラン', 'データ処理 料金', '企業向け料金', '見積もり', '価格表'],
    'en-US': ['pricing', 'price', 'plans', 'pay-as-you-go', 'cost', 'pricing plans', 'data processing pricing', 'enterprise pricing', 'quote', 'price list'],
    'zh-CN': ['价格', '定价', '计划', '按量付费', '成本', '价格计划', '数据处理价格', '企业定价', '报价', '价格表'],
    ko: ['가격', '요금', '플랜', '종량제', '비용', '가격 플랜', '데이터 처리 가격', '기업 가격', '견적', '가격표'],
  };
  return keywords[locale] || keywords['en-US'];
};

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const dict = pickDictionary(pricingDictionaries, resolvedParams.locale, 'en-US')
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com'
  
  return {
    title: `${dict.pricing.hero.titleSub} | siftbeam` || 'Pricing | siftbeam',
    description: dict.pricing.hero.subtitle || 'Pay-as-you-go data processing service with transparent pricing. No setup fees, no monthly base charges.',
    keywords: getPricingKeywords(resolvedParams.locale),
    alternates: {
      canonical: `${baseUrl}/${resolvedParams.locale}/pricing`,
      languages: generateAlternateLanguages('/pricing', baseUrl),
    },
    openGraph: {
      title: `${dict.pricing.hero.titleSub} | siftbeam` || 'Pricing | siftbeam',
      description: dict.pricing.hero.subtitle || 'siftbeam pricing information',
      url: `${baseUrl}/${resolvedParams.locale}/pricing`,
      type: 'website',
      locale: getOGLocale(resolvedParams.locale),
      siteName: 'siftbeam',
      images: generateOGImages(dict.pricing.hero.titleSub || 'Pricing', baseUrl),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${dict.pricing.hero.titleSub} | siftbeam` || 'Pricing | siftbeam',
      description: dict.pricing.hero.subtitle || 'siftbeam pricing information',
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

export default async function PricingPage(
  props: { params: Promise<{ locale: string }> }
) {
  const params = await props.params
  const locale = params.locale
  
  // 構造化データ
  const pricingData = generatePricingStructuredData(locale);
  const breadcrumbData = generateBreadcrumbStructuredData(locale, [
    { name: locale === 'ja' ? 'ホーム' : 'Home', url: `/${locale}` },
    { name: locale === 'ja' ? '料金' : 'Pricing', url: `/${locale}/pricing` }
  ]);
  
  return (
    <>
      <StructuredData data={pricingData} />
      <StructuredData data={breadcrumbData} />
      <PricingContainer params={params} />
    </>
  )
}


