import type { Metadata } from 'next'
import { forgotPasswordDictionaries, pickDictionary } from '@/app/dictionaries/mappings'
import ForgotPasswordContainer from '@/app/_containers/ForgotPassword/ForgotPasswordContainer'

// 静的生成のためのgenerateStaticParams（2文字コードに統一）
export async function generateStaticParams() {
  return [
    { locale: 'ja' },
    { locale: 'en' },
    { locale: 'zh' },
    { locale: 'ko' },
    { locale: 'fr' },
    { locale: 'de' },
    { locale: 'es' },
    { locale: 'pt' },
    { locale: 'id' },
  ];
}

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const dict = pickDictionary(forgotPasswordDictionaries, resolvedParams.locale, 'en')
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com'
  
  return {
    title: dict.label.forgotPasswordTitle || 'Forgot Password',
    description: dict.label.emailDescription || 'Reset your password',
    alternates: {
      canonical: `${baseUrl}/${resolvedParams.locale}/forgot-password`,
      languages: {
        'x-default': `${baseUrl}/en/forgot-password`,
        'ja': `${baseUrl}/ja/forgot-password`,
        'en': `${baseUrl}/en/forgot-password`,
        'zh': `${baseUrl}/zh/forgot-password`,
        'ko': `${baseUrl}/ko/forgot-password`,
        'fr': `${baseUrl}/fr/forgot-password`,
        'de': `${baseUrl}/de/forgot-password`,
        'es': `${baseUrl}/es/forgot-password`,
        'pt': `${baseUrl}/pt/forgot-password`,
        'id': `${baseUrl}/id/forgot-password`,
      },
    },
    openGraph: {
      title: dict.label.forgotPasswordTitle || 'Forgot Password',
      description: dict.label.emailDescription || 'Reset your password',
      url: `${baseUrl}/${resolvedParams.locale}/forgot-password`,
      type: 'website',
    },
    robots: {
      index: false, // パスワードリセットページは検索結果に表示しない
      follow: false,
    },
  }
}

export default async function ForgotPasswordPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params
  return <ForgotPasswordContainer locale={resolvedParams.locale} />
}

