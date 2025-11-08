'use server'

import { DynamoDBClient, PutItemCommand, GetItemCommand, DeleteItemCommand, QueryCommand, BatchWriteItemCommand } from '@aws-sdk/client-dynamodb';
import { SESClient, SendTemplatedEmailCommand } from '@aws-sdk/client-ses';
import { CognitoIdentityProviderClient, AdminUpdateUserAttributesCommand, AdminConfirmSignUpCommand, InitiateAuthCommand, RespondToAuthChallengeCommand, AdminInitiateAuthCommand, AdminRespondToAuthChallengeCommand } from '@aws-sdk/client-cognito-identity-provider';
import { v4 as uuidv4 } from 'uuid';
import { debugLog, errorLog, warnLog } from '@/app/lib/utils/logger';

const dynamoClient = new DynamoDBClient({ 
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  }
});
const sesClient = new SESClient({ 
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  }
});
const cognitoClient = new CognitoIdentityProviderClient({ 
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  }
});

const VERIFICATION_TABLE = process.env.VERIFICATION_CODES_TABLE_NAME;

// 環境変数の確認
debugLog('Environment variables check:', {
  VERIFICATION_CODES_TABLE_NAME: process.env.VERIFICATION_CODES_TABLE_NAME,
  VERIFICATION_TABLE,
  REGION: process.env.REGION,
  ACCESS_KEY_ID: process.env.ACCESS_KEY_ID ? '***設定済み***' : '未設定',
  SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY ? '***設定済み***' : '未設定'
});

// 環境変数が未設定の場合の警告
if (!VERIFICATION_TABLE) {
  errorLog('🚨 VERIFICATION_CODES_TABLE_NAME環境変数が設定されていません！');
  errorLog('📋 .env.localファイルに以下を追加してください:');
  errorLog('VERIFICATION_CODES_TABLE_NAME=siftbeam-verification-codes');
}

// URLのlocaleとCognitoのlocaleを同期する関数
async function syncUserLocaleWithUrl(
  email: string,
  urlLocale: string,
  userPoolId: string
): Promise<void> {
  try {
    // サポートされている言語のリスト
    const SUPPORTED_LOCALES = ['ja', 'en', 'ko', 'zh', 'es', 'fr', 'de', 'pt', 'id'];
    
    // URLのlocaleが有効な言語でない場合はスキップ
    if (!SUPPORTED_LOCALES.includes(urlLocale)) {
      return;
    }
    
    // 1. Cognitoのlocale属性を更新
    const updateCommand = new AdminUpdateUserAttributesCommand({
      UserPoolId: userPoolId,
      Username: email,
      UserAttributes: [
        {
          Name: 'locale',
          Value: urlLocale
        }
      ]
    });
    
    await cognitoClient.send(updateCommand);
    
    // 2. DynamoDBのユーザーテーブルのlocaleも更新
    try {
      const usersTableName = process.env.USERS_TABLE_NAME;
      if (!usersTableName) {
        warnLog('⚠️ USERS_TABLE_NAME環境変数が未設定のため、DynamoDBの更新をスキップ');
        return;
      }
      
      // emailでユーザーを検索（GSI使用）
      const queryCommand = new QueryCommand({
        TableName: usersTableName,
        IndexName: 'email-index',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': { S: email }
        }
      });
      
      const queryResult = await dynamoClient.send(queryCommand);
      
      if (queryResult.Items && queryResult.Items.length > 0) {
        const user = queryResult.Items[0];
        const userId = user.userId?.S;
        
        if (userId) {
          // DynamoDBのユーザーレコードを更新
          const updateUserCommand = new PutItemCommand({
            TableName: usersTableName,
            Item: {
              ...user,
              locale: { S: urlLocale },
              updatedAt: { S: new Date().toISOString() }
            }
          });
          
          await dynamoClient.send(updateUserCommand);
        }
      }
    } catch (dbError: any) {
      errorLog('❌ DynamoDB locale同期エラー:', dbError);
      // DynamoDBの更新に失敗してもCognitoは更新済みなので継続
    }
  } catch (error: any) {
    errorLog('❌ Locale同期エラー:', error);
    // エラーが発生してもサインインは継続
  }
}

// emailに基づいて全ての認証コードアイテムを削除
async function deleteAllVerificationCodesByEmail(email: string): Promise<void> {
  try {
    // GSI email-createdAt-indexを使用してemailで検索
    const queryCommand = new QueryCommand({
      TableName: VERIFICATION_TABLE,
      IndexName: 'email-createdAt-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': { S: email }
      }
    });

    const result = await dynamoClient.send(queryCommand);
    
    if (!result.Items || result.Items.length === 0) {
      return;
    }

    // BatchWriteItemの代わりに個別削除を実行（権限問題回避）
    let deletedCount = 0;
    for (const item of result.Items) {
      try {
        const deleteCommand = new DeleteItemCommand({
          TableName: VERIFICATION_TABLE,
          Key: {
            verificationId: { S: item.verificationId?.S! }
          }
        });

        await dynamoClient.send(deleteCommand);
        deletedCount++;
        debugLog(`個別削除完了: ${item.verificationId?.S}`);
      } catch (deleteError) {
        errorLog(`個別削除エラー (${item.verificationId?.S}):`, deleteError);
        // 個別削除エラーは継続（他のアイテムの削除を試行）
      }
    }

    debugLog(`全認証コードアイテム削除完了: ${deletedCount}/${result.Items.length}件`);
  } catch (error) {
    errorLog('全認証コードアイテム削除エラー:', error);
    // エラーが発生してもthrowしない（認証処理を継続）
    debugLog('認証コード削除に失敗しましたが、処理を継続します');
  }
}

export interface VerificationResponse {
  success: boolean;
  message?: string;
  error?: string;
  remainingAttempts?: number;
  redirectUrl?: string;
  autoSignIn?: boolean;
  messageKey?: 'rateLimitExceeded' | 'rateLimitBlocked' | 'rateLimitSendExceeded' | 'rateLimitCheckExceeded';
  resetAt?: Date;
}

export interface AutoSignInResponse {
  success: boolean;
  accessToken?: string;
  idToken?: string;
  refreshToken?: string;
  error?: string;
}

// 自動サインイン機能（locale同期機能付き）
export async function performAutoSignInAction(
  email: string,
  password: string,
  userPoolId: string,
  clientId: string,
  urlLocale?: string  // URLから取得したlocaleを渡す
): Promise<AutoSignInResponse> {
  try {

    // 1. 管理者フローを優先（より安定）
    try {
      const adminInit = new AdminInitiateAuthCommand({
        UserPoolId: userPoolId,
        ClientId: clientId,
        AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password
        }
      });
      const adminResult = await cognitoClient.send(adminInit);

      if (adminResult.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
        const adminRespond = new AdminRespondToAuthChallengeCommand({
          UserPoolId: userPoolId,
          ClientId: clientId,
          ChallengeName: 'NEW_PASSWORD_REQUIRED',
          Session: adminResult.Session,
          ChallengeResponses: {
            USERNAME: email,
            NEW_PASSWORD: password
          }
        });
        const adminRespondResult = await cognitoClient.send(adminRespond);
        if (adminRespondResult.AuthenticationResult) {
          // URLのlocaleとCognitoのlocaleを同期
          if (urlLocale) {
            await syncUserLocaleWithUrl(email, urlLocale, userPoolId);
          }
          
          return {
            success: true,
            accessToken: adminRespondResult.AuthenticationResult.AccessToken,
            idToken: adminRespondResult.AuthenticationResult.IdToken,
            refreshToken: adminRespondResult.AuthenticationResult.RefreshToken
          };
        }
      }

      if (adminResult.AuthenticationResult) {
        // URLのlocaleとCognitoのlocaleを同期
        if (urlLocale) {
          await syncUserLocaleWithUrl(email, urlLocale, userPoolId);
        }
        
        return {
          success: true,
          accessToken: adminResult.AuthenticationResult.AccessToken,
          idToken: adminResult.AuthenticationResult.IdToken,
          refreshToken: adminResult.AuthenticationResult.RefreshToken
        };
      }
    } catch (adminError) {
      debugLog('Admin認証失敗のためユーザーフローにフォールバック');
    }

    // 2. 一般フロー（フォールバック）
    const initiateAuthCommand = new InitiateAuthCommand({
      ClientId: clientId,
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password
      }
    });
    const authResult = await cognitoClient.send(initiateAuthCommand);

    if (authResult.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
      const respondCommand = new RespondToAuthChallengeCommand({
        ClientId: clientId,
        ChallengeName: 'NEW_PASSWORD_REQUIRED',
        Session: authResult.Session,
        ChallengeResponses: {
          USERNAME: email,
          NEW_PASSWORD: password
        }
      });
      const respondResult = await cognitoClient.send(respondCommand);
      if (respondResult.AuthenticationResult) {
        // URLのlocaleとCognitoのlocaleを同期
        if (urlLocale) {
          await syncUserLocaleWithUrl(email, urlLocale, userPoolId);
        }
        
        return {
          success: true,
          accessToken: respondResult.AuthenticationResult.AccessToken,
          idToken: respondResult.AuthenticationResult.IdToken,
          refreshToken: respondResult.AuthenticationResult.RefreshToken
        };
      }
    }

    if (authResult.AuthenticationResult) {
      // URLのlocaleとCognitoのlocaleを同期
      if (urlLocale) {
        await syncUserLocaleWithUrl(email, urlLocale, userPoolId);
      }
      
      return {
        success: true,
        accessToken: authResult.AuthenticationResult.AccessToken,
        idToken: authResult.AuthenticationResult.IdToken,
        refreshToken: authResult.AuthenticationResult.RefreshToken
      };
    }

    return { success: false, error: 'Authentication failed' };

  } catch (error: any) {
    errorLog('自動サインインエラー:', error);
    return { success: false, error: `Auto sign-in failed: ${error.message}` };
  }
}

// 認証コードを送信
export async function sendVerificationEmailAction(
  email: string,
  userId: string,
  locale: string
): Promise<VerificationResponse> {
  try {
    // 認証コードを生成
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationId = uuidv4();
    const ttl = Math.floor(Date.now() / 1000) + 300; // 5分後
    const createdAt = new Date().toISOString();
    const now = Math.floor(Date.now() / 1000);

    // 既存の認証コードレコードを取得してレート制限をチェック
    const queryCommand = new QueryCommand({
      TableName: VERIFICATION_TABLE,
      IndexName: 'email-createdAt-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': { S: email }
      },
      ScanIndexForward: false // 最新を先頭に
    });

    const result = await dynamoClient.send(queryCommand);
    const verificationItems = result.Items?.filter(item => item.code?.S !== 'RATE_LIMIT') || [];
    
    let newSendCount = 1;
    let newWindowStart = now;
    
    // レート制限チェック（1分間に3回まで）
    if (verificationItems.length > 0) {
      const latestItem = verificationItems[0];
      const sendCount = parseInt(latestItem.sendCount?.N || '0');
      const windowStart = parseInt(latestItem.windowStart?.N || '0');
      
      // 時間枠内かチェック（60秒）
      if (now - windowStart < 60) {
        if (sendCount >= 3) {
          const resetAt = new Date((windowStart + 60) * 1000);
          return {
            success: false,
            error: `認証コードの送信回数が上限に達しました。${resetAt.toLocaleString('ja-JP')}以降に再試行してください。`,
            remainingAttempts: 0,
            messageKey: 'rateLimitSendExceeded',
            resetAt
          };
        }
        // 時間枠内なのでカウントをインクリメント
        newSendCount = sendCount + 1;
        newWindowStart = windowStart;
      }
      // 時間枠外の場合は新しい時間枠でカウントリセット（newSendCount = 1, newWindowStart = now）
    }

    // DynamoDBに認証コードを保存
    const putCommand = new PutItemCommand({
      TableName: VERIFICATION_TABLE,
      Item: {
        verificationId: { S: verificationId },
        userId: { S: userId },
        email: { S: email },
        code: { S: code },
        failedVerifyCount: { N: '0' },
        TTL: { N: ttl.toString() },
        locale: { S: locale },
        createdAt: { S: createdAt },
        sendCount: { N: newSendCount.toString() },
        windowStart: { N: newWindowStart.toString() }
      }
    });

    await dynamoClient.send(putCommand);

    // メール送信
    const templateName = `SiftbeamVerificationCode_${locale}`;

    const command = new SendTemplatedEmailCommand({
      Source: process.env.SES_FROM_EMAIL || 'noreply@siftbeam.com',
      Destination: {
        ToAddresses: [email]
      },
      Template: templateName,
      TemplateData: JSON.stringify({
        verificationCode: code,
        code: code
      })
    });

    await sesClient.send(command);
    
    return {
      success: true,
      message: 'Verification email sent successfully',
      remainingAttempts: Math.max(0, 3 - newSendCount)
    };
  } catch (error: any) {
    errorLog('SESメール送信エラー詳細:', {
      error: error.message,
      name: error.name,
      code: error.$metadata?.httpStatusCode,
      email,
      templateName: `SiftbeamVerificationCode_${locale}`
    });
    return {
      success: false,
      error: `Failed to send verification email: ${error.message}`
    };
  }
}

// 認証コードを保存
export async function storeVerificationCodeAction(
  userId: string,
  email: string,
  code: string,
  locale: string
): Promise<VerificationResponse> {
  try {
    const verificationId = uuidv4();
    const ttl = Math.floor(Date.now() / 1000) + 300; // 5分後
    const createdAt = new Date().toISOString();
    const now = Math.floor(Date.now() / 1000);

    // 既存の認証コードレコードを取得
    const queryCommand = new QueryCommand({
      TableName: VERIFICATION_TABLE,
      IndexName: 'email-createdAt-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': { S: email }
      },
      ScanIndexForward: false
    });

    const result = await dynamoClient.send(queryCommand);
    const verificationItems = result.Items?.filter(item => item.code?.S !== 'RATE_LIMIT') || [];
    
    // sendCountとwindowStartを計算
    let sendCount = 1;
    let windowStart = now;
    
    if (verificationItems.length > 0) {
      const latestItem = verificationItems[0];
      const existingSendCount = parseInt(latestItem.sendCount?.N || '0');
      const existingWindowStart = parseInt(latestItem.windowStart?.N || '0');
      
      // 時間枠内（60秒以内）なら送信回数を増やす
      if (now - existingWindowStart < 60) {
        sendCount = existingSendCount + 1;
        windowStart = existingWindowStart;
      }
      // 時間枠外ならリセット
    }

    debugLog('DynamoDB保存試行:', {
      tableName: VERIFICATION_TABLE,
      verificationId,
      userId,
      email,
      code,
      ttl,
      createdAt,
      sendCount,
      windowStart
    });

    const command = new PutItemCommand({
      TableName: VERIFICATION_TABLE,
      Item: {
        verificationId: { S: verificationId },
        userId: { S: userId },
        email: { S: email },
        code: { S: code },
        failedVerifyCount: { N: '0' },
        TTL: { N: ttl.toString() },
        locale: { S: locale },
        createdAt: { S: createdAt },
        sendCount: { N: sendCount.toString() },
        windowStart: { N: windowStart.toString() }
      }
    });

    await dynamoClient.send(command);
    
    debugLog('DynamoDB保存成功:', userId);
    
    return {
      success: true,
      message: 'Verification code stored successfully'
    };
  } catch (error: any) {
    errorLog('DynamoDB保存エラー詳細:', {
      error: error.message,
      name: error.name,
      code: error.$metadata?.httpStatusCode,
      region: process.env.REGION,
      tableName: VERIFICATION_TABLE
    });
    return {
      success: false,
      error: `Failed to store verification code: ${error.message}`
    };
  }
}

// 認証コードを検証
export async function verifyEmailCodeAction(
  userId: string,
  email: string,
  code: string,
  userPoolId: string,
  locale: string,
  options?: {
    autoSignIn?: boolean;
    password?: string;
    redirectUrl?: string;
  }
): Promise<VerificationResponse> {
  try {
    // GSI email-createdAt-indexを使用してemailで検索
    const queryCommand = new QueryCommand({
      TableName: VERIFICATION_TABLE,
      IndexName: 'email-createdAt-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': { S: email }
      },
      ScanIndexForward: false // createdAtで降順ソート（最新を先頭に）
    });

    const result = await dynamoClient.send(queryCommand);
    
    // レート制限レコードを除外（code !== "RATE_LIMIT"）
    const verificationItems = result.Items?.filter(item => item.code?.S !== 'RATE_LIMIT') || [];
    
    if (verificationItems.length === 0) {
      return {
        success: false,
        error: 'Verification code not found or expired',
        remainingAttempts: 0
      };
    }

    // 最新の認証コードを取得（既に降順ソートされている）
    const item = verificationItems[0];
    const storedCode = item.code?.S;
    const failedVerifyCount = parseInt(item.failedVerifyCount?.N || '0');
    const ttl = parseInt(item.TTL?.N || '0');
    const verificationId = item.verificationId?.S;
    const createdAt = item.createdAt?.S;

    debugLog('検証データ:', { 
      storedCode, 
      failedVerifyCount, 
      ttl, 
      verificationId, 
      createdAt,
      totalItems: result.Items?.length || 0,
      verificationItemsCount: verificationItems.length,
      isLatest: true // 最新のアイテムであることを明示
    });

    // 複数の認証コードがある場合の警告
    if (verificationItems.length > 1) {
      debugLog(`⚠️ 複数の認証コードが存在します (${verificationItems.length}件)。最新のコードのみを検証します。`);
      debugLog('他の認証コード:', verificationItems.slice(1).map(item => ({
        verificationId: item.verificationId?.S,
        createdAt: item.createdAt?.S,
        failedVerifyCount: item.failedVerifyCount?.N
      })));
    }

    // TTLチェック
    if (Date.now() / 1000 > ttl) {
      // 期限切れの場合、該当emailの全アイテムを削除
      await deleteAllVerificationCodesByEmail(email);
      
      return {
        success: false,
        error: 'Verification code expired',
        remainingAttempts: 0
      };
    }

    // コード検証
    if (storedCode !== code) {
      const newFailedCount = failedVerifyCount + 1;

      if (newFailedCount >= 5) {
        // 5回目の失敗 - 該当emailの全アイテムを削除
        await deleteAllVerificationCodesByEmail(email);
        return {
          success: false,
          error: 'Too many failed attempts. Please request a new verification code.',
          remainingAttempts: 0
        };
      } else {
        // 試行回数を増加
        const updateCommand = new PutItemCommand({
          TableName: VERIFICATION_TABLE,
          Item: {
            ...item,
            failedVerifyCount: { N: newFailedCount.toString() }
          }
        });
        await dynamoClient.send(updateCommand);

        return {
          success: false,
          error: 'Invalid verification code',
          remainingAttempts: 5 - newFailedCount
        };
      }
    }

    // Cognitoユーザーの確認ステータスとメール確認を更新
    try {
      // 1. ユーザーを確認済みにする
      const confirmCommand = new AdminConfirmSignUpCommand({
        UserPoolId: userPoolId,
        Username: email
      });
      await cognitoClient.send(confirmCommand);
      debugLog('Cognitoユーザー確認完了');

      // 2. メール確認済みに設定
      const updateUserCommand = new AdminUpdateUserAttributesCommand({
        UserPoolId: userPoolId,
        Username: email,
        UserAttributes: [
          {
            Name: 'email_verified',
            Value: 'true'
          }
        ]
      });
      await cognitoClient.send(updateUserCommand);
      debugLog('Cognitoメール確認完了');

    } catch (cognitoError: any) {
      errorLog('Cognito更新エラー:', cognitoError);
      // Cognitoエラーがあっても認証は成功とする
    }

    // 認証成功 - 該当emailの全アイテムを削除
    await deleteAllVerificationCodesByEmail(email);

    // 自動サインインが有効な場合
    if (options?.autoSignIn && options?.password) {
      debugLog('自動サインインを実行します');
      
      // URLからlocaleを抽出（redirectUrlから取得）
      const urlLocale = options.redirectUrl ? options.redirectUrl.split('/')[1] : locale;
      
      const autoSignInResult = await performAutoSignInAction(
        email,
        options.password,
        userPoolId,
        process.env.COGNITO_CLIENT_ID!,
        urlLocale  // URLのlocaleを渡す
      );

      if (autoSignInResult.success) {
        
        // Cognitoドキュメントに従ってセッションを作成
        try {
          // Next.js のcookiesを使用してトークンを保存
          const { cookies } = await import('next/headers');
          const cookieStore = await cookies();
          
          if (autoSignInResult.accessToken) {
            cookieStore.set('accessToken', autoSignInResult.accessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict',
              maxAge: 60 * 60 * 24 // 24時間
            });
          }
          
          if (autoSignInResult.idToken) {
            cookieStore.set('idToken', autoSignInResult.idToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict',
              maxAge: 60 * 60 * 24 // 24時間
            });
          }
          
          if (autoSignInResult.refreshToken) {
            cookieStore.set('refreshToken', autoSignInResult.refreshToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict',
              maxAge: 60 * 60 * 24 * 30 // 30日間
            });
          }
          
          debugLog('Cognitoセッション作成完了');
        } catch (sessionError) {
          errorLog('セッション作成エラー:', sessionError);
        }
        
        return {
          success: true,
          message: 'Email verified and signed in successfully',
          autoSignIn: true,
          redirectUrl: options.redirectUrl || 'reload'
        };
      } else {
        debugLog('自動サインイン失敗:', autoSignInResult.error);
        // 自動サインインに失敗しても認証は成功とする
        return {
          success: true,
          message: 'Email verified successfully. Please sign in manually.',
          autoSignIn: false,
          redirectUrl: options.redirectUrl || 'reload'
        };
      }
    }

    return {
      success: true,
      message: 'Email verified successfully',
      autoSignIn: false,
      redirectUrl: options?.redirectUrl || 'reload'
    };
  } catch (error) {
    errorLog('Error verifying email code:', error);
    return {
      success: false,
      error: 'Failed to verify email code'
    };
  }
}

// 管理者用の認証コード検証（自動サインイン無効）
export async function verifyEmailCodeForAdminAction(
  userId: string,
  email: string,
  code: string,
  userPoolId: string,
  locale: string,
  redirectUrl?: string
): Promise<VerificationResponse> {
  return await verifyEmailCodeAction(
    userId,
    email,
    code,
    userPoolId,
    locale,
    {
      autoSignIn: false, // 管理者用は自動サインイン無効
      redirectUrl: redirectUrl || 'reload'
    }
  );
}

// メール更新用の認証コード検証（Cognitoユーザー確認なし）
export async function verifyEmailCodeForUpdateAction(
  userId: string,
  newEmail: string,
  code: string,
  locale: string
): Promise<VerificationResponse> {
  try {
    // GSI email-createdAt-indexを使用してnewEmailで検索
    const queryCommand = new QueryCommand({
      TableName: VERIFICATION_TABLE,
      IndexName: 'email-createdAt-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': { S: newEmail }
      },
      ScanIndexForward: false // createdAtで降順ソート（最新を先頭に）
    });

    const result = await dynamoClient.send(queryCommand);
    
    // レート制限レコードを除外（code !== "RATE_LIMIT"）
    const verificationItems = result.Items?.filter(item => item.code?.S !== 'RATE_LIMIT') || [];
    
    if (verificationItems.length === 0) {
      return {
        success: false,
        error: 'Verification code not found or expired'
      };
    }

    // 最新の認証コードを取得
    const item = verificationItems[0];
    const storedCode = item.code?.S;
    const failedVerifyCount = parseInt(item.failedVerifyCount?.N || '0');
    const ttl = parseInt(item.TTL?.N || '0');
    const verificationId = item.verificationId?.S;

    // TTLチェック
    if (Date.now() / 1000 > ttl) {
      await deleteAllVerificationCodesByEmail(newEmail);
      return {
        success: false,
        error: 'Verification code expired'
      };
    }

    // コード検証
    if (storedCode !== code) {
      const newFailedCount = failedVerifyCount + 1;
      debugLog(`認証コードが間違っています。試行回数: ${newFailedCount}/5`);

      if (newFailedCount >= 5) {
        debugLog('最大試行回数に達しました。全アイテムを削除します。');
        await deleteAllVerificationCodesByEmail(newEmail);
        return {
          success: false,
          error: 'Too many failed attempts. Please request a new verification code.'
        };
      } else {
        // 試行回数を増加
        const updateCommand = new PutItemCommand({
          TableName: VERIFICATION_TABLE,
          Item: {
            ...item,
            failedVerifyCount: { N: newFailedCount.toString() }
          }
        });
        await dynamoClient.send(updateCommand);

        return {
          success: false,
          error: 'Invalid verification code',
          remainingAttempts: 5 - newFailedCount
        };
      }
    }

    // 認証成功 - 認証コードを削除（Cognitoユーザー確認は行わない）
    debugLog('メール更新用認証コード検証成功');
    await deleteAllVerificationCodesByEmail(newEmail);

    return {
      success: true,
      message: 'Email verification successful for update'
    };
  } catch (error) {
    errorLog('Error verifying email code for update:', error);
    return {
      success: false,
      error: 'Failed to verify email code'
    };
  }
}

// ユーザー名を更新
export async function updateCognitoUsernameAction(
  userId: string,
  newUsername: string,
  userPoolId: string,
  locale: string
): Promise<VerificationResponse> {
  try {
    const command = new AdminUpdateUserAttributesCommand({
      UserPoolId: userPoolId,
      Username: userId,
      UserAttributes: [
        {
          Name: 'preferred_username',
          Value: newUsername
        }
      ]
    });

    await cognitoClient.send(command);
    
    return {
      success: true,
      message: 'Username updated successfully'
    };
  } catch (error) {
    errorLog('Error updating username:', error);
    return {
      success: false,
      error: 'Failed to update username'
    };
  }
}
