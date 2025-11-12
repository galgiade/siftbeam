import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // SEO最適化設定
  
  // トレーリングスラッシュを追加しない(SEOで推奨)
  trailingSlash: false,
  
  // 画像最適化
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  
  // 圧縮を有効化(パフォーマンス向上)
  compress: true,
  
  // 本番環境でのソースマップを無効化(セキュリティとパフォーマンス)
  productionBrowserSourceMaps: false,
  
  // パワードバイヘッダーを削除(セキュリティ)
  poweredByHeader: false,
  
  // パフォーマンス最適化
  experimental: {
    optimizePackageImports: ['@heroui/react'], // HeroUI のインポートを最適化
  },
  
  // HTTPヘッダーの設定(セキュリティとSEO)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
    ]
  },
  
  // リダイレクト設定
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      // 言語なしのパスを日本語にリダイレクト
      {
        source: '/pricing',
        destination: '/ja/pricing',
        permanent: false,
      },
      {
        source: '/flow',
        destination: '/ja/flow',
        permanent: false,
      },
      {
        source: '/terms',
        destination: '/ja/terms',
        permanent: false,
      },
      {
        source: '/privacy',
        destination: '/ja/privacy',
        permanent: false,
      },
    ]
  },
};

export default nextConfig;
