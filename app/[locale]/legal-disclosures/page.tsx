import type { Metadata } from 'next'
import LegalDisclosuresContainer from '@/app/_containers/LegalDisclosures/LegalDisclosuresContainer'
import { legalDisclosuresDictionaries, pickDictionary } from '@/app/dictionaries/mappings'
import StructuredData, { generateBreadcrumbStructuredData } from '@/app/_components/common/StructuredData'
import { getOGLocale, generateAlternateLanguages, generateOGImages } from '@/app/lib/seo-helpers'

// 言語別キーワード
const getLegalKeywords = (locale: string): string[] => {
  const keywords: Record<string, string[]> = {
    ja: ['特定商取引法', '法的表示', '会社情報', '事業者情報', '運営者情報', '法令遵守', '商取引法', '事業者表示', '法的事項', '企業情報'],
    'en-US': ['legal disclosures', 'business terms', 'company information', 'legal notice', 'business information', 'compliance', 'legal terms', 'corporate information', 'legal matters', 'business details'],
    'zh-CN': ['法律披露', '商业条款', '公司信息', '法律声明', '商业信息', '合规', '法律条款', '企业信息', '法律事项', '商业详情'],
    ko: ['법적 공시', '사업자 정보', '회사 정보', '법적 고지', '사업 정보', '규정 준수', '법적 조항', '기업 정보', '법적 사항', '사업 세부사항'],
  };
  return keywords[locale] || keywords['en-US'];
};

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const dict = pickDictionary(legalDisclosuresDictionaries, resolvedParams.locale, 'en-US')
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com'
  
  return {
    title: dict.title || 'Legal Disclosures | siftbeam',
    description: dict.intro || 'Legal disclosures and business terms for siftbeam data processing platform',
    keywords: getLegalKeywords(resolvedParams.locale),
    alternates: {
      canonical: `${baseUrl}/${resolvedParams.locale}/legal-disclosures`,
      languages: generateAlternateLanguages('/legal-disclosures', baseUrl),
    },
    openGraph: {
      title: dict.title || 'Legal Disclosures | siftbeam',
      description: dict.intro || 'Legal disclosures and business terms for siftbeam',
      url: `${baseUrl}/${resolvedParams.locale}/legal-disclosures`,
      type: 'website',
      locale: getOGLocale(resolvedParams.locale),
      siteName: 'siftbeam',
      images: generateOGImages(dict.title || 'Legal Disclosures', baseUrl),
    },
    twitter: {
      card: 'summary',
      title: dict.title || 'Legal Disclosures | siftbeam',
      description: dict.intro || 'Legal disclosures and business terms for siftbeam',
      images: [`${baseUrl}/og-image.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  }
}

export default async function LegalDisclosuresPage(
  props: { params: Promise<{ locale: string }> }
) {
  const params = await props.params
  const locale = params.locale
  
  // 構造化データ
  const breadcrumbData = generateBreadcrumbStructuredData(locale, [
    { name: locale === 'ja' ? 'ホーム' : 'Home', url: `/${locale}` },
    { name: locale === 'ja' ? '特定商取引法に基づく表記' : 'Legal Disclosures', url: `/${locale}/legal-disclosures` }
  ]);
  
  return (
    <>
      <StructuredData data={breadcrumbData} />
      <LegalDisclosuresContainer params={params} />
    </>
  )
}
