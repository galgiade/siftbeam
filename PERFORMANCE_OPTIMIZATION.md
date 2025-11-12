# パフォーマンス最適化ガイド

## 📊 現在のパフォーマンス状況

### Vercel Speed Insights (2024年11月時点)
- **Real Experience Score**: 96点 ✅
- **First Contentful Paint (FCP)**: 2.21s ⚠️ (目標: 1.8s以下)
- **Largest Contentful Paint (LCP)**: 2.21s ✅ (83%が良好)
- **Interaction to Next Paint (INP)**: 8ms ✅
- **Cumulative Layout Shift (CLS)**: 0 ✅
- **First Input Delay (FID)**: 3ms ✅
- **Time to First Byte (TTFB)**: 1.33s ✅

## 🎯 実施した最適化 (Next.js公式ドキュメント準拠)

### 1. フォント最適化 ✅
**目的**: FCPを改善し、フォント読み込み中もテキストを表示

**実装内容**:
```typescript
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap', // フォント読み込み中もテキストを表示
  preload: true,
  variable: '--font-inter',
});
```

**効果**:
- フォント読み込み中も代替フォントでテキストを表示
- レイアウトシフトを防止
- 体感速度の向上

### 2. パッケージインポート最適化 ✅
**目的**: HeroUIなどの大きなライブラリの読み込みを最適化

**実装内容**:
```typescript
// next.config.ts
experimental: {
  optimizePackageImports: ['@heroui/react'],
}
```

**効果**:
- 未使用のコンポーネントをバンドルから除外
- 初期バンドルサイズの削減
- FCPの改善

### 3. 画像最適化 ✅
**既存の設定**:
```typescript
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  minimumCacheTTL: 60,
}
```

### 4. 圧縮とキャッシュ ✅
```typescript
compress: true,
minimumCacheTTL: 60,
```

### 5. CSS最適化 ✅
**Next.js公式推奨**: `optimizeCss`を有効化してCSSを自動最適化

**実装内容**:
```typescript
// next.config.ts
experimental: {
  optimizePackageImports: ['@heroui/react'],
  optimizeCss: true, // CSS最適化を有効化
}
```

**効果**:
- 未使用のCSSを自動削除
- CSSバンドルサイズの削減
- FCPの改善

### 6. リソースヒント ✅
**Next.js公式推奨**: `preconnect`と`dns-prefetch`で外部リソースの接続を高速化

**実装内容**:
```typescript
// app/layout.tsx のメタデータ
other: {
  'link': [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    },
    {
      rel: 'dns-prefetch',
      href: 'https://www.googletagmanager.com',
    },
  ],
}
```

**効果**:
- Google Fontsへの接続を事前確立
- Google Analyticsへの接続を高速化
- TTFBとFCPの改善

### 7. Suspenseによるストリーミング ✅
**Next.js公式推奨**: Suspenseで非クリティカルなコンポーネントを遅延読み込み

**実装内容**:
```typescript
// app/layout.tsx
<Suspense fallback={null}>
  <WebVitals />
  <PageTracking />
</Suspense>
<Providers>
  {children}
</Providers>
<Suspense fallback={null}>
  <Analytics />
  <SpeedInsights />
</Suspense>
```

**効果**:
- メインコンテンツの表示を優先
- 非クリティカルなコンポーネントを並行読み込み
- FCPとLCPの改善

### 8. 静的アセットの長期キャッシュ ✅
**Vercel公式推奨**: 静的ファイルに長期キャッシュヘッダーを設定

**実装内容**:
```typescript
// next.config.ts
async headers() {
  return [
    // 静的アセットの長期キャッシュ
    {
      source: '/(.*)\\.(ico|png|jpg|jpeg|svg|gif|webp|avif|woff|woff2|ttf|otf|eot)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ]
}
```

**効果**:
- 画像・フォントファイルを1年間キャッシュ
- リピート訪問時のTTFBとFCPを大幅改善
- CDN配信の効率化

### 9. SVG画像の最適化 ✅
**実装内容**:
```typescript
images: {
  dangerouslyAllowSVG: true,
  contentDispositionType: 'attachment',
  contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
}
```

**効果**:
- SVG画像の最適化配信
- セキュアなSVG処理

### 10. 静的生成の並列化 ✅
**実装内容**:
```typescript
experimental: {
  staticGenerationRetryCount: 3,
  staticGenerationMaxConcurrency: 8,
}
```

**効果**:
- ビルド時間の短縮
- 静的ページ生成の高速化

## 📈 追加で実施可能な最適化

### 優先度: 高 🔴

#### A. 画像のプリロード
重要な画像（ヒーローイメージなど）をプリロードする:
```typescript
// app/[locale]/page.tsx のメタデータに追加
export async function generateMetadata() {
  return {
    // ... 既存のメタデータ
    other: {
      'link': [
        {
          rel: 'preload',
          as: 'image',
          href: '/hero-image.jpg',
        }
      ]
    }
  }
}
```

#### C. 動的インポート (クライアントコンポーネント用)
大きなコンポーネントを遅延読み込み:
```typescript
'use client'; // クライアントコンポーネントで使用

import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // クライアントサイドのみで読み込む
});
```

**注意**: Server Componentでは`ssr: false`は使用できません。

### 優先度: 中 🟡

#### D. Service Worker でのキャッシュ戦略
```typescript
// next.config.ts
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

module.exports = withPWA(nextConfig);
```

#### E. CDNでの静的アセット配信
Vercelは自動的にCDNを使用していますが、追加の最適化:
```typescript
// next.config.ts
assetPrefix: process.env.NODE_ENV === 'production' 
  ? 'https://cdn.siftbeam.com' 
  : undefined,
```

### 優先度: 低 🟢

#### F. コード分割の最適化
```typescript
// webpack設定のカスタマイズ
webpack: (config, { isServer }) => {
  if (!isServer) {
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        default: false,
        vendors: false,
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2,
        },
      },
    };
  }
  return config;
}
```

## 🔍 モニタリング

### Vercel Speed Insights
- リアルタイムでパフォーマンスを監視
- ユーザーの実際の体験を測定
- 地域別のパフォーマンスを確認

### Google PageSpeed Insights
定期的にチェック:
```bash
https://pagespeed.web.dev/analysis?url=https://siftbeam.com
```

### Lighthouse
ローカルでのテスト:
```bash
npm run build
npm start
# Chrome DevTools > Lighthouse で測定
```

## 📊 目標値

| 指標 | 現在 | 目標 | 優先度 |
|------|------|------|--------|
| FCP | 2.21s | <1.8s | 🔴 高 |
| LCP | 2.21s | <2.5s | ✅ 達成 |
| INP | 8ms | <200ms | ✅ 達成 |
| CLS | 0 | <0.1 | ✅ 達成 |
| FID | 3ms | <100ms | ✅ 達成 |
| TTFB | 1.33s | <600ms | 🟡 中 |

## 🚀 次のステップ

1. **FCPを1.8s以下に改善** (最優先)
   - 重要なCSSのインライン化
   - 画像のプリロード
   - 不要なJavaScriptの削除

2. **TTFBの改善** (中優先度)
   - サーバーサイドのキャッシュ戦略
   - データベースクエリの最適化
   - CDNの活用

3. **継続的なモニタリング**
   - Vercel Speed Insightsで週次チェック
   - ユーザーフィードバックの収集
   - A/Bテストでの検証

## 📝 参考リンク

- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web Vitals](https://web.dev/vitals/)
- [Vercel Speed Insights](https://vercel.com/docs/speed-insights)
- [Google PageSpeed Insights](https://pagespeed.web.dev/)

