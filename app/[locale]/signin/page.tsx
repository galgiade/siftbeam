import type { Metadata } from 'next'
import SignInContainer from "@/app/_containers/SignIn/SignInContainer";
import { signInDictionaries, pickDictionary } from '@/app/dictionaries/mappings'

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const dict = pickDictionary(signInDictionaries, resolvedParams.locale, 'en-US')
  
  return {
    title: dict.label.signInTitle || 'Sign In',
    description: dict.label.signInSubtitle || 'Sign in to your account',
    openGraph: {
      title: dict.label.signInTitle || 'Sign In',
      description: dict.label.signInSubtitle || 'Sign in to your account',
    },
  }
}

export default async function SignInPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  return <SignInContainer params={params} />
}
