/**
 * user-verification-actionsのテスト
 * 
 * 注意: このテストはDynamoDBとSESのモックを使用します。
 * 実際のAWSサービスは使用しません。
 */

import { sendVerificationEmailAction, verifyEmailCodeAction } from '../user-verification-actions';
import { DynamoDBClient, QueryCommand, PutItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { SESClient, SendTemplatedEmailCommand } from '@aws-sdk/client-ses';

// AWS SDKクライアントをモック
jest.mock('@aws-sdk/client-dynamodb');
jest.mock('@aws-sdk/client-ses');

const mockDynamoSend = jest.fn();
const mockSesSend = jest.fn();
const mockDynamoDBClient = DynamoDBClient as jest.MockedClass<typeof DynamoDBClient>;
const mockSESClient = SESClient as jest.MockedClass<typeof SESClient>;

describe('user-verification-actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDynamoDBClient.prototype.send = mockDynamoSend;
    mockSESClient.prototype.send = mockSesSend;
    
    // 環境変数を設定
    process.env.VERIFICATION_CODES_TABLE_NAME = 'test-verification-codes';
    process.env.SES_FROM_EMAIL = 'noreply@example.com';
    process.env.REGION = 'us-east-1';
    process.env.ACCESS_KEY_ID = 'test-key';
    process.env.SECRET_ACCESS_KEY = 'test-secret';
  });

  describe('sendVerificationEmailAction', () => {
    it('初回送信時は成功する', async () => {
      // DynamoDBから何も返さない（初回送信）
      mockDynamoSend.mockResolvedValueOnce({ Items: [] });
      
      // PutItemCommandの実行（認証コード保存）
      mockDynamoSend.mockResolvedValueOnce({});
      
      // SESメール送信
      mockSesSend.mockResolvedValueOnce({});

      const result = await sendVerificationEmailAction(
        'user@example.com',
        'user-id-123',
        'en'
      );

      expect(result.success).toBe(true);
      expect(result.remainingAttempts).toBe(2); // 3 - 1
      expect(mockDynamoSend).toHaveBeenCalledTimes(2); // Query + Put
      expect(mockSesSend).toHaveBeenCalledTimes(1);
    });

    it('時間枠内で2回目の送信は成功する', async () => {
      const now = Math.floor(Date.now() / 1000);
      
      // 既存の認証コードレコード（sendCount: 1）
      mockDynamoSend.mockResolvedValueOnce({
        Items: [{
          verificationId: { S: 'verification-id-1' },
          userId: { S: 'user-id-123' },
          email: { S: 'user@example.com' },
          code: { S: '123456' },
          failedVerifyCount: { N: '0' },
          sendCount: { N: '1' },
          windowStart: { N: now.toString() },
          TTL: { N: (now + 300).toString() },
          locale: { S: 'en' },
          createdAt: { S: new Date().toISOString() }
        }]
      });
      
      // PutItemCommandの実行
      mockDynamoSend.mockResolvedValueOnce({});
      
      // SESメール送信
      mockSesSend.mockResolvedValueOnce({});

      const result = await sendVerificationEmailAction(
        'user@example.com',
        'user-id-123',
        'en'
      );

      expect(result.success).toBe(true);
      expect(result.remainingAttempts).toBe(1); // 3 - 2
    });

    it('時間枠内で3回目の送信は成功する', async () => {
      const now = Math.floor(Date.now() / 1000);
      
      // 既存の認証コードレコード（sendCount: 2）
      mockDynamoSend.mockResolvedValueOnce({
        Items: [{
          verificationId: { S: 'verification-id-1' },
          userId: { S: 'user-id-123' },
          email: { S: 'user@example.com' },
          code: { S: '123456' },
          failedVerifyCount: { N: '0' },
          sendCount: { N: '2' },
          windowStart: { N: now.toString() },
          TTL: { N: (now + 300).toString() },
          locale: { S: 'en' },
          createdAt: { S: new Date().toISOString() }
        }]
      });
      
      // PutItemCommandの実行
      mockDynamoSend.mockResolvedValueOnce({});
      
      // SESメール送信
      mockSesSend.mockResolvedValueOnce({});

      const result = await sendVerificationEmailAction(
        'user@example.com',
        'user-id-123',
        'en'
      );

      expect(result.success).toBe(true);
      expect(result.remainingAttempts).toBe(0); // 3 - 3
    });

    it('時間枠内で4回目の送信はレート制限エラーになる', async () => {
      const now = Math.floor(Date.now() / 1000);
      
      // 既存の認証コードレコード（sendCount: 3、上限に達している）
      mockDynamoSend.mockResolvedValueOnce({
        Items: [{
          verificationId: { S: 'verification-id-1' },
          userId: { S: 'user-id-123' },
          email: { S: 'user@example.com' },
          code: { S: '123456' },
          failedVerifyCount: { N: '0' },
          sendCount: { N: '3' },
          windowStart: { N: now.toString() },
          TTL: { N: (now + 300).toString() },
          locale: { S: 'en' },
          createdAt: { S: new Date().toISOString() }
        }]
      });

      const result = await sendVerificationEmailAction(
        'user@example.com',
        'user-id-123',
        'en'
      );

      expect(result.success).toBe(false);
      expect(result.remainingAttempts).toBe(0);
      expect(result.messageKey).toBe('rateLimitSendExceeded');
      expect(result.resetAt).toBeDefined();
      expect(mockDynamoSend).toHaveBeenCalledTimes(1); // Queryのみ
      expect(mockSesSend).not.toHaveBeenCalled(); // メール送信されない
    });

    it('時間枠が経過した場合は新しい時間枠でカウントリセット', async () => {
      const now = Math.floor(Date.now() / 1000);
      const oldWindowStart = now - 120; // 2分前（時間枠: 60秒）
      
      // 既存の認証コードレコード（sendCount: 3だが時間枠外）
      mockDynamoSend.mockResolvedValueOnce({
        Items: [{
          verificationId: { S: 'verification-id-1' },
          userId: { S: 'user-id-123' },
          email: { S: 'user@example.com' },
          code: { S: '123456' },
          failedVerifyCount: { N: '0' },
          sendCount: { N: '3' },
          windowStart: { N: oldWindowStart.toString() },
          TTL: { N: (now + 300).toString() },
          locale: { S: 'en' },
          createdAt: { S: new Date().toISOString() }
        }]
      });
      
      // PutItemCommandの実行
      mockDynamoSend.mockResolvedValueOnce({});
      
      // SESメール送信
      mockSesSend.mockResolvedValueOnce({});

      const result = await sendVerificationEmailAction(
        'user@example.com',
        'user-id-123',
        'en'
      );

      expect(result.success).toBe(true);
      expect(result.remainingAttempts).toBe(2); // 新しい時間枠: 3 - 1
    });

    it('RATE_LIMITレコードは無視される', async () => {
      const now = Math.floor(Date.now() / 1000);
      
      // RATE_LIMITレコードと通常のレコードが混在
      mockDynamoSend.mockResolvedValueOnce({
        Items: [
          {
            verificationId: { S: 'ratelimit_verification_code_send_user@example.com' },
            email: { S: 'user@example.com' },
            code: { S: 'RATE_LIMIT' },
            sendCount: { N: '2' },
            windowStart: { N: now.toString() }
          },
          {
            verificationId: { S: 'verification-id-1' },
            userId: { S: 'user-id-123' },
            email: { S: 'user@example.com' },
            code: { S: '123456' },
            failedVerifyCount: { N: '0' },
            sendCount: { N: '1' },
            windowStart: { N: now.toString() },
            TTL: { N: (now + 300).toString() },
            locale: { S: 'en' },
            createdAt: { S: new Date().toISOString() }
          }
        ]
      });
      
      // PutItemCommandの実行
      mockDynamoSend.mockResolvedValueOnce({});
      
      // SESメール送信
      mockSesSend.mockResolvedValueOnce({});

      const result = await sendVerificationEmailAction(
        'user@example.com',
        'user-id-123',
        'en'
      );

      expect(result.success).toBe(true);
      expect(result.remainingAttempts).toBe(1); // RATE_LIMITは無視され、sendCount: 1のレコードを使用
    });
  });

  describe('verifyEmailCodeAction', () => {
    it('正しいコードで検証成功', async () => {
      const now = Math.floor(Date.now() / 1000);
      
      // 既存の認証コードレコード
      mockDynamoSend.mockResolvedValueOnce({
        Items: [{
          verificationId: { S: 'verification-id-1' },
          userId: { S: 'user-id-123' },
          email: { S: 'user@example.com' },
          code: { S: '123456' },
          failedVerifyCount: { N: '0' },
          sendCount: { N: '1' },
          windowStart: { N: now.toString() },
          TTL: { N: (now + 300).toString() },
          locale: { S: 'en' },
          createdAt: { S: new Date().toISOString() }
        }]
      });
      
      // 削除コマンド（BatchWriteItemCommand）
      mockDynamoSend.mockResolvedValueOnce({});

      const result = await verifyEmailCodeAction(
        'user@example.com',
        '123456'
      );

      expect(result.success).toBe(true);
    });

    it('間違ったコードで検証失敗（failedVerifyCountがインクリメント）', async () => {
      const now = Math.floor(Date.now() / 1000);
      
      // 既存の認証コードレコード
      mockDynamoSend.mockResolvedValueOnce({
        Items: [{
          verificationId: { S: 'verification-id-1' },
          userId: { S: 'user-id-123' },
          email: { S: 'user@example.com' },
          code: { S: '123456' },
          failedVerifyCount: { N: '0' },
          sendCount: { N: '1' },
          windowStart: { N: now.toString() },
          TTL: { N: (now + 300).toString() },
          locale: { S: 'en' },
          createdAt: { S: new Date().toISOString() }
        }]
      });
      
      // UpdateItemCommand（failedVerifyCountをインクリメント）
      mockDynamoSend.mockResolvedValueOnce({});

      const result = await verifyEmailCodeAction(
        'user@example.com',
        '999999' // 間違ったコード
      );

      expect(result.success).toBe(false);
      expect(result.remainingAttempts).toBe(4); // 5 - 1
      expect(mockDynamoSend).toHaveBeenCalledWith(expect.any(UpdateItemCommand));
    });

    it('5回失敗すると全レコードが削除される', async () => {
      const now = Math.floor(Date.now() / 1000);
      
      // 既存の認証コードレコード（failedVerifyCount: 4）
      mockDynamoSend.mockResolvedValueOnce({
        Items: [{
          verificationId: { S: 'verification-id-1' },
          userId: { S: 'user-id-123' },
          email: { S: 'user@example.com' },
          code: { S: '123456' },
          failedVerifyCount: { N: '4' },
          sendCount: { N: '1' },
          windowStart: { N: now.toString() },
          TTL: { N: (now + 300).toString() },
          locale: { S: 'en' },
          createdAt: { S: new Date().toISOString() }
        }]
      });
      
      // 削除コマンド（BatchWriteItemCommand）
      mockDynamoSend.mockResolvedValueOnce({});

      const result = await verifyEmailCodeAction(
        'user@example.com',
        '999999' // 間違ったコード
      );

      expect(result.success).toBe(false);
      expect(result.remainingAttempts).toBe(0);
      expect(result.error).toContain('Too many failed attempts');
    });

    it('RATE_LIMITレコードは無視される', async () => {
      const now = Math.floor(Date.now() / 1000);
      
      // RATE_LIMITレコードと通常のレコードが混在
      mockDynamoSend.mockResolvedValueOnce({
        Items: [
          {
            verificationId: { S: 'ratelimit_verification_code_check_user@example.com' },
            email: { S: 'user@example.com' },
            code: { S: 'RATE_LIMIT' },
            failedVerifyCount: { N: '3' }
          },
          {
            verificationId: { S: 'verification-id-1' },
            userId: { S: 'user-id-123' },
            email: { S: 'user@example.com' },
            code: { S: '123456' },
            failedVerifyCount: { N: '0' },
            sendCount: { N: '1' },
            windowStart: { N: now.toString() },
            TTL: { N: (now + 300).toString() },
            locale: { S: 'en' },
            createdAt: { S: new Date().toISOString() }
          }
        ]
      });
      
      // 削除コマンド
      mockDynamoSend.mockResolvedValueOnce({});

      const result = await verifyEmailCodeAction(
        'user@example.com',
        '123456'
      );

      expect(result.success).toBe(true); // RATE_LIMITは無視され、正しいコードで検証成功
    });
  });
});

