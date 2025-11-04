/**
 * エラーハンドリングユーティリティ
 * プレゼンテーション層でsuccess分岐により適切なメッセージを表示
 */

/**
 * フィールドエラーを取得（バリデーション用）
 * @param errors エラーオブジェクト
 * @param field フィールド名
 * @returns エラーメッセージ（配列の最初の要素）
 * 
 * @example
 * const emailError = getFieldError(result.errors, 'email');
 * <Input errorMessage={emailError} isInvalid={!!emailError} />
 */
export function getFieldError(
  errors: Record<string, string[]> | undefined,
  field: string
): string {
  if (!errors || !errors[field]) {
    return '';
  }
  
  const fieldErrors = errors[field];
  return Array.isArray(fieldErrors) && fieldErrors.length > 0 ? fieldErrors[0] : '';
}

/**
 * 複数のフィールドエラーを取得
 * @param errors エラーオブジェクト
 * @param field フィールド名
 * @returns エラーメッセージの配列
 * 
 * @example
 * const passwordErrors = getFieldErrors(result.errors, 'password');
 * passwordErrors.forEach(error => console.log(error));
 */
export function getFieldErrors(
  errors: Record<string, string[]> | undefined,
  field: string
): string[] {
  if (!errors || !errors[field]) {
    return [];
  }
  
  return errors[field] || [];
}

/**
 * エラーが存在するかチェック
 * @param errors エラーオブジェクト
 * @param field フィールド名（省略時は全体をチェック）
 * @returns エラーが存在する場合true
 * 
 * @example
 * const hasErrors = hasFieldError(result.errors);
 * const hasEmailError = hasFieldError(result.errors, 'email');
 */
export function hasFieldError(
  errors: Record<string, string[]> | undefined,
  field?: string
): boolean {
  if (!errors) {
    return false;
  }
  
  if (field) {
    return !!errors[field] && errors[field].length > 0;
  }
  
  // 全体チェック
  return Object.keys(errors).some(key => errors[key] && errors[key].length > 0);
}
