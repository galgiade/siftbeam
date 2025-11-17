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
  
  return {
    title: dict.label.signUpTitle || 'Sign Up',
    description: dict.label.accountCreation || 'Create a new account',
    openGraph: {
      title: dict.label.signUpTitle || 'Sign Up',
      description: dict.label.accountCreation || 'Create a new account',
    },
  }
}

export default async function SignUpPage(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    return <SignUpContainer params={params} />
}
