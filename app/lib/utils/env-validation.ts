/**
 * 環境変数検証ユーティリティ
 * 
 * アプリケーション起動時に必須の環境変数をチェックし、
 * 未設定の場合はエラーをスローします。
 */

import { debugLog, errorLog, warnLog } from '@/app/lib/utils/logger';

/**
 * 必須環境変数のリスト
 */
const REQUIRED_ENV_VARS = [
  // AWS設定
  'REGION',
  'ACCESS_KEY_ID',
  'SECRET_ACCESS_KEY',
  
  // Cognito設定
  'COGNITO_CLIENT_ID',
  'COGNITO_USER_POOL_ID',
  
  // DynamoDB設定
  'USER_TABLE_NAME',
  'GROUP_TABLE_NAME',
  'USER_GROUP_TABLE_NAME',
  'POLICY_GROUP_TABLE_NAME',
  'POLICY_TABLE_NAME',
  'API_KEY_TABLE_NAME',
  'VERIFICATION_CODES_TABLE_NAME',
  
  // SES設定
  'SES_FROM_EMAIL',
  
  // Stripe設定
  'STRIPE_SECRET_KEY',
  'STRIPE_PRICE_PROCESSING_ID',
  'STRIPE_PRICE_STORAGE_ID',
  
  // API Gateway設定
  'USAGE_PLAN_ID',
] as const;

/**
 * オプション環境変数のリスト（警告のみ）
 */
const OPTIONAL_ENV_VARS = [
  'NEXT_PUBLIC_GA_MEASUREMENT_ID',
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
] as const;

/**
 * 必須環境変数が設定されているかチェック
 * @throws {Error} 必須環境変数が未設定の場合
 */
export function validateRequiredEnvVars(): void {
  const missingVars: string[] = [];

  for (const varName of REQUIRED_ENV_VARS) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  }

  if (missingVars.length > 0) {
    const errorMessage = [
      '🚨 必須環境変数が設定されていません:',
      ...missingVars.map(v => `  - ${v}`),
      '',
      '.env.localファイルを確認してください。',
    ].join('\n');

    throw new Error(errorMessage);
  }
}

/**
 * オプション環境変数が設定されているかチェック（警告のみ）
 */
export function checkOptionalEnvVars(): void {
  const missingVars: string[] = [];

  for (const varName of OPTIONAL_ENV_VARS) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  }

  if (missingVars.length > 0 && process.env.NODE_ENV === 'development') {
    warnLog('⚠️  オプション環境変数が未設定です:');
    missingVars.forEach(v => warnLog(`  - ${v}`));
    warnLog('一部の機能が制限される可能性があります。\n');
  }
}

/**
 * 環境変数を安全に取得する
 * @param key - 環境変数名
 * @param defaultValue - デフォルト値（オプション）
 * @returns 環境変数の値
 * @throws {Error} 環境変数が未設定でデフォルト値もない場合
 */
export function getRequiredEnv(key: string, defaultValue?: string): string {
  const value = process.env[key];
  
  if (!value) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Required environment variable ${key} is not set`);
  }
  
  return value;
}

/**
 * 環境変数を安全に取得する（オプション）
 * @param key - 環境変数名
 * @param defaultValue - デフォルト値
 * @returns 環境変数の値またはデフォルト値
 */
export function getOptionalEnv(key: string, defaultValue: string = ''): string {
  return process.env[key] || defaultValue;
}

/**
 * すべての環境変数を検証する
 * アプリケーション起動時に呼び出してください
 */
export function validateAllEnvVars(): void {
  debugLog('🔍 環境変数を検証中...');
  
  try {
    validateRequiredEnvVars();
    debugLog('✅ 必須環境変数の検証完了');
    
    checkOptionalEnvVars();
    
    debugLog('✅ 環境変数の検証が完了しました\n');
  } catch (error) {
    errorLog(error);
    process.exit(1);
  }
}

