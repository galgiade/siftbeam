import { getAllPosts } from '@/app/lib/blog';
import BlogListPresentation from './BlogListPresentation';

interface BlogListContainerProps {
  params: { locale: string };
}

export default async function BlogListContainer({ params }: BlogListContainerProps) {
  const posts = getAllPosts(params.locale);

  return <BlogListPresentation posts={posts} locale={params.locale} />;
}

