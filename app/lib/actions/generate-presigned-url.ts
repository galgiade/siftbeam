'use server'

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const REGION = process.env.REGION || 'ap-northeast-1';
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || 'siftbeam';
const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;

// S3クライアントの初期化
const s3Client = new S3Client({
  region: REGION,
  credentials: ACCESS_KEY_ID && SECRET_ACCESS_KEY
    ? {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
      }
    : undefined,
});

export interface GeneratePresignedUrlParams {
  fileName: string;
  fileType: string;
  customerId: string;
  userId: string;
  policyId: string;
  processingHistoryId: string;
  fileType_metadata: 'input' | 'output';
  isLastFile: boolean;
}

export interface GeneratePresignedUrlResult {
  success: boolean;
  data?: {
    presignedUrl: string;
    s3Key: string;
    expiresIn: number;
  };
  message?: string;
  error?: string;
}

/**
 * S3署名付きURLを生成するServer Action
 * 
 * @param params - 署名付きURL生成パラメータ
 * @returns 署名付きURLと関連情報
 */
export async function generatePresignedUrl(
  params: GeneratePresignedUrlParams
): Promise<GeneratePresignedUrlResult> {
  try {
    const {
      fileName,
      fileType,
      customerId,
      userId,
      policyId,
      processingHistoryId,
      fileType_metadata,
      isLastFile,
    } = params;

    // S3キーを生成
    const s3Key = `service/${fileType_metadata}/${customerId}/${processingHistoryId}/${fileName}`;

    console.log('Generating presigned URL:', {
      s3Key,
      fileType,
      isLastFile,
    });

    // 現在時刻（ISO 8601形式）
    const now = new Date().toISOString();

    // PutObjectコマンドを作成
    // 注: Metadataを署名付きURLに含めると、クライアント側でも同じヘッダーを送信する必要がある
    // そのため、Metadataは含めず、S3イベント通知のみに依存する
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: s3Key,
      ContentType: fileType,
    });

    // 署名付きURLを生成（有効期限: 1時間）
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // 1時間
    });

    console.log('Presigned URL generated successfully:', {
      s3Key,
      expiresIn: 3600,
    });

    return {
      success: true,
      data: {
        presignedUrl,
        s3Key,
        expiresIn: 3600,
      },
    };
  } catch (error: any) {
    console.error('Error generating presigned URL:', error);
    return {
      success: false,
      message: '署名付きURLの生成に失敗しました。',
      error: error.message,
    };
  }
}

