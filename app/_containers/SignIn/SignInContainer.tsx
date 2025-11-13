import SignInPresentation from './SignInPresentation'
import { signInDictionaries, pickDictionary } from '@/app/dictionaries/mappings';

export default async function SignInContainer({
  params
}: {
  params: { locale: string }
}) {
  const locale = params.locale || 'en'
  const dictionary = pickDictionary(signInDictionaries, locale, 'en');
  
  // サインインページでは認証チェックを行わない
  // サインイン後のリダイレクトはauth-actionsで処理
  return (
    <SignInPresentation dictionary={dictionary} locale={locale} />
  )
}