import { getPostBySlug, getRelatedPosts } from '@/app/lib/blog';
import { notFound } from 'next/navigation';
import BlogDetailPresentation from './BlogDetailPresentation';

interface BlogDetailContainerProps {
  params: { locale: string; slug: string };
}

export default async function BlogDetailContainer({ params }: BlogDetailContainerProps) {
  const post = getPostBySlug(params.slug, params.locale);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post, params.locale, 3);

  return <BlogDetailPresentation post={post} relatedPosts={relatedPosts} locale={params.locale} />;
}

