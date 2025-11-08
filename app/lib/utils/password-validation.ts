/**
 * パスワード検証ユーティリティ
 * 
 * パスワードの要件:
 * - 最低8文字以上
 * - 大文字を1文字以上含む
 * - 小文字を1文字以上含む
 * - 数字を1文字以上含む
 * - 特殊文字は不要
 */

export interface PasswordValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * パスワードの強度を検証する
 * @param password - 検証するパスワード
 * @returns 検証結果
 */
export function validatePassword(password: string): PasswordValidationResult {
  // 長さチェック
  if (password.length < 8) {
    return {
      valid: false,
      error: 'パスワードは8文字以上で、大文字、小文字、数字を含む必要があります'
    };
  }

  // 小文字チェック
  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      error: 'パスワードは8文字以上で、大文字、小文字、数字を含む必要があります'
    };
  }

  // 大文字チェック
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      error: 'パスワードは8文字以上で、大文字、小文字、数字を含む必要があります'
    };
  }

  // 数字チェック
  if (!/\d/.test(password)) {
    return {
      valid: false,
      error: 'パスワードは8文字以上で、大文字、小文字、数字を含む必要があります'
    };
  }

  return { valid: true };
}

/**
 * パスワードとパスワード確認が一致するかチェック
 * @param password - パスワード
 * @param confirmPassword - パスワード確認
 * @returns 検証結果
 */
export function validatePasswordMatch(
  password: string,
  confirmPassword: string
): PasswordValidationResult {
  if (password !== confirmPassword) {
    return {
      valid: false,
      error: 'パスワードが一致しません'
    };
  }

  return { valid: true };
}

/**
 * パスワードの完全な検証（強度チェック + 一致チェック）
 * @param password - パスワード
 * @param confirmPassword - パスワード確認
 * @returns 検証結果
 */
export function validatePasswordComplete(
  password: string,
  confirmPassword: string
): PasswordValidationResult {
  // まず一致チェック
  const matchResult = validatePasswordMatch(password, confirmPassword);
  if (!matchResult.valid) {
    return matchResult;
  }

  // 次に強度チェック
  return validatePassword(password);
}

