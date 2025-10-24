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

  // ダミー請求書データ（UI確認用）- フィルターテスト用に多様なデータを追加
  const dummyInvoices = [
    {
      id: 'in_1234567890',
      number: 'INV-2024-001',
      amount_paid: 15000,
      currency: 'jpy',
      status: 'paid',
      created: Math.floor(new Date('2024-01-15').getTime() / 1000),
      invoice_pdf: 'https://example.com/invoice1.pdf'
    },
    {
      id: 'in_0987654321',
      number: 'INV-2024-002',
      amount_paid: 8500,
      currency: 'jpy',
      status: 'paid',
      created: Math.floor(new Date('2024-02-10').getTime() / 1000),
      invoice_pdf: 'https://example.com/invoice2.pdf'
    },
    {
      id: 'in_1122334455',
      number: 'INV-2024-003',
      amount_paid: 22000,
      currency: 'jpy',
      status: 'paid',
      created: Math.floor(new Date('2024-03-05').getTime() / 1000),
      invoice_pdf: 'https://example.com/invoice3.pdf'
    },
    {
      id: 'in_5566778899',
      number: 'INV-2024-004',
      amount_paid: 12800,
      currency: 'jpy',
      status: 'paid',
      created: Math.floor(new Date('2024-04-20').getTime() / 1000),
      invoice_pdf: 'https://example.com/invoice4.pdf'
    },
    {
      id: 'in_9988776655',
      number: 'INV-2024-005',
      amount_paid: 35000,
      currency: 'jpy',
      status: 'paid',
      created: Math.floor(new Date('2024-05-12').getTime() / 1000),
      invoice_pdf: 'https://example.com/invoice5.pdf'
    },
    {
      id: 'in_2233445566',
      number: 'INV-2024-006',
      amount_paid: 5000,
      currency: 'jpy',
      status: 'paid',
      created: Math.floor(new Date('2024-06-08').getTime() / 1000),
      invoice_pdf: 'https://example.com/invoice6.pdf'
    },
    {
      id: 'in_7788990011',
      number: 'INV-2024-007',
      amount_paid: 45000,
      currency: 'jpy',
      status: 'paid',
      created: Math.floor(new Date('2024-07-22').getTime() / 1000),
      invoice_pdf: 'https://example.com/invoice7.pdf'
    },
    {
      id: 'in_3344556677',
      number: 'INV-2024-008',
      amount_paid: 18500,
      currency: 'jpy',
      status: 'paid',
      created: Math.floor(new Date('2024-08-14').getTime() / 1000),
      invoice_pdf: 'https://example.com/invoice8.pdf'
    },
    {
      id: 'in_4455667788',
      number: 'INV-2024-009',
      amount_paid: 3200,
      currency: 'jpy',
      status: 'paid',
      created: Math.floor(new Date('2024-09-03').getTime() / 1000),
      invoice_pdf: 'https://example.com/invoice9.pdf'
    },
    {
      id: 'in_5566778800',
      number: 'INV-2024-010',
      amount_paid: 28000,
      currency: 'jpy',
      status: 'paid',
      created: Math.floor(new Date('2024-10-01').getTime() / 1000),
      invoice_pdf: 'https://example.com/invoice10.pdf'
    }
  ];

  // customerIdが存在する場合、Stripe APIから直接データを取得
  let paymentMethods = null;
  let defaultPaymentMethodId = null;
  let invoices = dummyInvoices; // デフォルトでダミーデータを設定

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
          limit: 100, // Stripe APIの最大値
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

      // 請求書を設定（実データがある場合のみ）
      if (invoicesData.data && invoicesData.data.length > 0) {
        invoices = invoicesData.data as any;
      }

    } catch (error) {
      console.error('Error fetching payment data from Stripe:', error);
      // エラーが発生してもページは表示する（ダミーデータを使用）
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
