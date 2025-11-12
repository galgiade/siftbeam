import type { Metadata } from 'next'
import TermsContainer from '@/app/_containers/Terms/TermsContainer'
import { termsDictionaries, pickDictionary } from '@/app/dictionaries/mappings'
import StructuredData, { generateBreadcrumbStructuredData } from '@/app/_components/common/StructuredData'
import { getOGLocale, generateAlternateLanguages, generateOGImages } from '@/app/lib/seo-helpers'

// 言語別キーワード
const getTermsKeywords = (locale: string): string[] => {
  const keywords: Record<string, string[]> = {
    ja: ['利用規約', '規約', '契約条件', '利用条件', '法的事項', 'サービス規約', '使用条件', '約款', 'ユーザー規約', '同意事項'],
    'en-US': ['terms', 'terms of service', 'legal', 'terms and conditions', 'service agreement', 'usage terms', 'user agreement', 'terms of use', 'legal terms', 'service terms'],
    'zh-CN': ['服务条款', '条款', '法律条款', '使用条款', '服务协议', '用户协议', '法律事项', '条件', '服务条件', '用户条款'],
    ko: ['이용약관', '약관', '계약조건', '서비스 약관', '사용조건', '법적사항', '이용조건', '사용자 약관', '서비스 조건', '동의사항'],
  };
  return keywords[locale] || keywords['en-US'];
};

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const dict = pickDictionary(termsDictionaries, resolvedParams.locale, 'en-US')
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com'
  
  return {
    title: dict.title || 'Terms of Service | siftbeam',
    description: dict.intro || 'Terms of Service for siftbeam data processing platform. Read our service agreement and usage conditions.',
    keywords: getTermsKeywords(resolvedParams.locale),
    alternates: {
      canonical: `${baseUrl}/${resolvedParams.locale}/terms`,
      languages: generateAlternateLanguages('/terms', baseUrl),
    },
    openGraph: {
      title: dict.title || 'Terms of Service | siftbeam',
      description: dict.intro || 'Terms of Service for siftbeam',
      url: `${baseUrl}/${resolvedParams.locale}/terms`,
      type: 'website',
      locale: getOGLocale(resolvedParams.locale),
      siteName: 'siftbeam',
      images: generateOGImages(dict.title || 'Terms of Service', baseUrl),
    },
    twitter: {
      card: 'summary',
      title: dict.title || 'Terms of Service | siftbeam',
      description: dict.intro || 'Terms of Service for siftbeam',
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

export default async function TermsPage(
  props: { params: Promise<{ locale: string }> }
) {
  const params = await props.params
  const locale = params.locale
  
  // 構造化データ
  const breadcrumbData = generateBreadcrumbStructuredData(locale, [
    { name: locale === 'ja' ? 'ホーム' : 'Home', url: `/${locale}` },
    { name: locale === 'ja' ? '利用規約' : 'Terms of Service', url: `/${locale}/terms` }
  ]);
  
  return (
    <>
      <StructuredData data={breadcrumbData} />
      <TermsContainer params={params} />
    </>
  )
}


