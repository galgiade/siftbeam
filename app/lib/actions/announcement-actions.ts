// アナウンスメント関連のサーバーアクション
'use server';

import { QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDocClient } from '@/app/lib/aws-clients';
import { debugLog, errorLog, warnLog } from '@/app/lib/utils/logger';

// テーブル名
const ANNOUNCEMENT_TABLE_NAME = process.env.ANNOUNCEMENT_TABLE_NAME;
debugLog("ANNOUNCEMENT_TABLE_NAME", ANNOUNCEMENT_TABLE_NAME);
// アナウンスメントの型定義（Amplifyスキーマ準拠）
export interface Announcement {
  announcementId: string;        // パーティションキー
  createdAt: string;            // ソートキー（新しい順でソート）
  title: string;                // required
  description: string;          // required
  category: 'price' | 'feature' | 'other';
  content: any;                 // json型
  priority: 'high' | 'medium' | 'low';
  targetValue: string;          // required
  locale: 'ja' | 'en' | 'es' | 'fr' | 'de' | 'ko' | 'pt' | 'id' | 'zh';
  tags: string[];               // required
  updatedAt: string;
  publishedAt?: string;
  isActive: boolean;
}

// アナウンスメント取得（ID指定）
export async function getAnnouncementAction(announcementId: string): Promise<Announcement | null> {
  try {
    const command = new QueryCommand({
      TableName: ANNOUNCEMENT_TABLE_NAME,
      KeyConditionExpression: 'announcementId = :id',
      ExpressionAttributeValues: {
        ':id': announcementId,
      },
      ScanIndexForward: false, // 新しい順（降順）
    });

    const result = await dynamoDocClient.send(command);
    
    if (result.Items && result.Items.length > 0) {
      return result.Items[0] as Announcement;
    }
    
    return null;
  } catch (error: any) {
    errorLog('アナウンスメント取得エラー:', error);
    return null;
  }
}

// アナウンスメント一覧取得（言語別、新しい順）
export async function getAnnouncementsAction(locale: string = 'ja', limit: number = 10): Promise<Announcement[]> {
  try {
    const command = new QueryCommand({
      TableName: ANNOUNCEMENT_TABLE_NAME,
      IndexName: 'locale-createdAt-index',
      KeyConditionExpression: 'locale = :locale',
      FilterExpression: 'isActive = :isActive',
      ExpressionAttributeValues: {
        ':locale': locale,
        ':isActive': true,
      },
      ScanIndexForward: false, // 新しい順（降順）
      Limit: limit,
    });
    const result = await dynamoDocClient.send(command);
    debugLog("result", result);
    if (result.Items) {
      return result.Items as Announcement[];
    }
    
    return [];
  } catch (error: any) {
    errorLog('アナウンスメント一覧取得エラー:', error);
    return [];
  }
}

