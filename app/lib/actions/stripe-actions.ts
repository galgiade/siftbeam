'use server'

import Stripe from 'stripe';
import { getUserCustomAttributes } from '@/app/utils/cognito-utils';
import { UpdateUserAttributesCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient } from '@/app/lib/aws-clients';
import { logSuccessAction, logFailureAction } from '@/app/lib/actions/audit-log-actions';
import { debugLog, errorLog, warnLog } from '@/app/lib/utils/logger';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export interface PaymentMethodsCheckResult {
  success: boolean;
  hasPaymentMethods: boolean;
  paymentMethods?: Stripe.PaymentMethod[];
  message?: string;
}

export interface CreateStripeCustomerResult {
  success: boolean;
  customerId?: string;
  message?: string;
  errors?: { [key: string]: string };
}

// Stripe顧客情報の型定義
export interface StripeCustomer {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  address: {
    city: string | null;
    country: string | null;
    line1: string | null;
    line2: string | null;
    postal_code: string | null;
    state: string | null;
  } | null;
  created: number;
  description: string | null;
  metadata: Record<string, string>;
}

// 顧客情報更新用の型定義
export interface CustomerUpdateInput {
  name?: string;
  email?: string;
  phone?: string;
  address?: {
    city?: string;
    country?: string;
    line1?: string;
    line2?: string;
    postal_code?: string;
    state?: string;
  };
  description?: string;
  metadata?: Record<string, string>;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

// 国名から国コードへの変換（日本語名対応）
function convertCountryNameToCode(countryName: string): string {
  if (!countryName) return '';
  
  // 既に国コードの場合はそのまま返す
  if (countryName.length === 2 && countryName.match(/^[A-Z]{2}$/)) {
    debugLog('✅ Already country code:', countryName);
    return countryName;
  }
  
  // 日本語国名のマッピング
  const countryMapping: Record<string, string> = {
    '日本': 'JP',
    'アメリカ合衆国': 'US',
    'アメリカ': 'US',
    '中国': 'CN',
    '韓国': 'KR',
    '大韓民国': 'KR',
    'イギリス': 'GB',
    'フランス': 'FR',
    'ドイツ': 'DE',
    'イタリア': 'IT',
    'スペイン': 'ES',
    'カナダ': 'CA',
    'オーストラリア': 'AU',
    'インド': 'IN',
    'ブラジル': 'BR',
    'ロシア': 'RU',
  };
  
  // 日本語名からの変換を試行
  if (countryMapping[countryName]) {
    debugLog(`✅ Country name "${countryName}" converted to code "${countryMapping[countryName]}"`);
    return countryMapping[countryName];
  }
  
  warnLog(`⚠️ Could not convert country name "${countryName}" to country code`);
  return countryName; // 変換できない場合はそのまま返す
}

// Stripe顧客情報を取得
export async function getStripeCustomerAction(customerId: string): Promise<ApiResponse<StripeCustomer>> {
  try {
    debugLog('Retrieving Stripe customer:', customerId);
    
    const customer = await stripe.customers.retrieve(customerId);
    
    if (customer.deleted) {
      return {
        success: false,
        message: '顧客が削除されています。',
      };
    }
    
    const customerData: StripeCustomer = {
      id: customer.id,
      name: customer.name ?? null,
      email: customer.email ?? null,
      phone: customer.phone ?? null,
      address: customer.address ?? null,
      created: customer.created,
      description: customer.description ?? null,
      metadata: customer.metadata,
    };
    
    debugLog('✅ Customer retrieved successfully:', customer.id);
    
    return {
      success: true,
      message: '顧客情報を取得しました。',
      data: customerData,
    };
  } catch (error: any) {
    errorLog('❌ Error retrieving customer:', error);
    return {
      success: false,
      message: error?.message || '顧客情報の取得に失敗しました。',
    };
  }
}

// Stripe顧客情報を更新
export async function updateStripeCustomerAction(
  customerId: string,
  updateData: CustomerUpdateInput
): Promise<ApiResponse<StripeCustomer>> {
  try {
    debugLog('Updating Stripe customer:', { customerId, updateData });
    
    // 更新前の値を取得（監査ログ用）
    const existingCustomer = await stripe.customers.retrieve(customerId);
    
    if (existingCustomer.deleted) {
      return {
        success: false,
        message: '顧客が削除されています。',
      };
    }
    
    // 住所フィールドが含まれている場合、既存の住所情報を取得してマージ
    if (updateData.address) {
      debugLog('Address update detected, merging with existing data...');
      
      // 既存の住所情報と新しい住所情報をマージ
      const currentAddress = existingCustomer.address || {
        city: null,
        country: null,
        line1: null,
        line2: null,
        postal_code: null,
        state: null,
      };
      updateData.address = {
        city: updateData.address.city ?? currentAddress.city ?? undefined,
        country: updateData.address.country ?? currentAddress.country ?? undefined,
        line1: updateData.address.line1 ?? currentAddress.line1 ?? undefined,
        line2: updateData.address.line2 ?? currentAddress.line2 ?? undefined,
        postal_code: updateData.address.postal_code ?? currentAddress.postal_code ?? undefined,
        state: updateData.address.state ?? currentAddress.state ?? undefined,
      };
      
      debugLog('Address merged:', { 
        current: currentAddress, 
        update: updateData.address 
      });
    }
    
    // 住所の国フィールドを国コードに変換（CreateCompanyと同じ処理）
    if (updateData.address?.country) {
      const originalCountry = updateData.address.country;
      updateData.address.country = convertCountryNameToCode(originalCountry);
      debugLog('Country field converted:', { original: originalCountry, converted: updateData.address.country });
    }
    
    // バリデーション
    const errors: Record<string, string> = {};
    
    if (updateData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updateData.email)) {
        errors.email = '有効なメールアドレスを入力してください。';
      }
    }
    
    if (updateData.phone) {
      const phoneRegex = /^[0-9\-\+\(\)\s]+$/;
      if (!phoneRegex.test(updateData.phone)) {
        errors.phone = '有効な電話番号を入力してください。';
      }
    }
    
    // 住所の国フィールドのバリデーション
    if (updateData.address?.country !== undefined) {
      const country = updateData.address.country;
      // 空文字、null、または無効な国コードをチェック
      if (!country || !country.trim()) {
        errors.country = '国は必須です。';
      } else if (!country.match(/^[A-Z]{2}$/)) {
        errors.country = '有効な国コード（2文字の大文字）を指定してください。';
      }
    }
    
    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: '入力内容に誤りがあります。',
        errors: Object.fromEntries(
          Object.entries(errors).map(([key, value]) => [key, [value]])
        ),
      };
    }
    
    // Stripe顧客情報を更新
    const updatedCustomer = await stripe.customers.update(customerId, updateData);
    
    const customerData: StripeCustomer = {
      id: updatedCustomer.id,
      name: updatedCustomer.name ?? null,
      email: updatedCustomer.email ?? null,
      phone: updatedCustomer.phone ?? null,
      address: updatedCustomer.address ?? null,
      created: updatedCustomer.created,
      description: updatedCustomer.description ?? null,
      metadata: updatedCustomer.metadata,
    };
    
    debugLog('✅ Customer updated successfully:', updatedCustomer.id);
    
    // 監査ログ記録（成功） - 各フィールドごとに記録
    if (updateData.name !== undefined) {
      await logSuccessAction('UPDATE', 'StripeCustomer', 'name', existingCustomer.name || '', updateData.name || '');
    }
    if (updateData.email !== undefined) {
      await logSuccessAction('UPDATE', 'StripeCustomer', 'email', existingCustomer.email || '', updateData.email || '');
    }
    if (updateData.phone !== undefined) {
      await logSuccessAction('UPDATE', 'StripeCustomer', 'phone', existingCustomer.phone || '', updateData.phone || '');
    }
    if (updateData.description !== undefined) {
      await logSuccessAction('UPDATE', 'StripeCustomer', 'description', existingCustomer.description || '', updateData.description || '');
    }
    if (updateData.address !== undefined) {
      const oldAddress = existingCustomer.address ? JSON.stringify(existingCustomer.address) : '';
      const newAddress = updateData.address ? JSON.stringify(updateData.address) : '';
      await logSuccessAction('UPDATE', 'StripeCustomer', 'address', oldAddress, newAddress);
    }
    
    return {
      success: true,
      message: '顧客情報が正常に更新されました。',
      data: customerData,
    };
  } catch (error: any) {
    errorLog('❌ Error updating customer:', error);
    
    // 監査ログ記録（失敗）
    await logFailureAction('UPDATE', 'StripeCustomer', error?.message || '顧客情報の更新に失敗しました', 'customerId', '', customerId);
    
    return {
      success: false,
      message: error?.message || '顧客情報の更新に失敗しました。',
    };
  }
}

export async function checkPaymentMethodsAction(customerId: string): Promise<PaymentMethodsCheckResult> {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });

    return {
      success: true,
      hasPaymentMethods: paymentMethods.data.length > 0,
      paymentMethods: paymentMethods.data
    };
  } catch (error) {
    errorLog('Error checking payment methods:', error);
    return {
      success: false,
      hasPaymentMethods: false,
      message: 'Failed to check payment methods'
    };
  }
}

export async function createStripeCustomerAction(formData: FormData): Promise<CreateStripeCustomerResult> {
  try {
    // フォームデータから情報を取得
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const country = formData.get('country') as string;
    const postalCode = formData.get('postalCode') as string;
    const state = formData.get('state') as string;
    const city = formData.get('city') as string;
    const line1 = formData.get('line1') as string;
    const line2 = formData.get('line2') as string;

    // バリデーション
    const errors: { [key: string]: string } = {};
    if (!name) errors.name = 'Name is required';
    if (!email) errors.email = 'Email is required';
    if (!phone) errors.phone = 'Phone is required';
    if (!country) errors.country = 'Country is required';
    if (!postalCode) errors.postalCode = 'Postal code is required';
    if (!state) errors.state = 'State is required';
    if (!city) errors.city = 'City is required';
    if (!line1) errors.line1 = 'Address line 1 is required';

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: 'Validation failed',
        errors
      };
    }

    // 現在のユーザー情報を取得
    const userAttributes = await getUserCustomAttributes();
    if (!userAttributes) {
      return {
        success: false,
        message: 'User not authenticated'
      };
    }

    // Stripe顧客を作成
    const customer = await stripe.customers.create({
      name,
      email,
      phone,
      address: {
        country,
        postal_code: postalCode,
        state,
        city,
        line1,
        line2: line2 || undefined
      },
      metadata: {
        user_id: userAttributes.sub || '',
        cognito_username: userAttributes.preferred_username || ''
      }
    });

    // Cognitoのカスタム属性を更新
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
            Name: 'custom:customerId',
            Value: customer.id
          }
        ]
      });

      await cognitoClient.send(updateCommand);
      debugLog('Cognito attributes updated successfully with customer ID:', customer.id);
    } catch (cognitoError) {
      errorLog('Error updating Cognito attributes:', cognitoError);
      // Cognito更新に失敗した場合でもStripeは成功しているので、警告として記録
      warnLog('Stripe customer created successfully, but Cognito update failed');
    }

    // 監査ログ記録（成功）
    await logSuccessAction('CREATE', 'StripeCustomer', 'customerId', '', customer.id);

    return {
      success: true,
      customerId: customer.id,
      message: 'Customer created successfully'
    };
  } catch (error: any) {
    errorLog('Error creating Stripe customer:', error);
    
    // 監査ログ記録（失敗）
    await logFailureAction('CREATE', 'StripeCustomer', error?.message || 'Failed to create customer', 'customerId', '', '');
    
    return {
      success: false,
      message: 'Failed to create customer'
    };
  }
}