import { Metadata } from 'next';
import CreateAdminPresentation from "./CreateAdminPresentation";
import { redirect } from 'next/navigation';
import type { CreateAdminLocale } from '@/app/dictionaries/createAdmin/createAdmin.d.ts';
import { createAdminDictionaries, pickDictionary } from '@/app/dictionaries/mappings';
import { getCurrentUserAction } from '@/app/lib/auth/auth-actions';
import { checkPaymentMethodsAction } from '@/app/lib/actions/stripe-actions';

interface CreateAdminContainerProps {
  params: { 
    locale: string 
  }
}

// マッピングは共通ファイルに集約

export default async function CreateAdminContainer({
  params: { locale }
}: CreateAdminContainerProps) {
  const dictionary: CreateAdminLocale = pickDictionary(createAdminDictionaries, locale, 'en');
  
  // 現在のユーザー認証状態を確認
  const authUser = await getCurrentUserAction();

  // デバッグログ
  console.log('=== CreateAdminContainer デバッグ ===');
  console.log('authUser:', authUser);
  console.log('authUser.attributes:', authUser?.attributes);
  console.log('authUser.customerId (直接):', authUser?.customerId);
  console.log('authUser.attributes["custom:customerId"]:', authUser?.attributes?.['custom:customerId']);

  // 未ログインの場合はサインインページへ
  if (!authUser) {
    console.log('❌ 未認証ユーザー - サインインページにリダイレクト');
    return redirect(`/${locale}/signin`);
  }

  // Stripe顧客IDが未登録の場合は会社情報入力へ
  const customerId = authUser.attributes?.['custom:customerId'] || authUser.customerId;
  console.log('取得したcustomerId:', customerId);
  
  if (!customerId) {
    console.log('❌ customerIdが見つからない - 会社情報登録ページにリダイレクト');
    return redirect(`/${locale}/signup/create-company`);
  }

  // 管理ユーザーがすでに作成済みの場合は次のステップへ
  if (authUser.attributes?.preferred_username) {
    // 支払い方法の有無を確認
    const paymentCheck = await checkPaymentMethodsAction(customerId);
    if (!paymentCheck.hasPaymentMethods) {
      return redirect(`/${locale}/signup/payment`);
    }
    // すべて登録済み
    return redirect(`/${locale}/account/user`);
  }

  // 管理者作成画面を表示
  return (
    <main className="w-full">
      <CreateAdminPresentation 
        locale={locale} 
        dictionary={dictionary}
      />
    </main>
  );
}

// メタデータのエクスポート（必要に応じて）
export const metadata: Metadata = {
  title: '管理者アカウント作成 | siftbeam',
  description: '管理者アカウントの作成を行います。',
};