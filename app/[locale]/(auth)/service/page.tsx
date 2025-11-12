import type { Metadata } from 'next'
import ServiceContainer from "@/app/_containers/Service/ServiceContainer"
import { userDictionaries, pickDictionary } from '@/app/dictionaries/mappings'

// 全言語対応のキーワード設定
const getServiceKeywordsByLocale = (locale: string): string[] => {
  const keywordMap = {
    ja: ['データ処理サービス', 'AIサービス', 'ファイル処理', 'データアップロード', 'ポリシー管理', 'データ分析', '自動処理', 'クラウド処理', 'ファイル管理', 'データ変換'],
    'en-US': ['data processing service', 'AI service', 'file processing', 'data upload', 'policy management', 'data analysis', 'automated processing', 'cloud processing', 'file management', 'data transformation'],
    'zh-CN': ['数据处理服务', 'AI服务', '文件处理', '数据上传', '策略管理', '数据分析', '自动处理', '云处理', '文件管理', '数据转换'],
    ko: ['데이터 처리 서비스', 'AI 서비스', '파일 처리', '데이터 업로드', '정책 관리', '데이터 분석', '자동 처리', '클라우드 처리', '파일 관리', '데이터 변환']
  };
  
  return keywordMap[locale as keyof typeof keywordMap] || keywordMap['en-US'];
};

const getLocaleByLanguage = (locale: string): string => {
  const localeMap = {
    ja: 'ja_JP',
    'en-US': 'en_US',
    'zh-CN': 'zh_CN',
    ko: 'ko_KR',
    fr: 'fr_FR',
    de: 'de_DE',
    es: 'es_ES',
    pt: 'pt_BR',
    id: 'id_ID'
  };
  
  return localeMap[locale as keyof typeof localeMap] || 'en_US';
};

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params
  const dict = pickDictionary(userDictionaries, locale, 'en-US') as any
  const title = dict?.service?.title || 'AIサービス'
  const description = dict?.service?.description || 'ポリシーを選択してファイルをアップロードし、AI処理を実行できます。'
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com'
  
  return {
    title: `${title} | siftbeam`,
    description,
    keywords: getServiceKeywordsByLocale(locale),
    alternates: {
      canonical: `${baseUrl}/${locale}/service`,
      languages: {
        'ja': `${baseUrl}/ja/service`,
        'en': `${baseUrl}/en/service`,
        'en-US': `${baseUrl}/en-US/service`,
        'zh-CN': `${baseUrl}/zh-CN/service`,
        'ko': `${baseUrl}/ko/service`,
      },
    },
    openGraph: { 
      title: `${title} | siftbeam`,
      description,
      url: `${baseUrl}/${locale}/service`,
      type: 'website',
      locale: getLocaleByLanguage(locale),
      siteName: 'siftbeam',
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | siftbeam`,
      description,
      images: [`${baseUrl}/og-image.jpg`],
    },
    robots: {
      index: false,  // サービスページは認証必要なのでインデックスしない
      follow: false,
    },
  }
}

export default async function servicePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <ServiceContainer locale={locale} />
}
