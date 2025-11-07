'use server'

import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '@/app/lib/aws-clients';
import { ApiResponse } from '@/app/lib/types/TypeAPIs';
import { sanitizeFileName } from '@/app/lib/utils/s3-utils';

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || 'siftbeam';

/**
 * ファイルアップロード用のインターフェース
 */
export interface UploadFileInput {
  file: File;
  customerId: string;
  userId: string;
  supportRequestId?: string; // サポートリクエスト作成時は未定
  context: 'request' | 'reply'; // リクエストかリプライかを指定
  replyId?: string; // リプライの場合のみ必要
  uploadType: 'support' | 'neworder'; // アップロード先の種類（必須）
}

/**
 * サービス用ファイルアップロード用のインターフェース
 */
export interface ServiceUploadFileInput {
  file: File;
  customerId: string;
  userId: string;
  policyId: string;
  processingHistoryId: string;
  fileType: 'input' | 'output' | 'temp';
  stepName?: string; // tempファイルの場合のみ必要
  isLastFile?: boolean; // 複数ファイルアップロード時、最後のファイルかどうか
}

/**
 * アップロード結果の型定義
 */
export interface UploadFileResult {
  fileKey: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  uploadedAt: string;
}

/**
 * エラーハンドリング用のヘルパー関数
 */
function handleError(error: any, operation: string): ApiResponse<any> {
  console.error(`Error in ${operation}:`, {
    name: error.name,
    message: error.message,
    code: error.code,
    statusCode: error.$metadata?.httpStatusCode,
    requestId: error.$metadata?.requestId,
    timestamp: new Date().toISOString()
  });
  
  // S3関連エラー
  if (error.name === 'NoSuchBucket') {
    return {
      success: false,
      message: 'S3バケットが見つかりません。',
      errors: { 
        s3: ['指定されたバケットが存在しません。'],
        config: [`バケット名: ${S3_BUCKET_NAME}`]
      }
    };
  }
  
  if (error.name === 'AccessDenied' || error.message?.includes('Access Denied')) {
    return {
      success: false,
      message: 'S3アクセス権限エラー',
      errors: { 
        s3: ['S3バケットへのアクセス権限がありません。'],
        permissions: ['s3:PutObject権限が必要です。']
      }
    };
  }
  
  // ファイルサイズエラー
  if (error.message?.includes('file size') || error.message?.includes('too large')) {
    return {
      success: false,
      message: 'ファイルサイズが大きすぎます。',
      errors: { 
        file: ['ファイルサイズは10MB以下にしてください。']
      }
    };
  }
  
  // その他のエラー
  return {
    success: false,
    message: `${operation}に失敗しました: ${error.message || '不明なエラー'}`,
    errors: { 
      general: [error.message || '不明なエラーが発生しました。'],
      debug: [
        `エラー名: ${error.name}`,
        `ステータスコード: ${error.$metadata?.httpStatusCode || 'N/A'}`,
        `リクエストID: ${error.$metadata?.requestId || 'N/A'}`
      ]
    }
  };
}


/**
 * サービス用S3キーを生成する関数
 * 
 * 注: タイムスタンプは不要
 * - processingHistoryIdで一意性が保証される
 * - 同じファイル名でも異なるprocessingHistoryIdなら別ディレクトリ
 * - 元のファイル名がそのまま保持される
 */
function generateServiceS3Key(input: ServiceUploadFileInput, fileName: string): string {
  const sanitizedFileName = sanitizeFileName(fileName);
  
  if (input.fileType === 'temp' && input.stepName) {
    return `service/temp/${input.customerId}/${input.processingHistoryId}/${input.stepName}/${sanitizedFileName}`;
  }
  
  return `service/${input.fileType}/${input.customerId}/${input.processingHistoryId}/${sanitizedFileName}`;
}

/**
 * サービス用S3メタデータを生成する関数
 */
function generateServiceS3Metadata(input: ServiceUploadFileInput): Record<string, string> {
  // triggerStepFunctionは以下の条件で'true'になる:
  // 1. fileType が 'input' である
  // 2. isLastFile が true である（または未指定の場合は単一ファイルとして扱う）
  const shouldTrigger = input.fileType === 'input' && (input.isLastFile ?? true);
  
  return {
    customerId: input.customerId,
    userId: input.userId,
    policyId: input.policyId,
    processingHistoryId: input.processingHistoryId,
    fileType: input.fileType,
    stepName: input.stepName || '',
    uploadedAt: new Date().toISOString(),
    triggerStepFunction: shouldTrigger ? 'true' : 'false'
  };
}

/**
 * ファイルをS3にアップロードする関数
 */
export async function uploadFileToS3(input: UploadFileInput): Promise<ApiResponse<UploadFileResult>> {
  try {
    console.log('uploadFileToS3 called with:', {
      fileName: input.file.name,
      fileSize: input.file.size,
      contentType: input.file.type,
      customerId: input.customerId,
      userId: input.userId,
      supportRequestId: input.supportRequestId,
      context: input.context,
      replyId: input.replyId,
      uploadType: input.uploadType
    });

    // ファイルサイズチェック (10MB制限)
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    if (input.file.size > maxFileSize) {
      return {
        success: false,
        message: 'ファイルサイズが大きすぎます。10MB以下のファイルをアップロードしてください。',
        errors: { 
          file: [`ファイルサイズ: ${Math.round(input.file.size / 1024 / 1024 * 100) / 100}MB (制限: 10MB)`]
        }
      };
    }

    // 安全なファイル名を生成
    const sanitizedFileName = sanitizeFileName(input.file.name);
    
    const supportRequestId = input.supportRequestId || 'unknown';
    const uploadType = input.uploadType; // 必須パラメータ
    
    if (!uploadType) {
      console.error('❌ uploadType is missing!');
      return {
        success: false,
        message: 'アップロード先の種類（uploadType）が指定されていません。',
        errors: { 
          uploadType: ['uploadTypeは必須パラメータです。']
        }
      };
    }
    
    console.log('🔍 Upload path generation:', {
      uploadType,
      inputUploadType: input.uploadType,
      context: input.context,
      replyId: input.replyId
    });
    
    let fileKey: string;
    if (input.context === 'reply' && input.replyId) {
      fileKey = `${uploadType}/${input.customerId}/${supportRequestId}/reply/${input.replyId}/${sanitizedFileName}`;
    } else {
      fileKey = `${uploadType}/${input.customerId}/${supportRequestId}/request/${sanitizedFileName}`;
    }
    
    console.log('📁 Generated fileKey:', fileKey);
    
    // ファイルをArrayBufferに変換
    const arrayBuffer = await input.file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // S3にアップロード
    const putCommand = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: fileKey,
      Body: buffer,
      ContentType: input.file.type,
      ContentLength: input.file.size,
      Metadata: {
        originalFileName: input.file.name,
        uploadedBy: input.userId,
        customerId: input.customerId,
        supportRequestId: supportRequestId,
        uploadedAt: new Date().toISOString()
      }
    });

    await s3Client.send(putCommand);

    const result: UploadFileResult = {
      fileKey,
      fileName: input.file.name,
      fileSize: input.file.size,
      contentType: input.file.type,
      uploadedAt: new Date().toISOString()
    };

    console.log('File uploaded successfully:', {
      fileKey,
      fileName: input.file.name,
      fileSize: input.file.size
    });

    return {
      success: true,
      message: 'ファイルが正常にアップロードされました。',
      data: result
    };

  } catch (error: any) {
    return handleError(error, 'ファイルアップロード');
  }
}

/**
 * サービス用ファイルをS3にアップロードする関数
 */
export async function uploadServiceFileToS3(input: ServiceUploadFileInput): Promise<ApiResponse<UploadFileResult>> {
  try {
    console.log('uploadServiceFileToS3 called with:', {
      fileName: input.file.name,
      fileSize: input.file.size,
      contentType: input.file.type,
      customerId: input.customerId,
      userId: input.userId,
      policyId: input.policyId,
      processingHistoryId: input.processingHistoryId,
      fileType: input.fileType,
      stepName: input.stepName
    });

    // 入力バリデーション
    const errors: Record<string, string[]> = {};
    
    if (!input.customerId?.trim()) {
      errors.customerId = ['カスタマーIDは必須です。'];
    }
    
    if (!input.userId?.trim()) {
      errors.userId = ['ユーザーIDは必須です。'];
    }
    
    if (!input.policyId?.trim()) {
      errors.policyId = ['ポリシーIDは必須です。'];
    }
    
    if (!input.processingHistoryId?.trim()) {
      errors.processingHistoryId = ['処理履歴IDは必須です。'];
    }
    
    if (!['input', 'output', 'temp'].includes(input.fileType)) {
      errors.fileType = ['ファイルタイプは"input"、"output"、または"temp"である必要があります。'];
    }
    
    if (input.fileType === 'temp' && !input.stepName?.trim()) {
      errors.stepName = ['tempファイルの場合、ステップ名は必須です。'];
    }
    
    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: '入力内容に誤りがあります。',
        errors
      };
    }

    // ファイルサイズチェック (100MB制限 - サービス用は大きめ)
    const maxFileSize = 100 * 1024 * 1024; // 100MB
    if (input.file.size > maxFileSize) {
      return {
        success: false,
        message: 'ファイルサイズが大きすぎます。100MB以下のファイルをアップロードしてください。',
        errors: { 
          file: [`ファイルサイズ: ${Math.round(input.file.size / 1024 / 1024 * 100) / 100}MB (制限: 100MB)`]
        }
      };
    }

    // S3キーを生成
    const fileKey = generateServiceS3Key(input, input.file.name);
    
    // ファイルをArrayBufferに変換
    const arrayBuffer = await input.file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // S3にアップロード
    const putCommand = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: fileKey,
      Body: buffer,
      ContentType: input.file.type,
      ContentLength: input.file.size,
      Metadata: generateServiceS3Metadata(input)
    });

    await s3Client.send(putCommand);

    const result: UploadFileResult = {
      fileKey,
      fileName: input.file.name,
      fileSize: input.file.size,
      contentType: input.file.type,
      uploadedAt: new Date().toISOString()
    };

    console.log('Service file uploaded successfully:', {
      fileKey,
      fileName: input.file.name,
      fileSize: input.file.size,
      fileType: input.fileType
    });

    return {
      success: true,
      message: 'サービスファイルが正常にアップロードされました。',
      data: result
    };

  } catch (error: any) {
    return handleError(error, 'サービスファイルアップロード');
  }
}

/**
 * 複数ファイルを一括アップロードする関数
 */
export async function uploadMultipleFiles(
  files: File[],
  customerId: string,
  userId: string,
  uploadType: 'support' | 'neworder', // 必須パラメータ（省略可能なパラメータの前に配置）
  supportRequestId?: string,
  context: 'request' | 'reply' = 'request',
  replyId?: string
): Promise<ApiResponse<UploadFileResult[]>> {
  try {
    console.log('uploadMultipleFiles called with:', {
      fileCount: files.length,
      customerId,
      userId,
      supportRequestId,
      context,
      replyId,
      uploadType
    });

    if (!uploadType) {
      console.error('❌ uploadType is missing in uploadMultipleFiles!');
      return {
        success: false,
        message: 'アップロード先の種類（uploadType）が指定されていません。',
        errors: { 
          uploadType: ['uploadTypeは必須パラメータです。']
        }
      };
    }

    if (files.length === 0) {
      return {
        success: false,
        message: 'アップロードするファイルがありません。',
      };
    }

    if (files.length > 5) {
      return {
        success: false,
        message: '一度にアップロードできるファイルは5個までです。',
        errors: { 
          file: [`選択されたファイル数: ${files.length} (制限: 5個)`]
        }
      };
    }

    const results: UploadFileResult[] = [];
    const errors: string[] = [];

    // 各ファイルを順次アップロード
    for (const file of files) {
      const uploadResult = await uploadFileToS3({
        file,
        customerId,
        userId,
        supportRequestId,
        context,
        replyId,
        uploadType
      });

      if (uploadResult.success && uploadResult.data) {
        results.push(uploadResult.data);
      } else {
        errors.push(`${file.name}: ${uploadResult.message}`);
      }
    }

    if (errors.length > 0) {
      return {
        success: false,
        message: `${errors.length}個のファイルのアップロードに失敗しました。`,
        errors: { 
          files: errors
        },
        data: results // 成功したファイルも返す
      };
    }

    console.log('Multiple files uploaded successfully:', {
      successCount: results.length,
      totalSize: results.reduce((sum, r) => sum + r.fileSize, 0)
    });

    return {
      success: true,
      message: `${results.length}個のファイルが正常にアップロードされました。`,
      data: results
    };

  } catch (error: any) {
    return handleError(error, '複数ファイルアップロード');
  }
}


/**
 * サービス用複数ファイルを一括アップロードする関数
 */
export async function uploadMultipleServiceFiles(
  files: File[],
  customerId: string,
  userId: string,
  policyId: string,
  processingHistoryId: string,
  fileType: 'input' | 'output' | 'temp' = 'input',
  stepName?: string
): Promise<ApiResponse<UploadFileResult[]>> {
  try {
    console.log('uploadMultipleServiceFiles called with:', {
      fileCount: files.length,
      customerId,
      userId,
      policyId,
      processingHistoryId,
      fileType,
      stepName
    });

    if (files.length === 0) {
      return {
        success: false,
        message: 'アップロードするファイルがありません。',
      };
    }

    if (files.length > 10) {
      return {
        success: false,
        message: '一度にアップロードできるファイルは10個までです。',
        errors: { 
          file: [`選択されたファイル数: ${files.length} (制限: 10個)`]
        }
      };
    }

    const results: UploadFileResult[] = [];
    const errors: string[] = [];

    // 各ファイルを順次アップロード
    for (const file of files) {
      const uploadResult = await uploadServiceFileToS3({
        file,
        customerId,
        userId,
        policyId,
        processingHistoryId,
        fileType,
        stepName
      });

      if (uploadResult.success && uploadResult.data) {
        results.push(uploadResult.data);
      } else {
        errors.push(`${file.name}: ${uploadResult.message}`);
      }
    }

    if (errors.length > 0) {
      return {
        success: false,
        message: `${errors.length}個のファイルのアップロードに失敗しました。`,
        errors: { 
          files: errors
        },
        data: results // 成功したファイルも返す
      };
    }

    console.log('Multiple service files uploaded successfully:', {
      successCount: results.length,
      totalSize: results.reduce((sum, r) => sum + r.fileSize, 0)
    });

    return {
      success: true,
      message: `${results.length}個のサービスファイルが正常にアップロードされました。`,
      data: results
    };

  } catch (error: any) {
    return handleError(error, '複数サービスファイルアップロード');
  }
}

