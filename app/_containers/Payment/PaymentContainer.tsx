import PaymentPresentation from "./PaymentPresentation";
import { getUserCustomAttributes } from '@/app/utils/cognito-utils';
import { paymentMethodsDictionaries, pickDictionary } from '@/app/dictionaries/mappings';
import type { PaymentMethodsLocale } from '@/app/dictionaries/paymentMethods/paymentMethods.d.ts';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function PaymentContainer({ locale }: { locale: string }) {
  // ユーザーの属性を取得してcustomerIdを取得
  const userAttributes = await getUserCustomAttributes();
  const customerId = userAttributes?.['custom:customerId'];
  
  // 辞書を取得
  const dictionary: PaymentMethodsLocale = pickDictionary(paymentMethodsDictionaries, locale, 'en');

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
}
