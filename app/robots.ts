import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/ja/',
          '/en/',
          '/zh/',
          '/ko/',
          '/fr/',
          '/de/',
          '/es/',
          '/pt/',
          '/id/',
          '/_next/static/', // Next.jsの静的ファイルを許可（重要！）
        ],
        disallow: [
          '/api/',
          '/_next/data/', // データファイルのみブロック
          '/private/',
          '/*?*apiKey=*', // APIキーを含むURLを除外
          '/*?*token=*',  // トークンを含むURLを除外
        ],
      },
      {
        userAgent: 'GPTBot', // ChatGPTのクローラー
        disallow: '/',
      },
      {
        userAgent: 'CCBot', // Common Crawlのクローラー
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

