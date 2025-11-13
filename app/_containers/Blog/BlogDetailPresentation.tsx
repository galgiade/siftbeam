'use client';

import { Card, CardBody, CardHeader, Chip, Button, Divider } from '@heroui/react';
import Link from 'next/link';
import type { BlogPost } from '@/app/dictionaries/blog/blog.d';
import { blogDictionaries, pickDictionary } from '@/app/dictionaries/mappings';
import MarkdownRenderer from '@/app/_components/blog/MarkdownRenderer';

interface BlogDetailPresentationProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
  locale: string;
}

export default function BlogDetailPresentation({ post, relatedPosts, locale }: BlogDetailPresentationProps) {
  const dict = pickDictionary(blogDictionaries, locale, 'en-US');

  const getCategoryColor = (category: string) => {
    const colors: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'danger'> = {
      technical: 'primary',
      tutorial: 'secondary',
      case_study: 'success',
      trend: 'warning',
      product_update: 'danger',
      comparison: 'primary',
      security: 'secondary'
    };
    return colors[category] || 'default';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-default-100">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 py-12">
        <div className="container mx-auto px-4">
          <Button
            as={Link}
            href={`/${locale}/blog`}
            variant="light"
            className="text-white mb-4"
          >
            ← {dict.backToList}
          </Button>
          
          <div className="flex gap-2 flex-wrap mb-4">
            <Chip
              color={getCategoryColor(post.category)}
              size="md"
              variant="flat"
              className="text-white"
            >
              {dict.categories[post.category as keyof typeof dict.categories]}
            </Chip>
            <Chip size="md" variant="light" className="text-white">
              {post.readingTime}
            </Chip>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {post.title}
          </h1>

          <p className="text-xl text-white/90 mb-6">
            {post.description}
          </p>

          <div className="flex flex-wrap gap-4 text-white/80 text-sm">
            <div>
              {dict.author}: {post.author}
            </div>
            <div>
              {dict.publishedOn}: {new Date(post.publishedAt).toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            {post.updatedAt && (
              <div>
                {dict.updatedOn}: {new Date(post.updatedAt).toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            )}
          </div>

          <div className="flex gap-2 flex-wrap mt-4">
            {post.tags.map((tag) => (
              <Chip key={tag} size="sm" variant="bordered" className="text-white border-white/30">
                {tag}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      {/* 記事本文 */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8">
            <CardBody>
              <MarkdownRenderer content={post.content} />
            </CardBody>
          </Card>

          {/* 関連記事 */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">{dict.relatedPosts}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Card key={relatedPost.slug} className="hover:shadow-xl transition-shadow">
                    <CardHeader className="flex flex-col items-start gap-2 pb-0">
                      <Chip
                        color={getCategoryColor(relatedPost.category)}
                        size="sm"
                        variant="flat"
                      >
                        {dict.categories[relatedPost.category as keyof typeof dict.categories]}
                      </Chip>
                      <h3 className="text-lg font-bold line-clamp-2">
                        {relatedPost.title}
                      </h3>
                    </CardHeader>
                    
                    <CardBody className="py-4">
                      <p className="text-default-600 line-clamp-2 text-sm">
                        {relatedPost.description}
                      </p>
                      
                      <Button
                        as={Link}
                        href={`/${locale}/blog/${relatedPost.slug}`}
                        color="primary"
                        variant="flat"
                        size="sm"
                        className="mt-4"
                      >
                        {dict.readMore}
                      </Button>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <Card className="mt-12 bg-gradient-to-r from-primary-500 to-secondary-500">
            <CardBody className="text-center py-12">
              <h2 className="text-2xl font-bold text-white mb-4">
                {locale === 'ja' ? 'siftbeamを無料で試してみませんか?' : 'Ready to try siftbeam?'}
              </h2>
              <p className="text-white/90 mb-6">
                {locale === 'ja' 
                  ? 'データ処理の自動化を今すぐ始めましょう。初期費用なし、従量課金で安心。'
                  : 'Start automating your data processing today. No upfront costs, pay-as-you-go pricing.'}
              </p>
              <Button
                as={Link}
                href={`/${locale}/signup/auth`}
                size="lg"
                color="default"
                variant="solid"
              >
                {locale === 'ja' ? '無料で始める' : 'Get Started Free'}
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

