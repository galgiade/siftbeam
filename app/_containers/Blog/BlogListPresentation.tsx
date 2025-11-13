'use client';

import { Card, Button, Chip } from '@heroui/react';
import Link from 'next/link';
import type { BlogPost } from '@/app/dictionaries/blog/blog.d';
import { blogDictionaries, pickDictionary } from '@/app/dictionaries/mappings';
import { FaNewspaper, FaEye, FaClock } from 'react-icons/fa6';

interface BlogListPresentationProps {
  posts: BlogPost[];
  locale: string;
}

export default function BlogListPresentation({ posts, locale }: BlogListPresentationProps) {
  const dict = pickDictionary(blogDictionaries, locale, 'en-US');

  const getCategoryColor = (category: string) => {
    const colors: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'danger'> = {
      technical: 'primary',
      tutorial: 'secondary',
      case_study: 'success',
      trend: 'warning',
      product_update: 'danger',
      comparison: 'primary',
      security: 'secondary',
      announcement: 'danger'
    };
    return colors[category] || 'default';
  };

  // 日付フォーマット関数
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center gap-3 mb-8">
          <FaNewspaper className="text-blue-600" size={32} />
          <div>
            <h1 className="text-3xl font-bold">{dict.title}</h1>
            <p className="text-gray-600 mt-1">{dict.description}</p>
          </div>
        </div>

        {/* ブログ記事一覧 */}
        <Card className="p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              {locale === 'ja' ? '記事一覧' : 'Articles'} ({posts.length}{locale === 'ja' ? '件' : ' posts'})
            </h2>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FaNewspaper size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">
                {locale === 'ja' ? 'まだ記事がありません' : 'No articles yet'}
              </p>
              <p className="text-sm">
                {locale === 'ja' ? '新しい記事が公開されるまでお待ちください' : 'Please wait for new articles to be published'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.slug}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg text-gray-900">
                          {post.title}
                        </h3>
                        <Chip
                          color={getCategoryColor(post.category)}
                          size="sm"
                          variant="flat"
                        >
                          {dict.categories[post.category as keyof typeof dict.categories]}
                        </Chip>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <FaClock size={12} />
                          {formatDate(post.publishedAt)}
                        </span>
                        <span>{post.readingTime}</span>
                      </div>

                      <p className="text-gray-700 text-sm line-clamp-2 mb-3">
                        {post.description}
                      </p>

                      {post.tags.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {post.tags.slice(0, 5).map((tag) => (
                            <Chip key={tag} size="sm" variant="bordered">
                              {tag}
                            </Chip>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="ml-4">
                      <Button
                        color="primary"
                        variant="flat"
                        size="sm"
                        as={Link}
                        href={`/${locale}/blog/${post.slug}`}
                        startContent={<FaEye size={14} />}
                      >
                        {dict.readMore}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

