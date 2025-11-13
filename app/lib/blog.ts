import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { BlogPost } from '@/app/dictionaries/blog/blog.d';

const contentDirectory = path.join(process.cwd(), 'content', 'blog');

/**
 * 指定されたロケールのブログ記事を全て取得
 */
export function getAllPosts(locale: string): BlogPost[] {
  const localeDir = path.join(contentDirectory, locale);
  
  // ディレクトリが存在しない場合は空配列を返す
  if (!fs.existsSync(localeDir)) {
    return [];
  }

  const fileNames = fs.readdirSync(localeDir);
  const posts = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      return getPostBySlug(slug, locale);
    })
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => {
      // 公開日の新しい順にソート
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

  return posts;
}

/**
 * スラッグとロケールから特定のブログ記事を取得
 */
export function getPostBySlug(slug: string, locale: string): BlogPost | null {
  try {
    const fullPath = path.join(contentDirectory, locale, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug: data.slug || slug,
      title: data.title,
      description: data.description,
      content,
      author: data.author,
      publishedAt: data.publishedAt,
      updatedAt: data.updatedAt,
      category: data.category,
      tags: data.tags || [],
      readingTime: data.readingTime
    };
  } catch (error) {
    console.error(`Error reading post ${slug} for locale ${locale}:`, error);
    return null;
  }
}

/**
 * カテゴリでフィルタリングされたブログ記事を取得
 */
export function getPostsByCategory(category: string, locale: string): BlogPost[] {
  const allPosts = getAllPosts(locale);
  return allPosts.filter((post) => post.category === category);
}

/**
 * タグでフィルタリングされたブログ記事を取得
 */
export function getPostsByTag(tag: string, locale: string): BlogPost[] {
  const allPosts = getAllPosts(locale);
  return allPosts.filter((post) => post.tags.includes(tag));
}

/**
 * 全てのカテゴリを取得
 */
export function getAllCategories(locale: string): string[] {
  const allPosts = getAllPosts(locale);
  const categories = new Set(allPosts.map((post) => post.category));
  return Array.from(categories);
}

/**
 * 全てのタグを取得
 */
export function getAllTags(locale: string): string[] {
  const allPosts = getAllPosts(locale);
  const tags = new Set(allPosts.flatMap((post) => post.tags));
  return Array.from(tags);
}

/**
 * 関連記事を取得（同じカテゴリまたは同じタグを持つ記事）
 */
export function getRelatedPosts(post: BlogPost, locale: string, limit: number = 3): BlogPost[] {
  const allPosts = getAllPosts(locale);
  
  // 現在の記事を除外
  const otherPosts = allPosts.filter((p) => p.slug !== post.slug);
  
  // スコアリング: 同じカテゴリ +2, 同じタグ +1
  const scoredPosts = otherPosts.map((p) => {
    let score = 0;
    if (p.category === post.category) score += 2;
    score += p.tags.filter((tag) => post.tags.includes(tag)).length;
    return { post: p, score };
  });
  
  // スコアの高い順にソートして上位N件を返す
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post);
}

