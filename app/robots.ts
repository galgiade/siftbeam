import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
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

