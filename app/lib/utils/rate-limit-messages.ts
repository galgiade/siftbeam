/**
 * レート制限メッセージのユーティリティ
 * 
 * レート制限のエラーメッセージをロケールに応じて取得します。
 */

import type { SignUpAuthLocale } from '@/app/dictionaries/signUpAuth/signUpAuth.d.ts';

/**
 * レート制限のメッセージキー
 */
export type RateLimitMessageKey = 
  | 'rateLimitExceeded'
  | 'rateLimitBlocked'
  | 'rateLimitSendExceeded'
  | 'rateLimitCheckExceeded';

/**
 * レート制限タイプからメッセージキーを取得
 * @param type - レート制限の種類
 * @param isBlocked - ブロックされているかどうか
 * @returns メッセージキー
 */
export function getRateLimitMessageKey(
  type: 'verification_code_send' | 'verification_code_check' | 'password_reset',
  isBlocked: boolean
): RateLimitMessageKey {
  if (isBlocked) {
    return 'rateLimitBlocked';
  }

  switch (type) {
    case 'verification_code_send':
      return 'rateLimitSendExceeded';
    case 'verification_code_check':
      return 'rateLimitCheckExceeded';
    case 'password_reset':
      return 'rateLimitExceeded';
    default:
      return 'rateLimitExceeded';
  }
}

/**
 * レート制限のメッセージを辞書から取得
 * @param dictionary - サインアップ辞書
 * @param messageKey - メッセージキー
 * @param resetAt - リセット時刻（オプション）
 * @returns ローカライズされたメッセージ
 */
export function getRateLimitMessage(
  dictionary: SignUpAuthLocale,
  messageKey: RateLimitMessageKey,
  resetAt?: Date
): string {
  const baseMessage = dictionary.alert[messageKey];
  
  if (resetAt) {
    // 日本語の場合は日本時間で表示
    const locale = 'ja-JP'; // デフォルトは日本語
    const formattedTime = resetAt.toLocaleString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    
    return `${baseMessage} (${formattedTime}以降に再試行可能)`;
  }
  
  return baseMessage;
}

