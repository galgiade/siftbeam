import type { Metadata } from 'next'
import SignInContainer from "@/app/_containers/SignIn/SignInContainer";
import { signInDictionaries, pickDictionary } from '@/app/dictionaries/mappings'

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
  const dict = pickDictionary(signInDictionaries, resolvedParams.locale, 'en')
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com'
  
  return {
    title: dict.label.signInTitle || 'Sign In',
    description: dict.label.signInSubtitle || 'Sign in to your account',
    alternates: {
      canonical: `${baseUrl}/${resolvedParams.locale}/signin`,
      languages: {
        'x-default': `${baseUrl}/en/signin`,
        'ja': `${baseUrl}/ja/signin`,
        'en': `${baseUrl}/en/signin`,
        'zh': `${baseUrl}/zh/signin`,
        'ko': `${baseUrl}/ko/signin`,
        'fr': `${baseUrl}/fr/signin`,
        'de': `${baseUrl}/de/signin`,
        'es': `${baseUrl}/es/signin`,
        'pt': `${baseUrl}/pt/signin`,
        'id': `${baseUrl}/id/signin`,
      },
    },
    openGraph: {
      title: dict.label.signInTitle || 'Sign In',
      description: dict.label.signInSubtitle || 'Sign in to your account',
      url: `${baseUrl}/${resolvedParams.locale}/signin`,
      type: 'website',
    },
    robots: {
      index: false, // ログインページは検索結果に表示しない
      follow: true,
    },
  }
}

export default async function SignInPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  return <SignInContainer params={params} />
}
