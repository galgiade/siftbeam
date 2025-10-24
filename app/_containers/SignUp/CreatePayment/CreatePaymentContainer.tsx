import { Metadata } from 'next';
import { getUserCustomAttributes } from "@/app/utils/cognito-utils";
import CreatePaymentPresentation from "./CreatePaymentPresentation";
import { redirect } from 'next/navigation';
import { UserAttributesDTO } from '@/app/lib/types/TypeAPIs';
import type { CreatePaymentLocale } from '@/app/dictionaries/createPayment/createPayment.d.ts';
import { createPaymentDictionaries, pickDictionary } from '@/app/dictionaries/mappings';

interface CreatePaymentContainerProps {
  params: { locale: string };
}

export default async function CreatePaymentContainer({ params }: CreatePaymentContainerProps) {
  const userAttributes = await getUserCustomAttributes();

  const locale = params.locale;
  
  // URLからロケールを取得
  // 未ログイン or 未登録の場合はサインアップページへ
  if (!userAttributes) {
    return redirect(`/${locale}/signin`);
  }
  
  // Stripe顧客IDが未登録の場合は会社情報入力へ
  if (!userAttributes['custom:customerId']) {
    return redirect(`/${locale}/signup/create-company`);
  }
  
  // 管理ユーザーが未登録の場合は管理者作成へ
  if (!userAttributes.preferred_username) {
    return redirect(`/${locale}/signup/create-admin`);
  }
  
  if (userAttributes && userAttributes['custom:customerId'] && userAttributes.preferred_username && userAttributes['custom:paymentMethodId']) {
    return redirect(`/${locale}/account/user`);
  }
  
  const dictionary: CreatePaymentLocale = pickDictionary(createPaymentDictionaries, locale, 'ja');
  // UserAttributesをUserAttributesDTOに変換
  const userAttributesDTO: UserAttributesDTO = {
    sub: userAttributes.sub || '',
    preferred_username: userAttributes.preferred_username || '',
    customerId: userAttributes['custom:customerId'] || '',
    role: userAttributes['custom:role'] || 'user',
    locale: userAttributes.locale || locale,
    paymentMethodId: userAttributes['custom:paymentMethodId']
  };

  return (
    <main className="w-full h-screen">
      <CreatePaymentPresentation 
          userAttributes={userAttributesDTO}
          dictionary={dictionary}
      />
    </main>
  );
}

// メタデータのエクスポート（必要に応じて）
export const metadata: Metadata = {
  title: '支払い方法の設定 | siftbeam',
  description: '支払い方法の設定を行います。',
};