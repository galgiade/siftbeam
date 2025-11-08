'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getUserCustomAttributes, type UserAttributes } from '@/app/utils/cognito-utils';
import { debugLog, errorLog, warnLog } from '@/app/lib/utils/logger';

export interface UserProfile {
  sub: string;
  email: string;
  preferred_username: string;
  locale: string;
  customerId: string;
  role: string;
  paymentMethodId?: string;
}

export async function requireUserProfile(locale: string = 'ja', skipDeletionCheck: boolean = false): Promise<UserProfile> {
  try {
    const userAttributes = await getUserCustomAttributes();
    
    if (!userAttributes) {
      debugLog('No user attributes found, redirecting to signin');
      redirect(`/${locale}/signin`);
    }

    // 必要な属性が不足している場合の処理
    if (!userAttributes.sub) {
      redirect(`/${locale}/signin`);
    }
    
    debugLog('userAttributes:', userAttributes);
    debugLog('userAttributes.custom:customerId:', userAttributes['custom:customerId']);
    debugLog('userAttributes.preferred_username:', userAttributes.preferred_username);
    debugLog('userAttributes.locale:', userAttributes.locale);
    debugLog('userAttributes.custom:role:', userAttributes['custom:role']);
    debugLog('userAttributes.custom:paymentMethodId:', userAttributes['custom:paymentMethodId']);
    
    // Stripe顧客IDが未設定の場合は会社情報登録へ
    if (!userAttributes['custom:customerId']) {
      debugLog('customerId未設定 - 会社情報登録ページにリダイレクト');
      redirect(`/${locale}/signup/create-company`);
    }

    // 管理者プロファイルが未設定の場合は管理者作成へ
    if (!userAttributes.preferred_username) {
      debugLog('preferred_username未設定 - 管理者作成ページにリダイレクト');
      redirect(`/${locale}/signup/create-admin`);
    }

    // 支払い方法が未設定の場合は支払い方法登録ページへ
    if (!userAttributes['custom:paymentMethodId']) {
      debugLog('paymentMethodId未設定 - 支払い方法登録ページにリダイレクト');
      redirect(`/${locale}/signup/payment`);
    }
    
    // 削除リクエストがある場合は削除ページにリダイレクト（無限ループ防止のためskipDeletionCheckで制御）
    if (!skipDeletionCheck && userAttributes['custom:deletionRequestedAt']) {
      debugLog('deletionRequestedAt設定 - アカウント削除キャンセルページにリダイレクト');
      redirect(`/${locale}/cancel-account-deletion`);
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
    // NEXT_REDIRECTエラーの場合は再スロー（Next.jsの正常な動作）
    if (error.digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    
    // その他のエラーの場合はログを出力してサインインページにリダイレクト
    errorLog('Error in requireUserProfile:', error);
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
  } catch (error: any) {
    // NEXT_REDIRECTエラーの場合は再スロー（Next.jsの正常な動作）
    if (error.digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    
    // その他のエラーの場合はログを出力してサインインページにリダイレクト
    errorLog('Error in requireAuth:', error);
    redirect(`/${locale}/signin`);
  }
}
