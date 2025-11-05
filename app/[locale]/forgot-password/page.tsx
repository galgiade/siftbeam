import type { Metadata } from 'next'
import { forgotPasswordDictionaries, pickDictionary } from '@/app/dictionaries/mappings'
import ForgotPasswordContainer from '@/app/_containers/ForgotPassword/ForgotPasswordContainer'

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const dict = pickDictionary(forgotPasswordDictionaries, resolvedParams.locale, 'en')
  return {
    title: dict.label.forgotPasswordTitle || 'Forgot Password',
    description: dict.label.emailDescription || 'Reset your password',
    openGraph: {
      title: dict.label.forgotPasswordTitle || 'Forgot Password',
      description: dict.label.emailDescription || 'Reset your password',
    },
  }
}

export default async function ForgotPasswordPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params
  return <ForgotPasswordContainer locale={resolvedParams.locale} />
}

