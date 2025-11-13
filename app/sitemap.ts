import { MetadataRoute } from 'next'
import { getAllPosts } from '@/app/lib/blog'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com'
  
  // サポートする言語
  const locales = ['ja', 'en', 'en-US', 'zh-CN', 'ko', 'fr', 'de', 'es', 'pt', 'id']
  
  // 公開ページのパス
  const publicPages = [
    '', // ホーム
    '/pricing',
    '/flow',
    '/blog',
    '/faq',
    '/terms',
    '/privacy',
    '/legal-disclosures',
    '/signin',
    '/signup/auth',
    '/forgot-password',
  ]
  
  // 各言語×各ページのURLを生成
  const urls: MetadataRoute.Sitemap = []
  
  // ルートページ(リダイレクト用)
  urls.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  })
  
  // 各言語のページ
  locales.forEach(locale => {
    publicPages.forEach(page => {
      const url = `${baseUrl}/${locale}${page}`
      
      // 優先度の設定
      let priority = 0.8
      if (page === '') {
        priority = 1.0 // ホームページは最高優先度
      } else if (page === '/pricing' || page === '/flow') {
        priority = 0.9 // 重要ページ
      } else if (page === '/blog') {
        priority = 0.85 // ブログページ
      } else if (page === '/faq') {
        priority = 0.85 // FAQページ
      } else if (page === '/signin' || page === '/signup/auth') {
        priority = 0.7 // 認証ページ
      } else if (page === '/terms' || page === '/privacy') {
        priority = 0.5 // 法的ページ
      }
      
      // 更新頻度の設定
      let changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' = 'weekly'
      if (page === '' || page === '/pricing') {
        changeFrequency = 'daily'
      } else if (page === '/blog') {
        changeFrequency = 'weekly' // ブログは週次更新
      } else if (page === '/faq') {
        changeFrequency = 'monthly' // FAQは月次更新
      } else if (page === '/terms' || page === '/privacy' || page === '/legal-disclosures') {
        changeFrequency = 'monthly'
      }
      
      urls.push({
        url,
        lastModified: new Date(),
        changeFrequency,
        priority,
        alternates: {
          languages: Object.fromEntries(
            locales.map(l => [l, `${baseUrl}/${l}${page}`])
          ),
        },
      })
    })
  })
  
  // ブログ記事のURLを追加
  locales.forEach(locale => {
    const posts = getAllPosts(locale)
    posts.forEach(post => {
      urls.push({
        url: `${baseUrl}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt || post.publishedAt),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map(l => [l, `${baseUrl}/${l}/blog/${post.slug}`])
          ),
        },
      })
    })
  })
  
  return urls
}

