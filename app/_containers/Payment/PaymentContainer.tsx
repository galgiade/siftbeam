import PaymentPresentation from "./PaymentPresentation";
import PaymentErrorDisplay from "./PaymentErrorDisplay";
import { requireUserProfile } from '@/app/lib/utils/require-auth';
import { paymentDictionaries, pickDictionary } from '@/app/dictionaries/mappings';
import type { PaymentLocale } from '@/app/dictionaries/payment/payment.d.ts';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function PaymentContainer({ locale }: { locale: string }) {
  try {
    // 辞書を取得
    const dictionary: PaymentLocale = pickDictionary(paymentDictionaries, locale, 'en');

    // ユーザーの属性を取得
    const userProfile = await requireUserProfile(locale);
    
    // 管理者権限チェック
    if (userProfile.role !== 'admin') {
      return (
        <PaymentErrorDisplay 
          error={dictionary.alert.accessDenied}
          dictionary={dictionary} 
        />
      );
    }

    const customerId = userProfile.customerId;

  // customerIdが存在する場合、Stripe APIから直接データを取得
  let paymentMethods = null;
  let defaultPaymentMethodId = null;
  let invoices = null;

  if (customerId) {
    try {
      // 並行してStripe APIから直接データを取得
      const [paymentMethodsData, customerData, invoicesData] = await Promise.all([
        stripe.paymentMethods.list({
          customer: customerId,
          type: 'card',
        }),
        stripe.customers.retrieve(customerId),
        stripe.invoices.list({
          customer: customerId,
          status: 'paid',
          limit: 20, // 初回は20件取得（ページネーション対応）
          expand: ['data.payment_intent'], // 追加情報を取得
        })
      ]);

      // 支払い方法を設定
      paymentMethods = paymentMethodsData.data;

      // デフォルト支払い方法を設定
      if (!customerData.deleted && customerData.invoice_settings?.default_payment_method) {
        defaultPaymentMethodId = typeof customerData.invoice_settings.default_payment_method === 'string' 
          ? customerData.invoice_settings.default_payment_method 
          : customerData.invoice_settings.default_payment_method.id;
      }

      // 請求書を設定
      invoices = invoicesData.data as any;

    } catch (error) {
      console.error('Error fetching payment data from Stripe:', error);
      // エラーが発生してもページは表示する
    }
  }

    return (
      <PaymentPresentation 
        customerId={customerId}
        dictionary={dictionary}
        paymentMethods={paymentMethods}
        defaultPaymentMethodId={defaultPaymentMethodId}
        invoices={invoices}
      />
    );
  } catch (error: any) {
    console.error('Error in PaymentContainer:', error);
    
    const dictionary: PaymentLocale = pickDictionary(paymentDictionaries, locale, 'en');
    
    return (
      <PaymentErrorDisplay 
        error={error.message || dictionary.alert.authError}
        dictionary={dictionary} 
      />
    );
  }
}
