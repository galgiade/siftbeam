import { Providers } from "@/app/providers";
import '@/app/globals.css'
import { headers } from "next/headers";
import { getPreferredLocale } from "@/app/utils/locale-utils";

// メタデータの設定
export const metadata = {
  title: {
    default: 'siftbeam - AIデータ分析プラットフォーム',
    template: '%s | siftbeam'
  },
  description: '企業データをAIで分析し、リアルタイム異常検知とカスタム予測でビジネスを革新。AWSで構築された安全なプラットフォーム。',
  keywords: ['AI', 'データ分析', '異常検知', '機械学習', 'AWS', 'ビジネス予測', 'リアルタイム分析'],
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
    title: 'siftbeam - AIデータ分析プラットフォーム',
    description: '企業データをAIで分析し、リアルタイム異常検知とカスタム予測でビジネスを革新。',
    siteName: 'siftbeam',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'siftbeam - AIデータ分析プラットフォーム',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'siftbeam - AIデータ分析プラットフォーム',
    description: '企業データをAIで分析し、リアルタイム異常検知とカスタム予測でビジネスを革新。',
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
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || '';
  const locale = getPreferredLocale(acceptLanguage);
  
  return (
    <html lang={locale}>
      <body>
          <Providers>
              {children}
          </Providers>
      </body>
    </html>
  );
}
