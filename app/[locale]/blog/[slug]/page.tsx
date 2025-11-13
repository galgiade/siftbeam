import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogDetailContainer from '@/app/_containers/Blog/BlogDetailContainer';
import { getPostBySlug, getAllPosts } from '@/app/lib/blog';
import StructuredData, { generateBreadcrumbStructuredData } from '@/app/_components/common/StructuredData';

const getLocaleByLanguage = (locale: string): string => {
  const localeMap = {
    ja: 'ja_JP',
    'en-US': 'en_US',
  };
  return localeMap[locale as keyof typeof localeMap] || 'en_US';
};

export async function generateStaticParams() {
  const locales = ['ja', 'en-US'];
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
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
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
    'en-US': { home: 'Home', blog: 'Blog' },
  };

  const breadcrumbLabels = breadcrumbTranslations[params.locale as keyof typeof breadcrumbTranslations] || breadcrumbTranslations['en-US'];

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

