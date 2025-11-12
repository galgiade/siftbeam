import type { Metadata } from 'next'
import PrivacyContainer from '@/app/_containers/Privacy/PrivacyContainer'
import { privacyDictionaries, pickDictionary } from '@/app/dictionaries/mappings'
import StructuredData, { generateBreadcrumbStructuredData } from '@/app/_components/common/StructuredData'
import { getOGLocale, generateAlternateLanguages, generateOGImages } from '@/app/lib/seo-helpers'

// 言語別キーワード
const getPrivacyKeywords = (locale: string): string[] => {
  const keywords: Record<string, string[]> = {
    ja: ['プライバシーポリシー', '個人情報保護', 'プライバシー', '個人情報', 'データ保護', '情報保護方針', '個人データ', 'プライバシー保護', 'セキュリティ', 'データ管理'],
    'en-US': ['privacy policy', 'privacy', 'data protection', 'personal data', 'data privacy', 'information protection', 'personal information', 'privacy protection', 'security', 'data management'],
    'zh-CN': ['隐私政策', '隐私保护', '数据保护', '个人信息', '隐私', '信息保护', '个人数据', '隐私安全', '安全', '数据管理'],
    ko: ['개인정보처리방침', '개인정보보호', '프라이버시', '개인정보', '데이터 보호', '정보보호', '개인데이터', '프라이버시 보호', '보안', '데이터 관리'],
  };
  return keywords[locale] || keywords['en-US'];
};

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const dict = pickDictionary(privacyDictionaries, resolvedParams.locale, 'en-US')
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com'
  
  return {
    title: dict.title || 'Privacy Policy | siftbeam',
    description: dict.intro || 'Privacy Policy for siftbeam - Learn how we collect, use, and protect your personal data.',
    keywords: getPrivacyKeywords(resolvedParams.locale),
    alternates: {
      canonical: `${baseUrl}/${resolvedParams.locale}/privacy`,
      languages: generateAlternateLanguages('/privacy', baseUrl),
    },
    openGraph: {
      title: dict.title || 'Privacy Policy | siftbeam',
      description: dict.intro || 'Privacy Policy for siftbeam',
      url: `${baseUrl}/${resolvedParams.locale}/privacy`,
      type: 'website',
      locale: getOGLocale(resolvedParams.locale),
      siteName: 'siftbeam',
      images: generateOGImages(dict.title || 'Privacy Policy', baseUrl),
    },
    twitter: {
      card: 'summary',
      title: dict.title || 'Privacy Policy | siftbeam',
      description: dict.intro || 'Privacy Policy for siftbeam',
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

export default async function PrivacyPage(
  props: { params: Promise<{ locale: string }> }
) {
  const params = await props.params
  const locale = params.locale
  
  // 構造化データ
  const breadcrumbData = generateBreadcrumbStructuredData(locale, [
    { name: locale === 'ja' ? 'ホーム' : 'Home', url: `/${locale}` },
    { name: locale === 'ja' ? 'プライバシーポリシー' : 'Privacy Policy', url: `/${locale}/privacy` }
  ]);
  
  return (
    <>
      <StructuredData data={breadcrumbData} />
      <PrivacyContainer params={params} />
    </>
  )
}


