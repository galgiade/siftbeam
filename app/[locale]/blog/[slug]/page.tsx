import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogDetailContainer from '@/app/_containers/Blog/BlogDetailContainer';
import { getPostBySlug, getAllPosts } from '@/app/lib/blog';
import StructuredData, { generateBreadcrumbStructuredData } from '@/app/_components/common/StructuredData';

const getLocaleByLanguage = (locale: string): string => {
  const localeMap = {
    ja: 'ja_JP',
    en: 'en_US',
    zh: 'zh_CN',
    ko: 'ko_KR',
    fr: 'fr_FR',
    de: 'de_DE',
    es: 'es_ES',
    pt: 'pt_BR',
    id: 'id_ID',
  };
  return localeMap[locale as keyof typeof localeMap] || 'en_US';
};

export async function generateStaticParams() {
  const locales = ['ja', 'en', 'zh', 'ko', 'fr', 'de', 'es', 'pt', 'id'];
  const params: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    const posts = getAllPosts(locale);
    posts.forEach((post) => {
      params.push({ locale, slug: post.slug });
    });
  }

  return params;
}

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string; slug: string }> }
): Promise<Metadata> {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug, resolvedParams.locale);

  if (!post) {
    return {
      title: 'Not Found',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com';
  
  // 動的OG画像のURL生成
  const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent(post.title)}&description=${encodeURIComponent(post.description)}&category=${post.category}&locale=${resolvedParams.locale}`;
  // フォールバック: 静的なデフォルトOG画像
  const fallbackImageUrl = `${baseUrl}/og-default.png`;

  return {
    title: `${post.title} | siftbeam Blog`,
    description: post.description,
    keywords: post.tags,
    alternates: {
      canonical: `${baseUrl}/${resolvedParams.locale}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${baseUrl}/${resolvedParams.locale}/blog/${post.slug}`,
      type: 'article',
      locale: getLocaleByLanguage(resolvedParams.locale),
      siteName: 'siftbeam',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
        {
          url: fallbackImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [ogImageUrl, fallbackImageUrl],
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

export default async function BlogPostPage(
  props: { params: Promise<{ locale: string; slug: string }> }
) {
  const params = await props.params;
  const post = getPostBySlug(params.slug, params.locale);

  if (!post) {
    notFound();
  }

  const breadcrumbTranslations = {
    ja: { home: 'ホーム', blog: 'ブログ' },
    en: { home: 'Home', blog: 'Blog' },
    zh: { home: '首页', blog: '博客' },
    ko: { home: '홈', blog: '블로그' },
    fr: { home: 'Accueil', blog: 'Blog' },
    de: { home: 'Startseite', blog: 'Blog' },
    es: { home: 'Inicio', blog: 'Blog' },
    pt: { home: 'Início', blog: 'Blog' },
    id: { home: 'Beranda', blog: 'Blog' },
  };

  const breadcrumbLabels = breadcrumbTranslations[params.locale as keyof typeof breadcrumbTranslations] || breadcrumbTranslations['en'];

  const breadcrumbData = generateBreadcrumbStructuredData(params.locale, [
    { name: breadcrumbLabels.home, url: `/${params.locale}` },
    { name: breadcrumbLabels.blog, url: `/${params.locale}/blog` },
    { name: post.title, url: `/${params.locale}/blog/${post.slug}` }
  ]);

  // Article構造化データ
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com';
  const articleData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    author: {
      '@type': 'Organization',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'siftbeam',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/icon.svg`,
      },
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/${params.locale}/blog/${post.slug}`,
    },
    keywords: post.tags.join(', '),
  };

  return (
    <>
      <StructuredData data={breadcrumbData} id="blog-post-breadcrumb" />
      <StructuredData data={articleData} id="blog-post-article" />
      <BlogDetailContainer params={params} />
    </>
  );
}

