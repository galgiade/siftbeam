/**
 * SEOメタデータ生成のヘルパー関数
 * 
 * 各ページで一貫したメタデータを簡単に生成するためのユーティリティ
 */

import type { Metadata } from 'next'

// 全言語対応のロケールマッピング
export const getLocaleByLanguage = (locale: string): string => {
  const localeMap: Record<string, string> = {
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
  
  return localeMap[locale] || 'en_US';
};

// 全言語の代替URLを生成
export const generateAlternateLanguages = (path: string): Record<string, string> => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com';
  const languages = ['ja', 'en', 'en-US', 'zh-CN', 'ko', 'fr', 'de', 'es', 'pt', 'id'];
  
  return languages.reduce((acc, lang) => {
    acc[lang] = `${baseUrl}/${lang}${path}`;
    return acc;
  }, {} as Record<string, string>);
};

// 標準的なOGP画像設定を生成
export const generateOGImage = (title: string, baseUrl?: string) => {
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

// ページメタデータ生成のための共通設定
interface GeneratePageMetadataOptions {
  locale: string;
  title: string;
  description: string;
  keywords: string[];
  path: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
}

/**
 * ページのメタデータを生成
 * 
 * @param options メタデータ生成オプション
 * @returns Next.js Metadata オブジェクト
 */
export function generatePageMetadata(options: GeneratePageMetadataOptions): Metadata {
  const {
    locale,
    title,
    description,
    keywords,
    path,
    type = 'website',
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
      languages: generateAlternateLanguages(path),
    },
    openGraph: {
      title: `${title} | siftbeam`,
      description,
      url: fullUrl,
      type,
      locale: getLocaleByLanguage(locale),
      siteName: 'siftbeam',
      images: generateOGImage(title, baseUrl),
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

// よく使われるキーワードセットの定義
export const commonKeywordsByLocale = {
  dataProcessing: {
    ja: ['データ処理', 'データ管理', 'クラウド処理', 'ファイル処理', 'データ分析'],
    'en-US': ['data processing', 'data management', 'cloud processing', 'file processing', 'data analysis'],
    'zh-CN': ['数据处理', '数据管理', '云处理', '文件处理', '数据分析'],
    ko: ['데이터 처리', '데이터 관리', '클라우드 처리', '파일 처리', '데이터 분석'],
    fr: ['traitement de données', 'gestion de données', 'traitement cloud', 'traitement de fichiers', 'analyse de données'],
    de: ['Datenverarbeitung', 'Datenverwaltung', 'Cloud-Verarbeitung', 'Dateiverarbeitung', 'Datenanalyse'],
    es: ['procesamiento de datos', 'gestión de datos', 'procesamiento en la nube', 'procesamiento de archivos', 'análisis de datos'],
    pt: ['processamento de dados', 'gerenciamento de dados', 'processamento em nuvem', 'processamento de arquivos', 'análise de dados'],
    id: ['pemrosesan data', 'manajemen data', 'pemrosesan cloud', 'pemrosesan file', 'analisis data']
  },
  enterprise: {
    ja: ['企業向け', 'ビジネス', 'エンタープライズ', '法人向け', 'B2B'],
    'en-US': ['enterprise', 'business', 'corporate', 'B2B', 'professional'],
    'zh-CN': ['企业', '商业', '企业级', 'B2B', '专业'],
    ko: ['기업', '비즈니스', '엔터프라이즈', 'B2B', '전문'],
    fr: ['entreprise', 'business', 'professionnel', 'B2B', 'corporate'],
    de: ['Unternehmen', 'Business', 'Enterprise', 'B2B', 'professionell'],
    es: ['empresa', 'negocio', 'corporativo', 'B2B', 'profesional'],
    pt: ['empresa', 'negócio', 'corporativo', 'B2B', 'profissional'],
    id: ['perusahaan', 'bisnis', 'korporat', 'B2B', 'profesional']
  },
  security: {
    ja: ['セキュリティ', 'セキュア', '安全', '暗号化', 'データ保護'],
    'en-US': ['security', 'secure', 'safe', 'encryption', 'data protection'],
    'zh-CN': ['安全', '加密', '数据保护', '安全性', '保护'],
    ko: ['보안', '안전', '암호화', '데이터 보호', '보호'],
    fr: ['sécurité', 'sécurisé', 'chiffrement', 'protection des données', 'sûr'],
    de: ['Sicherheit', 'sicher', 'Verschlüsselung', 'Datenschutz', 'geschützt'],
    es: ['seguridad', 'seguro', 'cifrado', 'protección de datos', 'protegido'],
    pt: ['segurança', 'seguro', 'criptografia', 'proteção de dados', 'protegido'],
    id: ['keamanan', 'aman', 'enkripsi', 'perlindungan data', 'terlindungi']
  }
};

/**
 * 言語に応じたキーワードセットを取得
 * 
 * @param locale 言語コード
 * @param category キーワードカテゴリ
 * @returns キーワード配列
 */
export function getKeywordsByCategory(
  locale: string,
  category: keyof typeof commonKeywordsByLocale
): string[] {
  const keywords = commonKeywordsByLocale[category];
  const normalizedLocale = locale === 'en' ? 'en-US' : locale;
  return keywords[normalizedLocale as keyof typeof keywords] || keywords['en-US'];
}

/**
 * 複数のカテゴリからキーワードを結合
 * 
 * @param locale 言語コード
 * @param categories キーワードカテゴリの配列
 * @returns 結合されたキーワード配列
 */
export function combineKeywords(
  locale: string,
  ...categories: Array<keyof typeof commonKeywordsByLocale>
): string[] {
  return categories.flatMap(category => getKeywordsByCategory(locale, category));
}

