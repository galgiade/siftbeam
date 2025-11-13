import type { Metadata } from 'next';
import BlogListContainer from '@/app/_containers/Blog/BlogListContainer';
import { blogDictionaries, pickDictionary } from '@/app/dictionaries/mappings';
import StructuredData, { generateBreadcrumbStructuredData } from '@/app/_components/common/StructuredData';

const getBlogKeywordsByLocale = (locale: string): string[] => {
  const keywordMap = {
    ja: ['ブログ', 'データ処理', '自動化', 'クラウド', 'セキュリティ', 'チュートリアル', '技術解説', 'ベストプラクティス'],
    'en-US': ['blog', 'data processing', 'automation', 'cloud', 'security', 'tutorial', 'technical guide', 'best practices'],
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
    },
    twitter: {
      card: 'summary_large_image',
      title: `${dict.title} | siftbeam`,
      description: dict.description,
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

