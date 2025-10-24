import SignUpPresentation from './SignUpPresentation'
import { redirect } from 'next/navigation';
import { getCurrentUserAction } from '@/app/lib/auth/auth-actions'
import { signUpAuthDictionaries, pickDictionary } from '@/app/dictionaries/mappings';
import { requireUserProfile } from '@/app/lib/utils/require-auth';

export default async function SignUpContainer({
  params
}: {
  params: { locale: string }
}) {
  const locale = params.locale
  const dictionary = pickDictionary(signUpAuthDictionaries, locale, 'en');
  // 未認証ユーザーの場合はサインアップページを表示
  return <SignUpPresentation locale={locale} dictionary={dictionary} />
}