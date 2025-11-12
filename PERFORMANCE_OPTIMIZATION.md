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

## 🎯 実施した最適化

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

## 📈 追加で実施可能な最適化

### 優先度: 高 🔴

#### A. 重要なCSSのインライン化
```typescript
// next.config.ts に追加
experimental: {
  optimizePackageImports: ['@heroui/react'],
  optimizeCss: true, // CSS最適化を有効化
}
```

#### B. 画像のプリロード
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

#### C. 動的インポート
大きなコンポーネントを遅延読み込み:
```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // クライアントサイドのみで読み込む
});
```

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

