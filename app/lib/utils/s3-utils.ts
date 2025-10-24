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
  uploadedFileKeys: string[];
  downloadS3Keys: string[];
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
  
  // 入力ファイル
  processingHistory.uploadedFileKeys.forEach(s3Key => {
    files.push({
      s3Key,
      fileName: extractFileNameFromS3Key(s3Key),
      fileType: 'input'
    });
  });
  
  // 出力ファイル（処理完了時のみ）
  if (processingHistory.status === 'success') {
    processingHistory.downloadS3Keys.forEach(s3Key => {
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
