/**
 * SEOメタデータ生成のヘルパー関数
 */

import type { Metadata } from 'next'

// ロケールマッピング（2文字コードに統一）
export const getOGLocale = (locale: string): string => {
  const localeMap: Record<string, string> = {
    ja: 'ja_JP',
    en: 'en_US',
    zh: 'zh_CN',
    ko: 'ko_KR',
    fr: 'fr_FR',
    de: 'de_DE',
    es: 'es_ES',
    pt: 'pt_BR',
    id: 'id_ID',
    // 後方互換性のため
    'en-US': 'en_US',
    'zh-CN': 'zh_CN'
  };
  
  return localeMap[locale] || 'en_US';
};

// 全言語の代替URLを生成（2文字コードに統一）
export const generateAlternateLanguages = (path: string, baseUrl?: string, includeXDefault: boolean = false): Record<string, string> => {
  const url = baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com';
  const languages = ['ja', 'en', 'zh', 'ko', 'fr', 'de', 'es', 'pt', 'id'];
  
  const result = languages.reduce((acc, lang) => {
    acc[lang] = `${url}/${lang}${path}`;
    return acc;
  }, {} as Record<string, string>);
  
  // x-defaultを追加（英語版をデフォルトとする）
  if (includeXDefault) {
    result['x-default'] = `${url}/en${path}`;
  }
  
  return result;
};

// OGP画像設定
export const generateOGImages = (title: string, baseUrl?: string) => {
  const url = baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com';
  
  return [
    {
      url: `${url}/og-image.jpg`,
      width: 1200,
      height: 630,
      alt: title,
    },
  ];
};

// 完全なメタデータ生成
interface GenerateMetadataOptions {
  locale: string;
  title: string;
  description: string;
  keywords: string[];
  path: string;
  noIndex?: boolean;
}

export function generatePageMetadata(options: GenerateMetadataOptions): Metadata {
  const {
    locale,
    title,
    description,
    keywords,
    path,
    noIndex = false
  } = options;
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com';
  const fullUrl = `${baseUrl}/${locale}${path}`;
  
  return {
    title: `${title} | siftbeam`,
    description,
    keywords,
    alternates: {
      canonical: fullUrl,
      languages: generateAlternateLanguages(path, baseUrl),
    },
    openGraph: {
      title: `${title} | siftbeam`,
      description,
      url: fullUrl,
      type: 'website',
      locale: getOGLocale(locale),
      siteName: 'siftbeam',
      images: generateOGImages(title, baseUrl),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | siftbeam`,
      description,
      images: [`${baseUrl}/og-image.jpg`],
    },
    robots: noIndex ? {
      index: false,
      follow: false,
    } : {
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

// よく使うキーワードセット（2文字コードに統一）
export const commonKeywords = {
  dataProcessing: {
    ja: ['データ処理', 'データ管理', 'クラウド処理', 'ファイル処理', 'データ分析'],
    en: ['data processing', 'data management', 'cloud processing', 'file processing', 'data analysis'],
    zh: ['数据处理', '数据管理', '云处理', '文件处理', '数据分析'],
    ko: ['데이터 처리', '데이터 관리', '클라우드 처리', '파일 처리', '데이터 분석'],
  },
  enterprise: {
    ja: ['企業向け', 'ビジネス', 'エンタープライズ', 'B2B'],
    en: ['enterprise', 'business', 'B2B', 'corporate'],
    zh: ['企业', '商业', 'B2B', '企业级'],
    ko: ['기업', '비즈니스', 'B2B', '엔터프라이즈'],
  },
};

export function getKeywords(locale: string, category: keyof typeof commonKeywords): string[] {
  return commonKeywords[category][locale as keyof typeof commonKeywords[typeof category]] || commonKeywords[category]['en'];
}

