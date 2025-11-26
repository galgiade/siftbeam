"use client"

import { useState, useActionState, useTransition, useEffect } from "react";
import { loadStripe, type StripeElementLocale } from '@stripe/stripe-js';
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { BreadcrumbItem, Breadcrumbs, Button, Link, Alert } from "@heroui/react";
import { UserAttributesDTO } from "@/app/lib/types/TypeAPIs";
import type { CreatePaymentLocale } from '@/app/dictionaries/createPayment/createPayment.d.ts';
import { mapToStripeLocale } from "@/app/lib/constants/locales";
import createPaymentSubscription from "@/app/lib/actions/create/createPaymentSubscription";
import { createSetupIntentAction } from '@/app/lib/actions/payment-actions';
import { trackPurchase } from "@/app/lib/utils/analytics";
import { useRouter } from 'next/navigation';

// Stripeの公開キーを設定（環境変数から取得）
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;
const stripePromise = loadStripe(stripePublishableKey);

interface CreatePaymentPresentationProps {
  userAttributes: UserAttributesDTO;
  dictionary: CreatePaymentLocale;
}

// カード入力フォームコンポーネント
function CardForm({ userAttributes, dictionary }: { userAttributes: UserAttributesDTO; dictionary: CreatePaymentLocale }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // 追加: 有効期限・CVCのバリデーション
  const [expiryError, setExpiryError] = useState<string | null>(null);
  const [cvcError, setCvcError] = useState<string | null>(null);
  const [expiryComplete, setExpiryComplete] = useState(false);
  const [cvcComplete, setCvcComplete] = useState(false);

  // Next.js 15のuseActionStateを使用してServer Actionと統合
  const [actionState, formAction] = useActionState(
    createPaymentSubscription,
    { success: false, message: '', errors: {} }
  );

  // Next.js 15のuseEffectでServer Action実行後の処理を最適化
  useEffect(() => {
    if (actionState.success && actionState.data?.subscriptionId) {
      // サブスクリプション作成成功時：コンバージョンを送信してからリダイレクト
      setError(null);
      
      // コンバージョンイベントを送信（従量課金のためvalueなし）
      trackPurchase(actionState.data.subscriptionId);
      
      // コンバージョン送信後にリダイレクト（少し遅延させて確実に送信）
      setTimeout(() => {
        const userLocale = userAttributes.locale || 'ja';
        router.push(`/${userLocale}/account/user`);
      }, 100);
    } else if (actionState.message && !actionState.success) {
      // エラー時はエラーメッセージを表示
      setError(actionState.message);
    }
  }, [actionState, router, userAttributes.locale]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    // 有効期限・CVCのバリデーション
    if (!expiryComplete) {
      setExpiryError(dictionary.alert.expiryRequired);
      return;
    }
    if (!cvcComplete) {
      setCvcError(dictionary.alert.cvcRequired);
      return;
    }

    setLoading(true);
    setError(null);
    setExpiryError(null);
    setCvcError(null);

    try {
      // 1. Setup IntentをServer Actionで作成
      const setupIntentResult = await createSetupIntentAction();

      if (!setupIntentResult.success || !setupIntentResult.data?.client_secret) {
        throw new Error(setupIntentResult.message || dictionary.alert.setupIntentFailed);
      }

      const { client_secret } = setupIntentResult.data;

      // 2. Payment Methodを作成
      const cardNumberElement = elements.getElement(CardNumberElement);

      if (!cardNumberElement) {
        throw new Error(dictionary.alert.cardInfoRequired);
      }

      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumberElement
      });

      if (pmError) {
        throw new Error(pmError.message);
      }

      // 3. Setup Intentをクライアントサイドで確認
      const { error: confirmError, setupIntent: confirmedSetupIntent } = await stripe.confirmCardSetup(client_secret, {
        payment_method: paymentMethod.id
      });

      if (confirmError) {
        throw new Error(confirmError.message || '3D Secure authentication failed');
      }

      if (confirmedSetupIntent?.status === 'succeeded') {
        // 4. Server Actionでサブスクリプション作成
        const form = new FormData();
        form.append('setupIntentId', confirmedSetupIntent.id);
        form.append('paymentMethodId', confirmedSetupIntent.payment_method as string);

        // Next.js 15のuseActionState - startTransition内で呼び出し
        startTransition(() => {
          formAction(form);
        });
      } else {
        throw new Error('Setup Intent confirmation failed');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : dictionary.alert.unknownError);
    } finally {
      setLoading(false);
    }
  };

  const elementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        fontFamily: 'Arial, sans-serif',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
    },
  };

  // 成功時はServer Actionでリダイレクトされるため、成功画面は不要

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-4">{dictionary.label.paymentSetupTitle}</h3>

      <form onSubmit={handleSubmit}>
        {/* カード情報入力フィールド */}
        <div className="flex flex-col gap-2 mb-6">
          <label className="text-sm font-medium text-gray-700">
            {dictionary.label.cardInfoLabel}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="border border-gray-300 rounded-md px-3 py-2 bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <CardNumberElement options={elementOptions} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              {dictionary.label.expiryLabel}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="border border-gray-300 rounded-md px-3 py-2 bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <CardExpiryElement
                options={elementOptions}
                onChange={(e: any) => {
                  setExpiryError(e.error ? e.error.message : null);
                  setExpiryComplete(e.complete);
                }}
              />
            </div>
            {expiryError && (
              <div className="text-xs text-red-500 mt-1">{expiryError}</div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              {dictionary.label.cvcLabel}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="border border-gray-300 rounded-md px-3 py-2 bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <CardCvcElement
                options={elementOptions}
                onChange={(e: any) => {
                  setCvcError(e.error ? e.error.message : null);
                  setCvcComplete(e.complete);
                }}
              />
            </div>
            {cvcError && (
              <div className="text-xs text-red-500 mt-1">{cvcError}</div>
            )}
          </div>
        </div>

        {/* エラー表示 */}
        {(error || actionState.message) && (
          <Alert color="danger" className="mb-4">
            {error || actionState.message}
          </Alert>
        )}

        <Button
          type="submit"
          isDisabled={!stripe || loading || isPending || !expiryComplete || !cvcComplete}
          isLoading={loading || isPending}
          color="primary"
          size="lg"
          className="w-full"
        >
          {loading || isPending ? dictionary.label.processing : dictionary.label.apply}
        </Button>
      </form>
    </div>
  );
}

export default function CreatePaymentPresentation({
  userAttributes,
  dictionary
}: CreatePaymentPresentationProps) {
  // Stripe公開キーが設定されていない場合のエラー表示
  const hasStripeKey = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  return (
    <div className="p-6 w-3/4 mx-auto">
      {!hasStripeKey ? (
        <Alert color="danger" className="mb-4">
          <p>Stripe設定エラー: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYが設定されていません。</p>
          <p>環境変数を設定してください。</p>
        </Alert>
      ) : (
        <>
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <span className="ml-2 text-sm  text-gray-500">{dictionary.label.accountCreation}</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <span className="ml-2 text-sm text-gray-500">{dictionary.label.companyInfo}</span>
              </div>
              <div className="flex items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <span className="ml-2 text-sm text-gray-500">{dictionary.label.adminSetup}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    4
                  </div>
                  <span className="ml-2 text-sm font-medium text-blue-600">{dictionary.label.paymentSetup}</span>
                </div>

              </div>
            </div>
          </div>
          <Elements stripe={stripePromise} options={{ locale: mapToStripeLocale(userAttributes?.locale || 'ja') as unknown as StripeElementLocale }}>
            <CardForm userAttributes={userAttributes} dictionary={dictionary} />
          </Elements>

          <div className="mt-6 text-xs text-gray-500 text-center">
            <p>{dictionary.label.cardInfoEncrypted}</p>
            <p>{dictionary.label.billingBasedOnUsage}</p>
            <p className="mt-2 text-blue-600 font-medium">
              {dictionary.label.dataRetentionNotice}
            </p>
            <p className="mt-2">
              {dictionary.label.agreeNoticePrefix}
              <Link
                href={`/${userAttributes?.locale || 'ja'}/terms`}
                isExternal
                className="underline hover:no-underline"
              >
                {dictionary.label.terms}
              </Link>
              {dictionary.label.and}
              <Link
                href={`/${userAttributes?.locale || 'ja'}/privacy`}
                isExternal
                className="underline hover:no-underline"
              >
                {dictionary.label.privacy}
              </Link>
              {dictionary.label.agreeNoticeSuffix}
            </p>
          </div>
        </>
      )}
    </div>
  );
}