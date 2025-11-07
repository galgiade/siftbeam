'use server'

import Stripe from 'stripe';
import { getUserCustomAttributes, updateUserCustomAttribute } from '@/app/utils/cognito-utils';
import { logSuccessAction, logFailureAction } from '@/app/lib/actions/audit-log-actions';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export interface PaymentMethodsResponse {
  success: boolean;
  paymentMethods?: Stripe.PaymentMethod[];
  message?: string;
}

export interface SetupIntentData {
  id: string;
  status: string;
  customer: string | null;
  payment_method_types: string[];
  usage: string;
  created: number;
  livemode: boolean;
  payment_method?: string;
}

export interface SetupIntentResponse {
  success: boolean;
  data?: {
    client_secret: string;
    setupIntent: SetupIntentData;
  };
  message?: string;
}

export interface ConfirmSetupIntentResponse {
  success: boolean;
  data?: {
    setupIntent: SetupIntentData;
  };
  error?: {
    message: string;
  };
}

// 支払い方法一覧を取得
export async function getPaymentMethodsAction(customerId: string): Promise<PaymentMethodsResponse> {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });

    return {
      success: true,
      paymentMethods: paymentMethods.data
    };
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return {
      success: false,
      message: 'Failed to fetch payment methods'
    };
  }
}

// デフォルト支払い方法を取得
export async function getDefaultPaymentMethodAction(customerId: string) {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    
    if (customer.deleted) {
      return {
        success: false,
        message: 'Customer not found'
      };
    }

    const defaultPaymentMethodId = customer.invoice_settings?.default_payment_method;

    return {
      success: true,
      defaultPaymentMethodId: typeof defaultPaymentMethodId === 'string' ? defaultPaymentMethodId : null
    };
  } catch (error) {
    console.error('Error fetching default payment method:', error);
    return {
      success: false,
      message: 'Failed to fetch default payment method'
    };
  }
}

// Setup Intentを作成（Stripeドキュメント準拠）
export async function createSetupIntentAction(): Promise<SetupIntentResponse> {
  try {
    const userAttributes = await getUserCustomAttributes();
    
    if (!userAttributes || !userAttributes['custom:customerId']) {
      return {
        success: false,
        message: 'User not authenticated or customer ID not found'
      };
    }

    // Stripeドキュメントに基づくSetupIntent作成
    const setupIntent = await stripe.setupIntents.create({
      customer: userAttributes['custom:customerId'],
      payment_method_types: ['card'],
      usage: 'off_session',
      confirm: false // クライアント側で確認するため
    });

    return {
      success: true,
      data: {
        client_secret: setupIntent.client_secret!,
        setupIntent: {
          id: setupIntent.id,
          status: setupIntent.status,
          customer: typeof setupIntent.customer === 'string' ? setupIntent.customer : setupIntent.customer?.id || null,
          payment_method_types: setupIntent.payment_method_types,
          usage: setupIntent.usage,
          created: setupIntent.created,
          livemode: setupIntent.livemode,
          payment_method: typeof setupIntent.payment_method === 'string' ? setupIntent.payment_method : setupIntent.payment_method?.id
        }
      }
    };
  } catch (error) {
    console.error('Error creating setup intent:', error);
    return {
      success: false,
      message: 'Failed to create setup intent'
    };
  }
}

// Setup Intentを確認
export async function confirmSetupIntentAction(
  clientSecret: string,
  paymentMethodId: string
): Promise<ConfirmSetupIntentResponse> {
  try {
    const userAttributes = await getUserCustomAttributes();
    
    if (!userAttributes || !userAttributes['custom:customerId']) {
      return {
        success: false,
        error: {
          message: 'User not authenticated or customer ID not found'
        }
      };
    }

    // Setup Intentを確認
    const setupIntentId = clientSecret.split('_secret_')[0];
    
    // Payment Methodをカスタマーにアタッチ
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: userAttributes['custom:customerId']
    });

    // Setup Intentを確認
    const setupIntent = await stripe.setupIntents.confirm(setupIntentId, {
      payment_method: paymentMethodId
    });

    // 既存の支払い方法を確認
    const existingPaymentMethods = await stripe.paymentMethods.list({
      customer: userAttributes['custom:customerId'],
      type: 'card',
    });

    // 最初のカードの場合、自動的にデフォルトに設定
    if (existingPaymentMethods.data.length === 1) {
      await stripe.customers.update(userAttributes['custom:customerId'], {
        invoice_settings: {
          default_payment_method: paymentMethodId
        }
      });

      // Cognitoのカスタム属性も更新
      const cognitoUpdateResult = await updateUserCustomAttribute('custom:paymentMethodId', paymentMethodId);
      
      if (!cognitoUpdateResult.success) {
        console.warn('Failed to update Cognito paymentMethodId for first card:', cognitoUpdateResult.message);
      }
    }

    return {
      success: true,
      data: {
        setupIntent: {
          id: setupIntent.id,
          status: setupIntent.status,
          customer: typeof setupIntent.customer === 'string' ? setupIntent.customer : setupIntent.customer?.id || null,
          payment_method_types: setupIntent.payment_method_types,
          usage: setupIntent.usage,
          created: setupIntent.created,
          livemode: setupIntent.livemode,
          payment_method: typeof setupIntent.payment_method === 'string' ? setupIntent.payment_method : setupIntent.payment_method?.id
        }
      }
    };
  } catch (error) {
    console.error('Error confirming setup intent:', error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to confirm setup intent'
      }
    };
  }
}

// デフォルト支払い方法を設定
export async function setDefaultPaymentMethodAction(paymentMethodId: string) {
  try {
    const userAttributes = await getUserCustomAttributes();
    
    if (!userAttributes || !userAttributes['custom:customerId']) {
      return {
        success: false,
        message: 'User not authenticated or customer ID not found'
      };
    }

    const customerId = userAttributes['custom:customerId'];

    // 更新前のデフォルト支払い方法を取得（監査ログ用）
    const customer = await stripe.customers.retrieve(customerId);
    
    if (customer.deleted) {
      return {
        success: false,
        message: 'Customer not found'
      };
    }

    const oldDefaultPaymentMethodId = customer.invoice_settings?.default_payment_method;
    const oldDefaultId = typeof oldDefaultPaymentMethodId === 'string' 
      ? oldDefaultPaymentMethodId 
      : oldDefaultPaymentMethodId?.id || '';

    // Stripeでデフォルト支払い方法を設定
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId
      }
    });

    // Cognitoのカスタム属性も更新
    const cognitoUpdateResult = await updateUserCustomAttribute('custom:paymentMethodId', paymentMethodId);
    
    if (!cognitoUpdateResult.success) {
      console.warn('Failed to update Cognito paymentMethodId:', cognitoUpdateResult.message);
      // Cognitoの更新に失敗してもStripeの更新は成功しているので、警告のみ
    }

    // 監査ログ記録（成功）
    await logSuccessAction('UPDATE', 'PaymentMethod', 'defaultPaymentMethod', oldDefaultId, paymentMethodId);

    return {
      success: true,
      message: 'Default payment method set successfully'
    };
  } catch (error: any) {
    console.error('Error setting default payment method:', error);
    
    // 監査ログ記録（失敗）
    await logFailureAction('UPDATE', 'PaymentMethod', error?.message || 'Failed to set default payment method', 'defaultPaymentMethod', '', paymentMethodId);
    
    return {
      success: false,
      message: 'Failed to set default payment method'
    };
  }
}

// 請求書一覧を取得（ページネーション対応）
export async function getInvoicesAction(customerId: string, limit: number = 20, startingAfter?: string) {
  try {
    const params: Stripe.InvoiceListParams = {
      customer: customerId,
      status: 'paid',
      limit: limit,
    };

    // ページネーション用のパラメータ
    if (startingAfter) {
      params.starting_after = startingAfter;
    }

    const invoices = await stripe.invoices.list(params);

    return {
      success: true,
      invoices: invoices.data,
      hasMore: invoices.has_more
    };
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return {
      success: false,
      message: 'Failed to fetch invoices',
      hasMore: false
    };
  }
}

// 請求書PDFを取得
export async function getInvoicePdfAction(invoiceId: string) {
  try {
    const userAttributes = await getUserCustomAttributes();
    
    if (!userAttributes || !userAttributes['custom:customerId']) {
      return {
        success: false,
        message: 'User not authenticated or customer ID not found'
      };
    }

    // 請求書を取得して顧客IDを確認
    const invoice = await stripe.invoices.retrieve(invoiceId);
    
    if (invoice.customer !== userAttributes['custom:customerId']) {
      return {
        success: false,
        message: 'Unauthorized access to invoice'
      };
    }

    // 請求書のPDF URLを取得
    const pdfUrl = invoice.invoice_pdf;
    
    if (!pdfUrl) {
      return {
        success: false,
        message: 'PDF not available for this invoice'
      };
    }

    return {
      success: true,
      pdfUrl: pdfUrl,
      invoiceNumber: invoice.number
    };
  } catch (error) {
    console.error('Error fetching invoice PDF:', error);
    return {
      success: false,
      message: 'Failed to fetch invoice PDF'
    };
  }
}

// 支払い方法を削除（デフォルト以外のみ）
export async function deletePaymentMethodAction(paymentMethodId: string) {
  try {
    const userAttributes = await getUserCustomAttributes();
    
    if (!userAttributes || !userAttributes['custom:customerId']) {
      return {
        success: false,
        message: 'User not authenticated or customer ID not found'
      };
    }

    const customerId = userAttributes['custom:customerId'];

    // デフォルト支払い方法を確認
    const customer = await stripe.customers.retrieve(customerId);
    
    if (customer.deleted) {
      return {
        success: false,
        message: 'Customer not found'
      };
    }

    const defaultPaymentMethodId = customer.invoice_settings?.default_payment_method;
    const defaultId = typeof defaultPaymentMethodId === 'string' 
      ? defaultPaymentMethodId 
      : defaultPaymentMethodId?.id;

    // デフォルト支払い方法の場合は削除を拒否
    if (defaultId === paymentMethodId) {
      return {
        success: false,
        message: 'Cannot delete default payment method. Please set another card as default first.'
      };
    }

    // 削除前の支払い方法情報を取得（監査ログ用）
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
    const cardInfo = paymentMethod.card 
      ? `${paymentMethod.card.brand} **** ${paymentMethod.card.last4}` 
      : paymentMethodId;

    // 支払い方法をデタッチ（削除）
    await stripe.paymentMethods.detach(paymentMethodId);

    // 監査ログ記録（成功）
    await logSuccessAction('DELETE', 'PaymentMethod', 'paymentMethod', cardInfo, '');

    return {
      success: true,
      message: 'Payment method deleted successfully'
    };
  } catch (error: any) {
    console.error('Error deleting payment method:', error);
    
    // 監査ログ記録（失敗）
    await logFailureAction('DELETE', 'PaymentMethod', error?.message || 'Failed to delete payment method', 'paymentMethod', '', '');
    
    return {
      success: false,
      message: 'Failed to delete payment method'
    };
  }
}

// サブスクリプション作成
export async function createSubscriptionAction(paymentMethodId: string) {
  try {
    const userAttributes = await getUserCustomAttributes();
    
    if (!userAttributes || !userAttributes['custom:customerId']) {
      return {
        success: false,
        message: 'User not authenticated or customer ID not found'
      };
    }

    const customerId = userAttributes['custom:customerId'];

    // 環境変数の確認
    const processingPriceId = process.env.STRIPE_PRICE_PROCESSING_ID;
    const storagePriceId = process.env.STRIPE_PRICE_STORAGE_ID;

    if (!processingPriceId || !storagePriceId) {
      throw new Error('Stripe price IDs are not configured. Please check environment variables.');
    }

    // 請求サイクル設定（締め日: 月末、請求日: 翌月1日、支払期日: 翌月5日）
    const now = new Date();
    // 日本時間での現在日時を取得（UTC+9）
    const jstOffset = 9 * 60 * 60 * 1000; // 9時間をミリ秒で
    const nowJST = new Date(now.getTime() + jstOffset);
    
    const currentYear = nowJST.getFullYear();
    const currentMonth = nowJST.getMonth();
    
    // 来月の1日を請求サイクルの開始日として設定（JST）
    // これにより、月末締め（当月1日〜末日）→翌月1日に請求書発行となる
    const billingDate = new Date(currentYear, currentMonth + 1, 1, 0, 0, 0, 0);
    
    // UTCタイムスタンプに変換（JST -> UTC）
    const billingCycleAnchor = Math.floor((billingDate.getTime() - jstOffset) / 1000);

    // 従量課金対応のサブスクリプションを作成（月末締め）
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: processingPriceId, // 処理料金（従量課金）
        },
        {
          price: storagePriceId, // ストレージ料金（従量課金）
        }
      ],
      default_payment_method: paymentMethodId,
      // 請求サイクルを毎月1日開始（前月1日〜末日の利用分を集計）
      billing_cycle_anchor: billingCycleAnchor,
      // カード自動決済（請求書発行時に即座に決済される）
      collection_method: 'charge_automatically',
      // 従量課金の場合、最初の請求書は作成しない
      proration_behavior: 'none',
      expand: ['latest_invoice.payment_intent']
    });

    // 監査ログ記録（成功）
    await logSuccessAction('CREATE', 'Subscription', 'subscriptionId', '', subscription.id);

    return {
      success: true,
      data: {
        subscriptionId: subscription.id,
        status: subscription.status
      },
      message: 'Subscription created successfully'
    };
  } catch (error: any) {
    console.error('Error creating subscription:', error);
    
    // 監査ログ記録（失敗）
    await logFailureAction('CREATE', 'Subscription', error?.message || 'Failed to create subscription', 'subscriptionId', '', '');
    
    return {
      success: false,
      message: 'Failed to create subscription'
    };
  }
}
