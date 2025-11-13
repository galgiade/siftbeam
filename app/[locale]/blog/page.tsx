import type { Metadata } from 'next';
import BlogListContainer from '@/app/_containers/Blog/BlogListContainer';
import { blogDictionaries, pickDictionary } from '@/app/dictionaries/mappings';
import StructuredData, { generateBreadcrumbStructuredData } from '@/app/_components/common/StructuredData';

const getBlogKeywordsByLocale = (locale: string): string[] => {
  const keywordMap = {
    ja: [
      'ブログ', 'データ処理', '自動化', 'クラウド', 'セキュリティ', 'チュートリアル', '技術解説', 'ベストプラクティス',
      // ロングテールキーワード追加
      'データ処理 自動化 方法', 'クラウド データ管理', 'エンタープライズ データ処理', 
      'ファイル処理 自動化', 'データ処理 セキュリティ', 'データ処理 効率化',
      'データ処理 ツール 比較', 'データ処理 コスト削減', 'データ処理 始め方'
    ],
    'en-US': [
      'blog', 'data processing', 'automation', 'cloud', 'security', 'tutorial', 'technical guide', 'best practices',
      // ロングテールキーワード追加
      'data processing automation guide', 'cloud data management', 'enterprise data processing',
      'file processing automation', 'data processing security', 'data processing efficiency',
      'data processing tools comparison', 'data processing cost reduction', 'getting started data processing'
    ],
  };
  return keywordMap[locale as keyof typeof keywordMap] || keywordMap['en-US'];
};

const getLocaleByLanguage = (locale: string): string => {
  const localeMap = {
    ja: 'ja_JP',
    'en-US': 'en_US',
  };
  return localeMap[locale as keyof typeof localeMap] || 'en_US';
};

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const resolvedParams = await params;
  const dict = pickDictionary(blogDictionaries, resolvedParams.locale, 'en-US');
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com';
  
  // 静的OG画像を使用（Discordのタイムアウト対策）
  const ogImageUrl = `${baseUrl}/og-default.png`;

  return {
    title: `${dict.title} | siftbeam`,
    description: dict.description,
    keywords: getBlogKeywordsByLocale(resolvedParams.locale),
    alternates: {
      canonical: `${baseUrl}/${resolvedParams.locale}/blog`,
      languages: {
        'ja': `${baseUrl}/ja/blog`,
        'en': `${baseUrl}/en/blog`,
        'en-US': `${baseUrl}/en-US/blog`,
      },
    },
    openGraph: {
      title: `${dict.title} | siftbeam`,
      description: dict.description,
      url: `${baseUrl}/${resolvedParams.locale}/blog`,
      type: 'website',
      locale: getLocaleByLanguage(resolvedParams.locale),
      siteName: 'siftbeam',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: dict.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${dict.title} | siftbeam`,
      description: dict.description,
      images: [ogImageUrl],
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

export default async function BlogPage(
  props: { params: Promise<{ locale: string }> }
) {
  const params = await props.params;
  const locale = params.locale;

  const breadcrumbTranslations = {
    ja: { home: 'ホーム', blog: 'ブログ' },
    'en-US': { home: 'Home', blog: 'Blog' },
  };

  const breadcrumbLabels = breadcrumbTranslations[locale as keyof typeof breadcrumbTranslations] || breadcrumbTranslations['en-US'];

  const breadcrumbData = generateBreadcrumbStructuredData(locale, [
    { name: breadcrumbLabels.home, url: `/${locale}` },
    { name: breadcrumbLabels.blog, url: `/${locale}/blog` }
  ]);

  return (
    <>
      <StructuredData data={breadcrumbData} id="blog-breadcrumb" />
      <BlogListContainer params={params} />
    </>
  );
}

