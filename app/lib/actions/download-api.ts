'use server'

import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import JSZip from 'jszip';
import { debugLog, errorLog, warnLog } from '@/app/lib/utils/logger';

// S3クライアントの設定（環境変数から認証情報を取得）
const s3Client = new S3Client({
  region: process.env.REGION!,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

const S3_BUCKET = process.env.S3_BUCKET_NAME || 'siftbeam';

/**
 * S3から単一ファイルをダウンロードするServer Action
 * 
 * @param s3Key - S3キー
 * @returns ファイルデータ（Base64エンコード）とメタデータ
 */
export async function downloadFile(s3Key: string): Promise<{
  success: boolean;
  data?: {
    content: string;
    fileName: string;
    contentType: string;
  };
  error?: string;
}> {
  try {
    if (!s3Key) {
      return {
        success: false,
        error: 'S3キーが指定されていません'
      };
    }

    return await downloadSingleFile(s3Key);

  } catch (error: any) {
    errorLog('Download error:', error);
    
    if (error.name === 'NoSuchKey') {
      return {
        success: false,
        error: 'ファイルが見つかりません。保存期間（1年）を過ぎた可能性があります。'
      };
    }

    return {
      success: false,
      error: `ダウンロードに失敗しました: ${error.message}`
    };
  }
}

/**
 * S3から複数ファイルをダウンロードするServer Action
 * 
 * @param s3Keys - S3キーの配列
 * @returns ファイルデータ（Base64エンコード）とメタデータ
 */
export async function downloadFiles(s3Keys: string[]): Promise<{
  success: boolean;
  data?: {
    content: string; // Base64エンコードされたファイルデータ
    fileName: string;
    contentType: string;
  };
  error?: string;
}> {
  try {
    if (!s3Keys || s3Keys.length === 0) {
      return {
        success: false,
        error: 'S3キーが指定されていません'
      };
    }

    // 1つのファイルの場合は直接ダウンロード
    if (s3Keys.length === 1) {
      return await downloadSingleFile(s3Keys[0]);
    }

    // 複数ファイルの場合はZIP圧縮してダウンロード
    return await downloadMultipleFilesAsZip(s3Keys);

  } catch (error: any) {
    errorLog('Download error:', error);
    
    if (error.name === 'NoSuchKey') {
      return {
        success: false,
        error: 'ファイルが見つかりません。保存期間（1年）を過ぎた可能性があります。'
      };
    }

    return {
      success: false,
      error: `ダウンロードに失敗しました: ${error.message}`
    };
  }
}

/**
 * 単一ファイルをダウンロード
 */
async function downloadSingleFile(s3Key: string): Promise<{
  success: boolean;
  data?: {
    content: string;
    fileName: string;
    contentType: string;
  };
  error?: string;
}> {
  try {
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET,
      Key: s3Key,
    });

    const response = await s3Client.send(command);

    if (!response.Body) {
      return {
        success: false,
        error: 'ファイルの内容が取得できませんでした'
      };
    }

    // ファイル名を抽出
    const fileName = s3Key.split('/').pop() || 'download';

    // Streamを配列バッファに変換
    const chunks: Uint8Array[] = [];
    for await (const chunk of response.Body as any) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Base64エンコード
    const base64Content = buffer.toString('base64');

    return {
      success: true,
      data: {
        content: base64Content,
        fileName,
        contentType: response.ContentType || 'application/octet-stream'
      }
    };
  } catch (error: any) {
    errorLog('Single file download error:', error);
    throw error;
  }
}

/**
 * 複数ファイルをZIP圧縮してダウンロード
 */
async function downloadMultipleFilesAsZip(s3Keys: string[]): Promise<{
  success: boolean;
  data?: {
    content: string;
    fileName: string;
    contentType: string;
  };
  error?: string;
}> {
  try {
    const zip = new JSZip();

    // 各ファイルをS3から取得してZIPに追加
    for (const s3Key of s3Keys) {
      try {
        const command = new GetObjectCommand({
          Bucket: S3_BUCKET,
          Key: s3Key,
        });

        const response = await s3Client.send(command);

        if (!response.Body) {
          warnLog(`ファイルの内容が取得できませんでした: ${s3Key}`);
          continue;
        }

        // Streamを配列バッファに変換
        const chunks: Uint8Array[] = [];
        for await (const chunk of response.Body as any) {
          chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        // ファイル名を抽出（パスの最後の部分）
        const fileName = s3Key.split('/').pop() || 'file';

        debugLog(`Adding file to ZIP: ${fileName}, size: ${buffer.length} bytes`);

        // ZIPに追加（Uint8Arrayとして渡す）
        zip.file(fileName, new Uint8Array(buffer), { binary: true });

      } catch (error: any) {
        errorLog(`ファイルの取得に失敗しました: ${s3Key}`, error);
        // エラーが発生したファイルはスキップして続行
      }
    }

    // ZIPの内容を確認
    const fileNames = Object.keys(zip.files);
    debugLog(`ZIP contains ${fileNames.length} files:`, fileNames);

    if (fileNames.length === 0) {
      return {
        success: false,
        error: 'ZIPに追加できるファイルがありませんでした'
      };
    }

    // ZIPを生成
    const zipBuffer = await zip.generateAsync({ 
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 6
      }
    });

    debugLog(`Generated ZIP size: ${zipBuffer.length} bytes`);

    // Base64エンコード
    const base64Content = zipBuffer.toString('base64');

    // ZIPファイル名を生成
    const zipFileName = `download_${Date.now()}.zip`;

    return {
      success: true,
      data: {
        content: base64Content,
        fileName: zipFileName,
        contentType: 'application/zip'
      }
    };
  } catch (error: any) {
    errorLog('Multiple files download error:', error);
    throw error;
  }
}

