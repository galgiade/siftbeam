import { redirect } from "next/navigation";
import CreateCompanyPresentation from "./CreateCompanyPresentation";
import { getCurrentUserAction } from '@/app/lib/auth/auth-actions';
import type { CreateCompanyInfoLocale } from '@/app/dictionaries/createCompanyInfo/createCompanyInfo.d.ts';
import { createCompanyInfoDictionaries, pickDictionary } from '@/app/dictionaries/mappings';

// マッピングは共通ファイルに集約

export default async function CreateCompanyContainer({
  params: { locale }
}: {
  params: { locale: string }
}) {
  // 現在のユーザーを取得
  const currentUser = await getCurrentUserAction();
  
  // 未ログインの場合はサインインページへ
  if (!currentUser) {
    redirect(`/${locale}/signin`);
  }

  const resolvedLocale = currentUser.locale || locale;
  const dictionary: CreateCompanyInfoLocale = pickDictionary(createCompanyInfoDictionaries, resolvedLocale, 'en');

  // Stripe顧客IDが存在する場合は管理者作成ページにリダイレクト
  const customerId = currentUser.attributes?.['custom:customerId'] || currentUser.customerId;
  console.log('CreateCompanyInfoContainer - customerId:', customerId);
  console.log('CreateCompanyInfoContainer - currentUser.attributes:', currentUser.attributes);
  
  if (customerId) {
    console.log('✅ customerIdが存在 - 管理者作成ページにリダイレクト');
    redirect(`/${locale}/signup/create-admin`);
  }

  // 会社情報入力画面を表示
  return (
    <div>
      <CreateCompanyPresentation locale={locale} dictionary={dictionary} />
    </div>
  );
}