import { MetadataRoute } from 'next'
import { getAllPosts } from '@/app/lib/blog'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com'
  
  // サポートする言語（2文字コードに統一）
  const locales = ['ja', 'en', 'zh', 'ko', 'fr', 'de', 'es', 'pt', 'id']
  
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
  
  // ルートURL(/)を追加 - 検索エンジンボットに対してコンテンツを返すため
  urls.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
    alternates: {
      languages: Object.fromEntries(
        locales.map(l => [l, `${baseUrl}/${l}`])
      ),
    },
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
      // カテゴリーに応じて優先度を調整
      let priority = 0.75 // デフォルト優先度を上げる
      if (post.category === 'tutorial' || post.category === 'announcement') {
        priority = 0.8 // チュートリアルとお知らせは高優先度
      }
      
      // 更新頻度をカテゴリーに応じて調整
      let changeFrequency: 'monthly' | 'weekly' = 'monthly'
      if (post.category === 'announcement' || post.category === 'product_update') {
        changeFrequency = 'weekly' // お知らせと製品更新は頻繁に更新
      }
      
      urls.push({
        url: `${baseUrl}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt || post.publishedAt),
        changeFrequency,
        priority,
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

