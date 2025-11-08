/**
 * ロガーユーティリティ
 * 環境変数 ENABLE_DEBUG_LOGS で制御
 * 本番環境では自動的に無効化
 */

const isProduction = process.env.NODE_ENV === 'production';
const isDebugEnabled = process.env.ENABLE_DEBUG_LOGS === 'true';

/**
 * デバッグログを出力（開発環境のみ、または ENABLE_DEBUG_LOGS=true の場合）
 */
export function debugLog(...args: any[]): void {
  if (!isProduction || isDebugEnabled) {
    console.log('[DEBUG]', ...args);
  }
}

/**
 * 情報ログを出力（常に出力）
 */
export function infoLog(...args: any[]): void {
  console.log('[INFO]', ...args);
}

/**
 * 警告ログを出力（常に出力）
 */
export function warnLog(...args: any[]): void {
  console.warn('[WARN]', ...args);
}

/**
 * エラーログを出力（常に出力）
 * 重要なエラーは監査ログにも記録
 */
export function errorLog(...args: any[]): void {
  console.error('[ERROR]', ...args);
}

/**
 * 監査ログに記録すべき重要なエラーログ
 * 使用例: await auditErrorLog('User creation failed', { userId: 'xxx', error: err })
 */
export async function auditErrorLog(
  message: string,
  metadata?: {
    resource?: string;
    action?: string;
    userId?: string;
    customerId?: string;
    error?: any;
  }
): Promise<void> {
  // コンソールにもエラーを出力
  errorLog(message, metadata);
  
  // 監査ログに記録（非同期、エラーが発生しても処理を継続）
  try {
    const { logFailureAction } = await import('@/app/lib/actions/audit-log-actions');
    
    await logFailureAction(
      (metadata?.action as any) || 'READ',
      metadata?.resource || 'SYSTEM',
      `${message}: ${metadata?.error?.message || JSON.stringify(metadata?.error || {})}`
    );
  } catch (auditError) {
    // 監査ログの記録に失敗してもコンソールには出力
    console.error('[AUDIT_LOG_ERROR]', auditError);
  }
}

/**
 * 機密情報を含まないデバッグログ（開発環境のみ）
 * 使用例: safeDebugLog('User operation', { userId: 'xxx', action: 'update' })
 */
export function safeDebugLog(message: string, metadata?: Record<string, any>): void {
  if (!isProduction || isDebugEnabled) {
    console.log('[DEBUG]', message, metadata ? JSON.stringify(metadata, null, 2) : '');
  }
}

