'use server'

import Stripe from 'stripe';
import { redirect } from 'next/navigation';
import { getUserCustomAttributes } from '@/app/utils/cognito-utils';
import { ApiResponse, UserAttributesDTO } from '@/app/lib/types/TypeAPIs';
import { UpdateUserAttributesCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient } from '@/app/lib/aws-clients';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export interface PaymentSubscriptionData {
  subscriptionId: string;
  paymentMethodId: string;
  customerId: string;
}

export default async function createPaymentSubscription(
  prevState: any,
  formData: FormData
): Promise<ApiResponse<PaymentSubscriptionData>> {
  try {
    const setupIntentId = formData.get('setupIntentId') as string;
    const paymentMethodId = formData.get('paymentMethodId') as string;

    if (!setupIntentId || !paymentMethodId) {
      return {
        success: false,
        message: 'Setup Intent ID and Payment Method ID are required',
        errors: { general: ['必要な情報が不足しています'] }
      };
    }

    const currentUserAttributes = await getUserCustomAttributes();
    if (!currentUserAttributes || !currentUserAttributes['custom:customerId']) {
      return {
        success: false,
        message: 'User not authenticated or customer ID not found',
        errors: { general: ['ユーザー認証エラーまたは顧客IDが見つかりません'] }
      };
    }

    const customerId = currentUserAttributes['custom:customerId'];

    // 1. Payment Methodをカスタマーにアタッチ（まだアタッチされていない場合）
    try {
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId
      });
    } catch (attachError: any) {
      // 既にアタッチされている場合はエラーを無視
      if (!attachError.message?.includes('already been attached')) {
        throw attachError;
      }
    }

    // 2. Stripeでデフォルト支払い方法を設定
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId
      }
    });

    // 3. Cognitoのカスタム属性を更新
    try {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      const accessToken = cookieStore.get('accessToken')?.value;
      
      if (!accessToken) {
        throw new Error('Access token not found');
      }

      const updateCommand = new UpdateUserAttributesCommand({
        AccessToken: accessToken,
        UserAttributes: [
          {
            Name: 'custom:paymentMethodId',
            Value: paymentMethodId
          }
        ]
      });

      await cognitoClient.send(updateCommand);
      console.log('Cognito attributes updated successfully');
    } catch (cognitoError) {
      console.error('Error updating Cognito attributes:', cognitoError);
      // Cognito更新に失敗した場合でもStripeは成功しているので、警告として記録
      console.warn('Stripe payment method set successfully, but Cognito update failed');
      
      // 必要に応じて、Cognito更新の失敗をユーザーに通知
      // ただし、Stripeの設定は成功しているので、エラーとして返さない
    }

    // 4. 環境変数の確認
    const processingPriceId = process.env.STRIPE_PRICE_PROCESSING_ID;

    if (!processingPriceId) {
      throw new Error('Stripe price ID is not configured. Please check environment variables.');
    }

    console.log('Creating subscription with price:', { processingPriceId });

    // 5. クレジットカード式請求日設定（締め日: 月末、請求日: 翌月5日）
    const now = new Date();
    // 日本時間での現在日時を取得（UTC+9）
    const jstOffset = 9 * 60 * 60 * 1000; // 9時間をミリ秒で
    const nowJST = new Date(now.getTime() + jstOffset);
    
    const currentYear = nowJST.getFullYear();
    const currentMonth = nowJST.getMonth();
    
    // 来月の5日を請求日として設定（JST）
    const billingDate = new Date(currentYear, currentMonth + 1, 5, 0, 0, 0, 0);
    
    // UTCタイムスタンプに変換（JST -> UTC）
    const billingCycleAnchor = Math.floor((billingDate.getTime() - jstOffset) / 1000);
    
    console.log('Current JST:', nowJST.toISOString());
    console.log('締め日: 月末、請求日: 来月5日');
    console.log('Next billing date (JST):', billingDate.toISOString());
    console.log('Billing cycle anchor (UTC timestamp):', billingCycleAnchor);

    // 6. 従量課金対応のサブスクリプションを作成（請求日固定）
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: processingPriceId, // 処理料金（従量課金、1年間保管込み）
          // 従量課金の場合、quantityは設定しない
        }
      ],
      default_payment_method: paymentMethodId,
      // 請求サイクルを毎月5日に固定
      billing_cycle_anchor: billingCycleAnchor,
      // 従量課金の場合、最初の請求書は作成しない
      proration_behavior: 'none',
      expand: ['latest_invoice.payment_intent']
    });

    // 成功時はユーザーページにリダイレクト
    const userLocale = currentUserAttributes.locale || 'ja';
    
    // Next.js 15のServer Actionでのリダイレクト
    redirect(`/${userLocale}/account/user`);
  } catch (error: any) {
    console.error('Error creating payment subscription:', error);
    
    // NEXT_REDIRECTエラーの場合は再スロー（Next.jsの正常な動作）
    if (error.digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    
    // Stripeエラーの詳細を取得
    let errorMessage = '支払い設定の作成に失敗しました';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      message: `Failed to create payment subscription: ${errorMessage}`,
      errors: { general: [errorMessage] }
    };
  }
}
