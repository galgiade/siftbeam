/**
 * S3関連のユーティリティ関数
 */

// 処理履歴の型定義（必要な部分のみ）
interface ProcessingHistoryStatus {
  status: 'in_progress' | 'success' | 'failed' | 'canceled' | 'deleted' | 'delete_failed';
}

interface ProcessingHistoryForUtils {
  'processing-historyId': string;
  status: 'in_progress' | 'success' | 'failed' | 'canceled' | 'deleted' | 'delete_failed';
  uploadedFileKeys: string[] | Array<{ S: string }>;
  downloadS3Keys: string[] | Array<{ S: string }>;
}

/**
 * サービス用S3キーから情報を抽出する関数
 */
export function parseServiceS3Key(s3Key: string): {
  fileType: 'input' | 'output' | 'temp';
  customerId: string;
  processingHistoryId: string;
  stepName?: string;
  fileName: string;
  timestamp: string;
} | null {
  // service/input/customer123/proc-456/20241009_143022_data.csv
  // service/temp/customer123/proc-456/step1/20241009_143022_data.csv
  
  if (s3Key.startsWith('service/temp/')) {
    const regex = /^service\/temp\/([^\/]+)\/([^\/]+)\/([^\/]+)\/(\d{8}_\d{6})_(.+)$/;
    const match = s3Key.match(regex);
    
    if (!match) return null;
    
    return {
      fileType: 'temp',
      customerId: match[1],
      processingHistoryId: match[2],
      stepName: match[3],
      timestamp: match[4],
      fileName: match[5]
    };
  } else {
    const regex = /^service\/(input|output)\/([^\/]+)\/([^\/]+)\/(\d{8}_\d{6})_(.+)$/;
    const match = s3Key.match(regex);
    
    if (!match) return null;
    
    return {
      fileType: match[1] as 'input' | 'output',
      customerId: match[2],
      processingHistoryId: match[3],
      timestamp: match[4],
      fileName: match[5]
    };
  }
}

/**
 * S3キーから元のファイル名を抽出する関数
 */
export function extractFileNameFromS3Key(s3Key: string): string {
  // service/input/customer123/proc-456/20241009_143022_data.csv
  // → data.csv
  const parts = s3Key.split('/');
  const fileNameWithTimestamp = parts[parts.length - 1];
  
  // タイムスタンプ部分を除去 (YYYYMMDD_HHMMSS_)
  const match = fileNameWithTimestamp.match(/^\d{8}_\d{6}_(.+)$/);
  return match ? match[1] : fileNameWithTimestamp;
}

/**
 * ファイルサイズをフォーマットする関数
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * ファイル拡張子を取得する関数
 */
export function getFileExtension(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf('.');
  return lastDotIndex !== -1 ? fileName.substring(lastDotIndex) : '';
}

/**
 * 安全なファイル名を生成する関数
 */
export function sanitizeFileName(fileName: string): string {
  // 危険な文字を除去し、安全な文字のみ残す
  return fileName
    .replace(/[^a-zA-Z0-9.\-_]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 100); // 最大100文字
}

/**
 * タイムスタンプを生成する関数
 */
export function generateTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}_${hours}${minutes}${seconds}`;
}

/**
 * DynamoDB形式の配列を通常の文字列配列に変換するヘルパー関数
 */
function normalizeDynamoDBArray(arr: string[] | Array<{ S: string }>): string[] {
  if (!arr || arr.length === 0) return [];
  
  // 最初の要素をチェックして形式を判定
  if (typeof arr[0] === 'object' && arr[0] !== null && 'S' in arr[0]) {
    // DynamoDB形式 [{ S: "value" }] の場合
    return (arr as Array<{ S: string }>).map(item => item.S);
  }
  
  // 通常の文字列配列の場合
  return arr as string[];
}

/**
 * 処理履歴からダウンロード可能なファイル情報を取得する関数
 */
export function getDownloadableFiles(processingHistory: ProcessingHistoryForUtils): Array<{
  s3Key: string;
  fileName: string;
  fileType: 'input' | 'output';
}> {
  const files: Array<{
    s3Key: string;
    fileName: string;
    fileType: 'input' | 'output';
  }> = [];
  
  // DynamoDB形式を通常の配列に変換
  const uploadedFileKeys = normalizeDynamoDBArray(processingHistory.uploadedFileKeys);
  const downloadS3Keys = normalizeDynamoDBArray(processingHistory.downloadS3Keys);
  
  // 入力ファイル
  uploadedFileKeys.forEach(s3Key => {
    files.push({
      s3Key,
      fileName: extractFileNameFromS3Key(s3Key),
      fileType: 'input'
    });
  });
  
  // 出力ファイル（処理完了時のみ）
  if (processingHistory.status === 'success') {
    downloadS3Keys.forEach(s3Key => {
      files.push({
        s3Key,
        fileName: extractFileNameFromS3Key(s3Key),
        fileType: 'output'
      });
    });
  }
  
  return files;
}

/**
 * 処理履歴のステータスに基づいて表示用メッセージを取得する関数
 */
export function getProcessingStatusMessage(status: ProcessingHistoryForUtils['status']): {
  message: string;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'default';
  canDownload: boolean;
} {
  switch (status) {
    case 'in_progress':
      return {
        message: '処理中...',
        color: 'primary',
        canDownload: false
      };
    case 'success':
      return {
        message: '処理完了',
        color: 'success',
        canDownload: true
      };
    case 'failed':
      return {
        message: '処理失敗',
        color: 'danger',
        canDownload: false
      };
    case 'canceled':
      return {
        message: 'キャンセル済み',
        color: 'warning',
        canDownload: false
      };
    case 'deleted':
      return {
        message: '削除済み',
        color: 'default',
        canDownload: false
      };
    case 'delete_failed':
      return {
        message: '削除失敗',
        color: 'danger',
        canDownload: false
      };
    default:
      return {
        message: '不明',
        color: 'default',
        canDownload: false
      };
  }
}

/**
 * 処理時間を計算する関数（秒単位）
 * @deprecated Use calculateProcessingDurationByStatus instead
 */
export function calculateProcessingDuration(createdAt: string, completedAt?: string): number | null {
  if (!completedAt) return null;
  
  const startTime = new Date(createdAt).getTime();
  const endTime = new Date(completedAt).getTime();
  
  return Math.round((endTime - startTime) / 1000); // 秒単位
}

/**
 * 処理時間を計算する関数（ミリ秒単位）
 * ProcessingHistoryオブジェクトから処理時間を計算
 */
export function calculateProcessingTime(createdAt: string, completedAt?: string): number | null {
  if (!completedAt) return null;
  
  const startTime = new Date(createdAt).getTime();
  const endTime = new Date(completedAt).getTime();
  
  return endTime - startTime; // ミリ秒単位
}

/**
 * ステータスに応じた処理時間を計算する関数
 * 
 * @param status - 処理履歴のステータス
 * @param createdAt - 処理開始時刻
 * @param updatedAt - 処理更新時刻（オプション）
 * @param completedAt - 処理完了時刻（オプション）
 * @returns 処理時間（秒）またはnull
 * 
 * 仕様:
 * - success, failed: (completedAt || updatedAt) - createdAt
 * - in_progress: 現在時刻 - createdAt
 * - canceled, deleted, delete_failed: null（updatedAtの時刻を表示）
 */
export function calculateProcessingDurationByStatus(
  status: 'in_progress' | 'success' | 'failed' | 'canceled' | 'deleted' | 'delete_failed',
  createdAt: string,
  updatedAt?: string,
  completedAt?: string
): number | null {
  switch (status) {
    case 'success':
    case 'failed':
      // (completedAt || updatedAt) - createdAt
      const endTime = completedAt || updatedAt;
      if (!endTime) return null;
      return Math.round((new Date(endTime).getTime() - new Date(createdAt).getTime()) / 1000);
    
    case 'in_progress':
      // 現在時刻 - createdAt
      return Math.round((Date.now() - new Date(createdAt).getTime()) / 1000);
    
    case 'canceled':
    case 'deleted':
    case 'delete_failed':
      // 処理時間は表示せず、updatedAtの時刻を表示
      return null;
    
    default:
      return null;
  }
}

/**
 * 処理時間を人間が読みやすい形式にフォーマットする関数
 * 
 * @param seconds - 処理時間（秒）
 * @returns フォーマットされた文字列（例: "1時間23分45秒", "45秒", "2分30秒"）
 */
export function formatProcessingDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}秒`;
  }
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}時間${minutes}分${secs}秒`;
  }
  
  return `${minutes}分${secs}秒`;
}
