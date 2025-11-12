import { Metadata } from 'next';

/**
 * Open Graphのロケール形式に変換
 * @param locale - アプリケーションのロケール文字列
 * @returns OGP用のロケール文字列 (例: 'ja_JP', 'en_US')
 */
export function getOGLocale(locale: string): string {
  const localeMap: Record<string, string> = {
    ja: 'ja_JP',
    'en-US': 'en_US',
    en: 'en_US',
    'zh-CN': 'zh_CN',
    zh: 'zh_CN',
    ko: 'ko_KR',
    fr: 'fr_FR',
    de: 'de_DE',
    es: 'es_ES',
    pt: 'pt_BR',
    id: 'id_ID',
  };
  
  return localeMap[locale] || 'en_US';
}

/**
 * 多言語対応のalternate言語リンクを生成
 * @param path - ページのパス (例: '/pricing', '/flow')
 * @param baseUrl - ベースURL (デフォルト: 'https://siftbeam.com')
 * @returns alternates.languages オブジェクト
 */
export function generateAlternateLanguages(
  path: string,
  baseUrl: string = 'https://siftbeam.com'
): Record<string, string> {
  const languages = ['ja', 'en', 'en-US', 'zh-CN', 'ko', 'fr', 'de', 'es', 'pt', 'id'];
  
  const alternates: Record<string, string> = {};
  languages.forEach(lang => {
    alternates[lang] = `${baseUrl}/${lang}${path}`;
  });
  
  return alternates;
}

/**
 * OGP画像の設定を生成
 * @param title - 画像のaltテキスト
 * @param baseUrl - ベースURL (デフォルト: 'https://siftbeam.com')
 * @returns OGP画像の配列
 */
export function generateOGImages(
  title: string,
  baseUrl: string = 'https://siftbeam.com'
): Array<{ url: string; width: number; height: number; alt: string }> {
  return [
    {
      url: `${baseUrl}/og-image.jpg`,
      width: 1200,
      height: 630,
      alt: title,
    },
  ];
}

/**
 * ページメタデータを生成するヘルパー関数
 * @param options - メタデータ生成のオプション
 * @returns Next.js Metadataオブジェクト
 */
export function generatePageMetadata({
  locale,
  title,
  description,
  keywords,
  path,
  baseUrl = 'https://siftbeam.com',
  ogType = 'website',
  robotsIndex = true,
  robotsFollow = true,
  googleBotMaxSnippet = -1,
  googleBotMaxImagePreview = 'large',
  googleBotMaxVideoPreview = -1,
}: {
  locale: string;
  title: string;
  description: string;
  keywords: string[];
  path: string;
  baseUrl?: string;
  ogType?: 'website' | 'article' | 'book' | 'profile' | 'video.movie' | 'video.episode' | 'video.tv_show' | 'video.other' | 'music.song' | 'music.album' | 'music.playlist' | 'music.radio_station';
  robotsIndex?: boolean;
  robotsFollow?: boolean;
  googleBotMaxSnippet?: number;
  googleBotMaxImagePreview?: 'none' | 'standard' | 'large';
  googleBotMaxVideoPreview?: number;
}): Metadata {
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `${baseUrl}${path}`,
      languages: generateAlternateLanguages(path, baseUrl),
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}${path}`,
      type: ogType,
      locale: getOGLocale(locale),
      siteName: 'siftbeam',
      images: generateOGImages(title, baseUrl),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/og-image.jpg`],
    },
    robots: {
      index: robotsIndex,
      follow: robotsFollow,
      googleBot: {
        index: robotsIndex,
        follow: robotsFollow,
        'max-video-preview': googleBotMaxVideoPreview,
        'max-image-preview': googleBotMaxImagePreview,
        'max-snippet': googleBotMaxSnippet,
      },
    },
  };
}

