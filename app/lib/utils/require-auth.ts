'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getUserCustomAttributes, type UserAttributes } from '@/app/utils/cognito-utils';

export interface UserProfile {
  sub: string;
  email: string;
  preferred_username: string;
  locale: string;
  customerId: string;
  role: string;
  paymentMethodId?: string;
}

export async function requireUserProfile(locale: string = 'ja'): Promise<UserProfile> {
  try {
    const userAttributes = await getUserCustomAttributes();
    
    if (!userAttributes) {
      console.log('No user attributes found, redirecting to signin');
      redirect(`/${locale}/signin`);
    }

    // 必要な属性が不足している場合の処理
    if (!userAttributes.sub) {
      redirect(`/${locale}/signin`);
    }
    
    console.log('userAttributes:', userAttributes);
    console.log('userAttributes.custom:customerId:', userAttributes['custom:customerId']);
    console.log('userAttributes.preferred_username:', userAttributes.preferred_username);
    console.log('userAttributes.locale:', userAttributes.locale);
    console.log('userAttributes.custom:role:', userAttributes['custom:role']);
    console.log('userAttributes.custom:paymentMethodId:', userAttributes['custom:paymentMethodId']);
    
    // Stripe顧客IDが未設定の場合は会社情報登録へ
    if (!userAttributes['custom:customerId']) {
      console.log('customerId未設定 - 会社情報登録ページにリダイレクト');
      redirect(`/${locale}/signup/create-company`);
    }

    // 管理者プロファイルが未設定の場合は管理者作成へ
    if (!userAttributes.preferred_username) {
      console.log('preferred_username未設定 - 管理者作成ページにリダイレクト');
      redirect(`/${locale}/signup/create-admin`);
    }

    // 支払い方法が未設定の場合は支払い方法登録ページへ
    if (!userAttributes['custom:paymentMethodId']) {
      console.log('paymentMethodId未設定 - 支払い方法登録ページにリダイレクト');
      redirect(`/${locale}/signup/payment`);
    }
    if (userAttributes['custom:deletionRequestedAt']) {
      console.log('deletionRequestedAt設定 - 削除キャンセルページにリダイレクト');
      redirect(`/${locale}/account/account-deletion`);
    }
    return {
      sub: userAttributes.sub,
      email: userAttributes.email || '',
      preferred_username: userAttributes.preferred_username,
      locale: userAttributes.locale || locale,
      customerId: userAttributes['custom:customerId'],
      role: userAttributes['custom:role'] || 'user',
      paymentMethodId: userAttributes['custom:paymentMethodId']
    };
  } catch (error: any) {
    console.error('Error in requireUserProfile:', error);
    
    // NEXT_REDIRECTエラーの場合は再スロー（Next.jsの正常な動作）
    if (error.digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    
    // その他のエラーの場合はサインインページにリダイレクト
    redirect(`/${locale}/signin`);
  }
}

export async function requireAuth(locale: string = 'ja'): Promise<UserAttributes> {
  try {
    const userAttributes = await getUserCustomAttributes();
    
    if (!userAttributes) {
      redirect(`/${locale}/signin`);
    }

    return userAttributes;
  } catch (error) {
    console.error('Error in requireAuth:', error);
    redirect(`/${locale}/signin`);
  }
}
