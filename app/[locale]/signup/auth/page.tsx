import type { Metadata } from 'next'
import SignUpContainer from "@/app/_containers/SignUp/auth/SignUpContainer";
import { signUpAuthDictionaries, pickDictionary } from '@/app/dictionaries/mappings'

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
  const dict = pickDictionary(signUpAuthDictionaries, resolvedParams.locale, 'en')
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com'
  
  return {
    title: dict.label.signUpTitle || 'Sign Up',
    description: dict.label.accountCreation || 'Create a new account',
    alternates: {
      canonical: `${baseUrl}/${resolvedParams.locale}/signup/auth`,
      languages: {
        'x-default': `${baseUrl}/en/signup/auth`,
        'ja': `${baseUrl}/ja/signup/auth`,
        'en': `${baseUrl}/en/signup/auth`,
        'zh': `${baseUrl}/zh/signup/auth`,
        'ko': `${baseUrl}/ko/signup/auth`,
        'fr': `${baseUrl}/fr/signup/auth`,
        'de': `${baseUrl}/de/signup/auth`,
        'es': `${baseUrl}/es/signup/auth`,
        'pt': `${baseUrl}/pt/signup/auth`,
        'id': `${baseUrl}/id/signup/auth`,
      },
    },
    openGraph: {
      title: dict.label.signUpTitle || 'Sign Up',
      description: dict.label.accountCreation || 'Create a new account',
      url: `${baseUrl}/${resolvedParams.locale}/signup/auth`,
      type: 'website',
    },
    robots: {
      index: false, // サインアップページは検索結果に表示しない
      follow: true,
    },
  }
}

export default async function SignUpPage(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    return <SignUpContainer params={params} />
}
