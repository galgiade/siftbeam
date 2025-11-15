import { Providers } from "@/app/providers";
import '@/app/globals.css'
import { headers } from "next/headers";
import GoogleAnalytics from "@/app/_components/common/GoogleAnalytics";
import { WebVitals } from "@/app/_components/common/WebVitals";
import { PageTracking } from "@/app/_components/common/PageTracking";
import { checkRequiredEnvVars } from "@/app/lib/utils/validateEnv";
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

// フォント最適化: Interフォントをプリロード
const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap', // フォント読み込み中もテキストを表示
  preload: true,
  variable: '--font-inter',
});
// 環境変数の検証（開発環境でのみ実行）
if (process.env.NODE_ENV === 'development') {
  checkRequiredEnvVars();
}

// メタデータの設定
export const metadata = {
  title: {
    default: 'siftbeam - 企業データ処理・管理プラットフォーム',
    template: '%s | siftbeam'
  },
  description: '企業データを効率的に処理・管理するクラウドプラットフォーム。ポリシーベースの柔軟な管理と従量課金で、セキュアなデータ運用を実現。',
  keywords: ['データ処理', 'ファイル管理', 'ポリシー管理', 'クラウドストレージ', 'データアップロード', '使用量監視', '従量課金', 'セキュアデータ管理', 'AWS', 'エンタープライズデータ'],
  authors: [{ name: 'siftbeam' }],
  creator: 'siftbeam',
  publisher: 'siftbeam',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com'),
  alternates: {
    canonical: '/',
    languages: {
      'ja': '/ja',
      'en': '/en',
      'en-US': '/en-US',
      'zh-CN': '/zh-CN',
      'ko': '/ko',
      'fr': '/fr',
      'de': '/de',
      'es': '/es',
      'pt': '/pt',
      'id': '/id',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: '/',
    title: 'siftbeam - 企業データ処理・管理プラットフォーム',
    description: '企業データを効率的に処理・管理するクラウドプラットフォーム。ポリシーベースの柔軟な管理と従量課金で、セキュアなデータ運用を実現。',
    siteName: 'siftbeam',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'siftbeam - 企業データ処理・管理プラットフォーム',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'siftbeam - 企業データ処理・管理プラットフォーム',
    description: '企業データを効率的に処理・管理するクラウドプラットフォーム。ポリシーベースの柔軟な管理と従量課金で、セキュアなデータ運用を実現。',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  // リソースヒント: 重要なリソースをプリロード
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
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  
  // ミドルウェアから渡されたロケールを取得（最も正確）
  const locale = headersList.get('x-locale') || 'en';
  
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';
  
  return (
    <html lang={locale} className={inter.variable}>
      <body className={inter.className}>
        <GoogleAnalytics GA_MEASUREMENT_ID={GA_MEASUREMENT_ID} />
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
      </body>
    </html>
  );
}
