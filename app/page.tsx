import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { getPreferredLocale, DEFAULT_LOCALE, isSearchEngineBot } from '@/app/utils/locale-utils';
import HomeContainer from '@/app/_containers/Home/HomeContainer';
import { homeDictionaries, pickDictionary } from '@/app/dictionaries/mappings';
import StructuredData, { generateSiftbeamStructuredData, generateOrganizationStructuredData, generateServiceStructuredData } from '@/app/_components/common/StructuredData';
import type { Metadata } from 'next';

// 検索エンジンボットの場合は動的レンダリングを許可
export const dynamic = 'force-dynamic';
export const dynamicParams = false;

// 検索エンジンボット用のメタデータ
export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com';
  const dict = pickDictionary(homeDictionaries, DEFAULT_LOCALE, 'en');
  
  return {
    title: dict.hero.title || 'siftbeam',
    description: dict.hero.subtitle || 'AI-powered business insights platform',
    alternates: {
      canonical: `${baseUrl}/`,
      languages: {
        'x-default': `${baseUrl}/en`,
        'ja': `${baseUrl}/ja`,
        'en': `${baseUrl}/en`,
        'zh': `${baseUrl}/zh`,
        'ko': `${baseUrl}/ko`,
        'fr': `${baseUrl}/fr`,
        'de': `${baseUrl}/de`,
        'es': `${baseUrl}/es`,
        'pt': `${baseUrl}/pt`,
        'id': `${baseUrl}/id`,
      },
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
  };
}

export default async function RootPage() {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const acceptLanguage = headersList.get('accept-language') || '';
  
  // 検索エンジンボットの場合は、リダイレクトせずにデフォルトロケールのコンテンツを返す
  if (isSearchEngineBot(userAgent)) {
    const locale = DEFAULT_LOCALE;
    const params = { locale };
    
    // 構造化データの生成
    const structuredData = generateSiftbeamStructuredData(locale);
    const organizationData = generateOrganizationStructuredData(locale);
    const serviceData = generateServiceStructuredData(locale);
    
    return (
      <>
        {/* 構造化データ */}
        <StructuredData data={structuredData} />
        <StructuredData data={organizationData} />
        <StructuredData data={serviceData} />
        
        <HomeContainer params={params} />
      </>
    );
  }
  
  // 通常のユーザーの場合は、従来通りリダイレクト
  const locale = getPreferredLocale(acceptLanguage);
  redirect(`/${locale}`);
} 