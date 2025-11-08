'use server'

import { 
  GetCommand, 
  PutCommand, 
  UpdateCommand, 
  DeleteCommand, 
  QueryCommand
} from '@aws-sdk/lib-dynamodb';
import { 
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminUpdateUserAttributesCommand,
  AdminGetUserCommand,
  AdminSetUserPasswordCommand
} from '@aws-sdk/client-cognito-identity-provider';
import { dynamoDocClient, cognitoClient } from '@/app/lib/aws-clients';
import { ApiResponse, User, UserAttributesDTO } from '@/app/lib/types/TypeAPIs';
import { validationSchema } from '@/app/lib/validations/validation';
import { debugLog, errorLog } from '@/app/lib/utils/logger';
import { 
  sendVerificationEmailAction 
} from '@/app/lib/actions/user-verification-actions';
import { logSuccessAction, logFailureAction } from '@/app/lib/actions/audit-log-actions';

const USER_TABLE_NAME = process.env.USER_TABLE_NAME || 'User';
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID!;

/**
 * 管理者のpaymentMethodIdを取得する関数
 */
async function getAdminPaymentMethodId(customerId: string): Promise<string | null> {
  try {
    // 同じcustomerIdを持つ管理者ユーザーを検索
    const command = new QueryCommand({
      TableName: USER_TABLE_NAME,
      IndexName: 'customerId-userName-index',
      KeyConditionExpression: 'customerId = :customerId',
      FilterExpression: '#role = :role',
      ExpressionAttributeNames: {
        '#role': 'role'
      },
      ExpressionAttributeValues: {
        ':customerId': customerId,
        ':role': 'admin'
      },
      Limit: 1
    });

    const result = await dynamoDocClient.send(command);
    
    if (result.Items && result.Items.length > 0) {
      const adminUser = result.Items[0] as User;
      debugLog('Admin user found for paymentMethodId:', { userId: adminUser.userId });
      
      // Cognitoから管理者のpaymentMethodIdを取得
      const getUserCommand = new AdminGetUserCommand({
        UserPoolId: USER_POOL_ID,
        Username: adminUser.userId
      });
      
      const cognitoUser = await cognitoClient.send(getUserCommand);
      const paymentMethodId = cognitoUser.UserAttributes?.find(
        attr => attr.Name === 'custom:paymentMethodId'
      )?.Value;
      
      debugLog('Admin paymentMethodId found:', paymentMethodId);
      return paymentMethodId || null;
    }
    
    debugLog('No admin user found for customerId:', customerId);
    return null;
  } catch (error) {
    errorLog('Error getting admin paymentMethodId:', error);
    return null;
  }
}

/**
 * ユーザー作成用のインターフェース
 */
interface CreateUserInput {
  userName: string;
  email: string;
  department: string;
  position: string;
  customerId: string;
  role: 'admin' | 'user';
  locale?: string;
  password?: string;
}

/**
 * ユーザー更新用のインターフェース
 */
interface UpdateUserInput {
  userId: string;
  userName?: string;
  email?: string;
  department?: string;
  position?: string;
  role?: 'admin' | 'user';
  locale?: string;
}

/**
 * ユーザークエリ用のインターフェース
 */
interface QueryUsersInput {
  customerId: string; // 必須に変更
  userName?: string; // ソートキーでの絞り込み用（部分一致）
  role?: 'admin' | 'user';
  limit?: number;
  lastEvaluatedKey?: Record<string, any>;
}

/**
 * エラーハンドリング用のヘルパー関数
 */
function handleError(error: any, operation: string): ApiResponse<any> {
  errorLog(`Error in ${operation}:`, {
    name: error.name,
    message: error.message,
    code: error.code,
    statusCode: error.$metadata?.httpStatusCode,
    requestId: error.$metadata?.requestId,
    timestamp: new Date().toISOString()
  });
  
  // AWS権限関連エラー
  if (error.name === 'AccessDeniedException' || error.message?.includes('is not authorized to perform')) {
    return {
      success: false,
      message: `AWS権限エラー: ${error.message}`,
      errors: { 
        aws: ['IAMユーザーまたはロールに適切な権限が設定されていません。'],
        permissions: ['DynamoDB: GetItem, PutItem, UpdateItem, DeleteItem, Query, Scan権限が必要です。'],
        cognito: ['Cognito: AdminGetUser, AdminCreateUser, AdminUpdateUserAttributes権限が必要です。']
      }
    };
  }
  
  // DynamoDB関連エラー
  if (error.name === 'ConditionalCheckFailedException') {
    return {
      success: false,
      message: 'ユーザーが見つかりません。',
      errors: { dynamodb: ['指定されたユーザーIDが存在しないか、条件が満たされませんでした。'] }
    };
  }
  
  if (error.name === 'ResourceNotFoundException') {
    return {
      success: false,
      message: 'DynamoDBテーブルが見つかりません。',
      errors: { 
        dynamodb: ['テーブル名を確認してください。'],
        config: [`環境変数 USER_TABLE_NAME: ${USER_TABLE_NAME}`]
      }
    };
  }
  
  if (error.name === 'ValidationException') {
    return {
      success: false,
      message: 'DynamoDBバリデーションエラー',
      errors: { 
        dynamodb: [error.message],
        validation: ['リクエストパラメータを確認してください。']
      }
    };
  }
  
  // Cognito関連エラー
  if (error.name === 'UserNotFoundException') {
    return {
      success: false,
      message: 'Cognitoユーザーが見つかりません。',
      errors: { 
        cognito: ['指定されたユーザーIDがCognito User Poolに存在しません。'],
        config: [`User Pool ID: ${USER_POOL_ID}`]
      }
    };
  }
  
  if (error.name === 'UsernameExistsException') {
    return {
      success: false,
      message: 'このメールアドレスは既に使用されています。',
      errors: { cognito: ['別のメールアドレスを使用してください。'] }
    };
  }
  
  if (error.name === 'InvalidParameterException') {
    return {
      success: false,
      message: 'Cognitoパラメータが無効です。',
      errors: { 
        cognito: [error.message],
        validation: ['ユーザー属性の形式を確認してください。']
      }
    };
  }
  
  // ネットワーク関連エラー
  if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
    return {
      success: false,
      message: 'ネットワーク接続エラー',
      errors: { 
        network: ['AWS サービスへの接続に失敗しました。'],
        config: ['リージョン設定とネットワーク接続を確認してください。']
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
 * ユーザーをIDで取得 (getItem)
 */
export async function getUserById(
  userId: string,
  userAttributes?: UserAttributesDTO
): Promise<ApiResponse<User>> {
  try {
    if (!userId) {
      return {
        success: false,
        message: 'ユーザーIDが必要です。',
      };
    }

    const command = new GetCommand({
      TableName: USER_TABLE_NAME,
      Key: { userId }
    });

    const result = await dynamoDocClient.send(command);

    if (!result.Item) {
      return {
        success: false,
        message: 'ユーザーが見つかりません。',
      };
    }

    debugLog('User retrieved successfully:', { userId });

    return {
      success: true,
      message: 'ユーザー情報を取得しました。',
      data: result.Item as User
    };

  } catch (error: any) {
    return handleError(error, 'ユーザー取得');
  }
}

/**
 * ユーザーをクエリで検索 (query)
 */
export async function queryUsers(
  input: QueryUsersInput
): Promise<ApiResponse<{ users: User[]; lastEvaluatedKey?: Record<string, any> }>> {
  try {
    // customerIdでクエリ（GSI使用）- customerIdは必須
    // userNameがソートキーの場合、部分一致クエリも可能
    let keyConditionExpression = 'customerId = :customerId';
    const expressionAttributeValues: Record<string, any> = {
      ':customerId': input.customerId
    };

    // userNameでの絞り込みが指定されている場合（オプション）
    if (input.userName) {
      keyConditionExpression += ' AND begins_with(userName, :userName)';
      expressionAttributeValues[':userName'] = input.userName;
    }

    const command = new QueryCommand({
      TableName: USER_TABLE_NAME,
      IndexName: 'customerId-userName-index', // GSIの名前（userNameがソートキー）
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      Limit: input.limit || 1000, // デフォルト値を1000に変更
      ExclusiveStartKey: input.lastEvaluatedKey
    });

    const result = await dynamoDocClient.send(command);

    // roleでフィルタリング（必要な場合）
    let users = result.Items as User[];
    if (input.role) {
      users = users.filter(user => user.role === input.role);
    }

    debugLog('Users queried successfully:', { 
      count: users.length, 
      customerId: input.customerId,
      userName: input.userName,
      role: input.role 
    });

    return {
      success: true,
      message: 'ユーザー一覧を取得しました。',
      data: {
        users,
        lastEvaluatedKey: result.LastEvaluatedKey
      }
    };

  } catch (error: any) {
    return handleError(error, 'ユーザークエリ');
  }
}

/**
 * ユーザーを作成 (create)
 * 1. Cognitoアカウントを先に作成
 * 2. Cognitoユーザーを検証
 * 3. DynamoDBに保存（PKはCognitoのsub）
 */
export async function createUser(
  input: CreateUserInput
): Promise<ApiResponse<User>> {
  let cognitoUserId: string | undefined;
  
  try {
    debugLog('createUser called with input:', input);
    
    // 入力バリデーション
    if (!input.email || !input.userName || !input.customerId) {
      debugLog('Missing required fields:', {
        email: !!input.email,
        userName: !!input.userName,
        customerId: !!input.customerId
      });
      return {
        success: false,
        message: '必須フィールドが不足しています。',
        errors: {
          validation: ['email, userName, customerIdは必須です。']
        }
      };
    }

    // Step 1: Cognitoユーザーを作成
    // 作成者のpaymentMethodIdを取得（管理者から継承）
    const adminPaymentMethodId = await getAdminPaymentMethodId(input.customerId);
    
    const cognitoCreateCommand = new AdminCreateUserCommand({
      UserPoolId: USER_POOL_ID,
      Username: input.email, // emailをUsernameとして使用
      UserAttributes: [
        { Name: 'email', Value: input.email },
        { Name: 'email_verified', Value: 'true' },
        { Name: 'preferred_username', Value: input.userName },
        { Name: 'custom:customerId', Value: input.customerId },
        { Name: 'custom:role', Value: input.role },
        { Name: 'locale', Value: input.locale || 'en' },
        { Name: 'custom:paymentMethodId', Value: adminPaymentMethodId || '' }
      ],
      TemporaryPassword: input.password || 'TempPass123!',
      MessageAction: 'SUPPRESS' // メール送信を抑制
    });

    const cognitoResult = await cognitoClient.send(cognitoCreateCommand);
    cognitoUserId = cognitoResult.User?.Username;

    if (!cognitoUserId) {
      throw new Error('Cognitoユーザーの作成に失敗しました。Username が取得できません。');
    }

    // パスワードが提供されている場合、永続的なパスワードとして設定
    if (input.password) {
      const setPasswordCommand = new AdminSetUserPasswordCommand({
        UserPoolId: USER_POOL_ID,
        Username: cognitoUserId,
        Password: input.password,
        Permanent: true // 永続的なパスワードとして設定
      });

      await cognitoClient.send(setPasswordCommand);
    }

    // Step 2: Cognitoユーザーを検証（subを取得）
    const verifyCommand = new AdminGetUserCommand({
      UserPoolId: USER_POOL_ID,
      Username: cognitoUserId
    });

    const verifyResult = await cognitoClient.send(verifyCommand);
    
    // subを取得（これがDynamoDBのPKになる）
    const cognitoSub = verifyResult.UserAttributes?.find(attr => attr.Name === 'sub')?.Value;
    
    if (!cognitoSub) {
      throw new Error('CognitoユーザーのsubIDが取得できませんでした。');
    }

    // Step 3: バリデーション
    const schemas = validationSchema(input.locale || 'en');
    const userData = {
      id: cognitoSub, // バリデーションスキーマではidフィールドを期待
      userName: input.userName,
      email: input.email,
      customerId: input.customerId,
      department: input.department,
      position: input.position,
      role: input.role,
    };

    debugLog('Validating user data:', userData);
    
    // updateUserSchemaを使用（idフィールドに合わせて）
    const validationResult = schemas.updateUserSchema.safeParse(userData);
    
    if (!validationResult.success) {
      debugLog('Validation failed:', validationResult.error.issues);
      
      const errors: Record<string, string[]> = {};
      validationResult.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (!errors[field]) errors[field] = [];
        errors[field].push(issue.message);
      });
      
      debugLog('Validation errors:', errors);
      
      // バリデーション失敗時はCognitoユーザーを削除
      await cognitoClient.send(new AdminDeleteUserCommand({
        UserPoolId: USER_POOL_ID,
        Username: cognitoUserId
      }));
      
      return {
        success: false,
        message: '入力内容に誤りがあります。',
        errors
      };
    }

    // Step 4: 2段階認証コードの送信
    const locale = input.locale || 'en';
    
    // 認証コード生成・保存・送信を一括で実行
    const emailResult = await sendVerificationEmailAction(
      input.email,
      cognitoSub,
      locale
    );
    
    if (!emailResult.success) {
      // ✅ 新しいAPI: messageKey を使用（ロケール対応）
      let errorMessage = 'メール送信に失敗しました。';
      
      if (emailResult.messageKey) {
        // レート制限エラーの場合
        errorMessage = emailResult.error || 'メール送信に失敗しました。';
      } else if (emailResult.error) {
        errorMessage = emailResult.error;
      }
      
      errorLog('SESメール送信失敗:', errorMessage);
      
      // メール送信失敗時はCognitoユーザーを削除
      await cognitoClient.send(new AdminDeleteUserCommand({
        UserPoolId: USER_POOL_ID,
        Username: cognitoUserId
      }));
      
      return {
        success: false,
        message: errorMessage,
        errors: { general: [errorMessage] },
        messageKey: emailResult.messageKey,
        resetAt: emailResult.resetAt
      };
    }

    // Step 5: DynamoDBにユーザー情報を保存
    debugLog('Saving user to DynamoDB:', { userId: cognitoSub, customerId: input.customerId });
    
    const now = new Date().toISOString();
    const newUser: User = {
      userId: cognitoSub, // CognitoのsubをPKとして使用
      userName: input.userName,
      email: input.email,
      customerId: input.customerId,
      department: input.department,
      position: input.position,
      role: input.role,
      locale: input.locale || 'en', // localeをDynamoDBに保存
      createdAt: now,
      updatedAt: now
    };

    const putCommand = new PutCommand({
      TableName: USER_TABLE_NAME,
      Item: newUser,
      ConditionExpression: 'attribute_not_exists(userId)' // 重複防止
    });

    await dynamoDocClient.send(putCommand);

    debugLog('User created successfully:', { 
      userId: cognitoSub,
      cognitoUserId,
      email: input.email,
      customerId: input.customerId 
    });

    // 監査ログ記録（成功）
    await logSuccessAction('CREATE', 'User', 'userName', '', input.userName);

    return {
      success: true,
      message: 'ユーザーが正常に作成されました。確認メールを送信しました。',
      data: newUser,
      verificationId: cognitoSub,
      email: input.email
    };

  } catch (error: any) {
    // エラー時のクリーンアップ：Cognitoユーザーが作成済みの場合は削除
    if (cognitoUserId) {
      try {
        await cognitoClient.send(new AdminDeleteUserCommand({
          UserPoolId: USER_POOL_ID,
          Username: cognitoUserId
        }));
        debugLog('Cleaned up Cognito user due to error:', { cognitoUserId });
      } catch (cleanupError) {
        errorLog('Failed to cleanup Cognito user:', cleanupError);
      }
    }
    
    // 監査ログ記録（失敗）
    await logFailureAction('CREATE', 'User', error?.message || 'ユーザー作成に失敗しました', 'userName', '', input.userName || '');
    
    return handleError(error, 'ユーザー作成');
  }
}

/**
 * ユーザーを更新 (update)
 */
export async function updateUser(
  input: UpdateUserInput,
  userAttributes?: UserAttributesDTO
): Promise<ApiResponse<User>> {
  try {
    debugLog('updateUser called with:', { input, userAttributes });
    
    // 更新前の値を取得（監査ログ用）
    const existingUserResult = await getUserById(input.userId, userAttributes);
    if (!existingUserResult.success || !existingUserResult.data) {
      return {
        success: false,
        message: 'ユーザー情報の取得に失敗しました。',
      };
    }
    const existingUser = existingUserResult.data;
    
    // ロール変更の場合、最後の管理者かチェック
    if (input.role === 'user' && userAttributes) {
      debugLog('Checking if this is the last admin...');
      
      const currentUser = existingUser;
      
      // 現在のユーザーが管理者の場合のみチェック
      if (currentUser.role === 'admin') {
        // 同じcustomerIdの全管理者を取得
        const adminsResult = await queryUsers({
          customerId: currentUser.customerId,
          role: 'admin'
        });
        
        if (adminsResult.success && adminsResult.data) {
          const adminCount = adminsResult.data.users.length;
          debugLog('Admin count for customerId:', { 
            customerId: currentUser.customerId, 
            adminCount 
          });
          
          // 管理者が1人だけの場合はロール変更を拒否
          if (adminCount === 1) {
            return {
              success: false,
              message: '組織に管理者が1人しかいないため、ロールを変更できません。',
              errors: {
                role: ['最後の管理者のロールは変更できません。先に別のユーザーを管理者に昇格させてください。']
              }
            };
          }
        }
      }
    }
    
    // 個別フィールドバリデーション（提供されたフィールドのみ）
    const errors: Record<string, string[]> = {};
    
    // userNameのバリデーション
    if (input.userName !== undefined) {
      if (!input.userName.trim()) {
        errors.userName = ['ユーザー名は必須です。'];
      }
    }
    
    // emailのバリデーション
    if (input.email !== undefined) {
      if (!input.email.trim()) {
        errors.email = ['メールアドレスは必須です。'];
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.email)) {
          errors.email = ['有効なメールアドレスを入力してください。'];
        }
      }
    }
    
    // departmentのバリデーション
    if (input.department !== undefined) {
      if (!input.department.trim()) {
        errors.department = ['部署は必須です。'];
      }
    }
    
    // positionのバリデーション
    if (input.position !== undefined) {
      if (!input.position.trim()) {
        errors.position = ['役職は必須です。'];
      }
    }
    
    // localeのバリデーション
    if (input.locale !== undefined) {
      const validLocales = ['ja', 'en', 'ko', 'zh', 'es', 'fr', 'de', 'pt', 'id'];
      if (!validLocales.includes(input.locale)) {
        errors.locale = ['有効な言語を選択してください。'];
      }
    }
    
    if (Object.keys(errors).length > 0) {
      debugLog('Validation errors:', errors);
      return {
        success: false,
        message: '入力内容に誤りがあります。',
        errors
      };
    }

    // 更新するフィールドを動的に構築
    const updateExpression: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};
    
    if (input.userName) {
      updateExpression.push('#userName = :userName');
      expressionAttributeNames['#userName'] = 'userName';
      expressionAttributeValues[':userName'] = input.userName;
    }
    
    if (input.email) {
      updateExpression.push('#email = :email');
      expressionAttributeNames['#email'] = 'email';
      expressionAttributeValues[':email'] = input.email;
    }
    
    if (input.department) {
      updateExpression.push('#department = :department');
      expressionAttributeNames['#department'] = 'department';
      expressionAttributeValues[':department'] = input.department;
    }
    
    if (input.position) {
      updateExpression.push('#position = :position');
      expressionAttributeNames['#position'] = 'position';
      expressionAttributeValues[':position'] = input.position;
    }

    if (input.role) {
      updateExpression.push('#role = :role');
      expressionAttributeNames['#role'] = 'role';
      expressionAttributeValues[':role'] = input.role;
    }

    if (input.locale) {
      updateExpression.push('#locale = :locale');
      expressionAttributeNames['#locale'] = 'locale';
      expressionAttributeValues[':locale'] = input.locale;
    }

    // 更新日時を追加
    updateExpression.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    if (updateExpression.length === 1) { // updatedAtのみの場合
      return {
        success: false,
        message: '更新するフィールドがありません。',
      };
    }

    // DynamoDB更新
    const updateCommand = new UpdateCommand({
      TableName: USER_TABLE_NAME,
      Key: { userId: input.userId },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ConditionExpression: 'attribute_exists(userId)',
      ReturnValues: 'ALL_NEW'
    });

    const result = await dynamoDocClient.send(updateCommand);

    // Cognito属性も更新（userName、email、role、localeの場合）
    if (input.userName || input.email || input.role || input.locale) {
      const cognitoAttributes = [];
      
      if (input.userName) {
        cognitoAttributes.push({ Name: 'preferred_username', Value: input.userName });
      }
      
      if (input.email) {
        cognitoAttributes.push({ Name: 'email', Value: input.email });
        cognitoAttributes.push({ Name: 'email_verified', Value: 'true' });
      }

      if (input.role) {
        cognitoAttributes.push({ Name: 'custom:role', Value: input.role });
      }

      if (input.locale) {
        cognitoAttributes.push({ Name: 'locale', Value: input.locale });
      }

      debugLog('Updating Cognito attributes:', cognitoAttributes);

      if (cognitoAttributes.length > 0) {
        const cognitoUpdateCommand = new AdminUpdateUserAttributesCommand({
          UserPoolId: USER_POOL_ID,
          Username: input.userId, // CognitoのUsernameはsubを使用
          UserAttributes: cognitoAttributes,
        });

        await cognitoClient.send(cognitoUpdateCommand);
        debugLog('Cognito attributes updated successfully');
      }
    }

    debugLog('User updated successfully:', {
      userId: input.userId,
      updatedFields: Object.keys(expressionAttributeValues).filter(key => key !== ':updatedAt')
    });

    // 監査ログ記録（成功） - 各フィールドごとに記録
    if (input.userName) {
      await logSuccessAction('UPDATE', 'User', 'userName', existingUser.userName, input.userName);
    }
    if (input.email) {
      await logSuccessAction('UPDATE', 'User', 'email', existingUser.email, input.email);
    }
    if (input.department) {
      await logSuccessAction('UPDATE', 'User', 'department', existingUser.department, input.department);
    }
    if (input.position) {
      await logSuccessAction('UPDATE', 'User', 'position', existingUser.position, input.position);
    }
    if (input.role) {
      await logSuccessAction('UPDATE', 'User', 'role', existingUser.role, input.role);
    }
    if (input.locale) {
      await logSuccessAction('UPDATE', 'User', 'locale', existingUser.locale || '', input.locale);
    }

    return {
      success: true,
      message: 'ユーザー情報が正常に更新されました。',
      data: result.Attributes as User
    };

  } catch (error: any) {
    // 監査ログ記録（失敗）
    await logFailureAction('UPDATE', 'User', error?.message || 'ユーザー更新に失敗しました', 'userId', '', input.userId);
    
    return handleError(error, 'ユーザー更新');
  }
}


/**
 * ユーザーを削除 (delete) - グループリレーションも削除
 */
export async function deleteUser(
  userId: string,
  softDelete: boolean = false // デフォルトをハード削除に変更
): Promise<ApiResponse<{ deletedGroupIds: string[] }>> {
  try {
    if (!userId) {
      return {
        success: false,
        message: 'ユーザーIDが必要です。',
      };
    }

    // Step 0: 最後の管理者かチェック
    debugLog('Checking if this is the last admin before deletion...');
    
    // 削除対象のユーザー情報を取得
    const targetUserResult = await getUserById(userId);
    if (!targetUserResult.success || !targetUserResult.data) {
      return {
        success: false,
        message: 'ユーザー情報の取得に失敗しました。',
      };
    }
    
    const targetUser = targetUserResult.data;
    
    // 削除対象が管理者の場合、他に管理者がいるかチェック
    if (targetUser.role === 'admin') {
      const adminsResult = await queryUsers({
        customerId: targetUser.customerId,
        role: 'admin'
      });
      
      if (adminsResult.success && adminsResult.data) {
        const adminCount = adminsResult.data.users.length;
        debugLog('Admin count for customerId:', { 
          customerId: targetUser.customerId, 
          adminCount 
        });
        
        // 管理者が1人だけの場合は削除を拒否
        if (adminCount === 1) {
          return {
            success: false,
            message: '組織に管理者が1人しかいないため、このユーザーを削除できません。',
            errors: {
              role: ['最後の管理者は削除できません。先に別のユーザーを管理者に昇格させてください。']
            }
          };
        }
      }
    }

    // Step 1: ユーザーが参加しているグループを取得
    const { getGroupsByUserId } = await import('./group-api');
    const userGroupsResult = await getGroupsByUserId(userId);
    
    if (!userGroupsResult.success) {
      errorLog('Failed to get user groups:', userGroupsResult.message);
      return {
        success: false,
        message: 'ユーザーのグループ情報取得に失敗しました。',
        errors: { group: [userGroupsResult.message || ''] }
      };
    }

    const userGroups = userGroupsResult.data || [];
    const deletedGroupIds: string[] = [];

    // Step 2: 各グループから処理
    for (const userGroup of userGroups) {
      const { getUsersByGroupId, deleteGroup } = await import('./group-api');
      
      // グループの全ユーザーを取得
      const groupUsersResult = await getUsersByGroupId(userGroup.groupId);
      
      if (groupUsersResult.success && groupUsersResult.data) {
        const groupUsers = groupUsersResult.data;
        
        // このユーザーが唯一のメンバーの場合、グループも削除
        if (groupUsers.length === 1 && groupUsers[0].userId === userId) {
          debugLog('Deleting group with single user:', { 
            groupId: userGroup.groupId, 
            userId 
          });
          
          const deleteGroupResult = await deleteGroup(userGroup.groupId, false); // ハード削除
          if (deleteGroupResult.success) {
            deletedGroupIds.push(userGroup.groupId);
          } else {
            errorLog('Failed to delete group:', deleteGroupResult.message);
          }
        }
      }
    }

    // Step 3: ユーザーグループリレーションを削除
    if (userGroups.length > 0) {
      const { removeUsersFromGroup } = await import('./group-api');
      
      // 各グループからユーザーを削除（削除されなかったグループのみ）
      for (const userGroup of userGroups) {
        if (!deletedGroupIds.includes(userGroup.groupId)) {
          const removeResult = await removeUsersFromGroup(userGroup.groupId, [userId]);
          if (!removeResult.success) {
            errorLog('Failed to remove user from group:', {
              groupId: userGroup.groupId,
              userId,
              error: removeResult.message
            });
          }
        }
      }
    }

    // Step 4: ユーザー本体を削除
    if (softDelete) {
      // ソフト削除（削除フラグを設定）
      const updateCommand = new UpdateCommand({
        TableName: USER_TABLE_NAME,
        Key: { userId },
        UpdateExpression: 'SET #deletedAt = :deletedAt, #updatedAt = :updatedAt',
        ExpressionAttributeNames: {
          '#deletedAt': 'deletedAt',
          '#updatedAt': 'updatedAt'
        },
        ExpressionAttributeValues: {
          ':deletedAt': new Date().toISOString(),
          ':updatedAt': new Date().toISOString()
        },
        ConditionExpression: 'attribute_exists(userId)',
      });

      await dynamoDocClient.send(updateCommand);
    } else {
      // ハード削除
      const deleteCommand = new DeleteCommand({
        TableName: USER_TABLE_NAME,
        Key: { userId },
        ConditionExpression: 'attribute_exists(userId)',
      });

      await dynamoDocClient.send(deleteCommand);

      // Cognitoユーザーも削除
      const cognitoDeleteCommand = new AdminDeleteUserCommand({
        UserPoolId: USER_POOL_ID,
        Username: userId,
      });

      await cognitoClient.send(cognitoDeleteCommand);
    }

    debugLog('User deleted successfully:', { 
      userId, 
      softDelete,
      deletedGroupIds,
      removedFromGroups: userGroups.length - deletedGroupIds.length
    });

    let message = softDelete ? 'ユーザーが無効化されました。' : 'ユーザーが削除されました。';
    if (deletedGroupIds.length > 0) {
      message += ` ${deletedGroupIds.length}個のグループも削除されました。`;
    }
    if (userGroups.length - deletedGroupIds.length > 0) {
      message += ` ${userGroups.length - deletedGroupIds.length}個のグループから削除されました。`;
    }

    // 監査ログ記録（成功）
    await logSuccessAction('DELETE', 'User', 'userName', targetUser.userName, '');

    return {
      success: true,
      message,
      data: { deletedGroupIds }
    };

  } catch (error: any) {
    // 監査ログ記録（失敗）
    await logFailureAction('DELETE', 'User', error?.message || 'ユーザー削除に失敗しました', 'userName', '', '');
    
    return handleError(error, 'ユーザー削除');
  }
}

/**
 * 削除されたユーザーを復元
 */
export async function restoreUser(userId: string): Promise<ApiResponse<User>> {
  try {
    if (!userId) {
      return {
        success: false,
        message: 'ユーザーIDが必要です。',
      };
    }

    const updateCommand = new UpdateCommand({
      TableName: USER_TABLE_NAME,
      Key: { userId },
      UpdateExpression: 'REMOVE #deletedAt SET #updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#deletedAt': 'deletedAt',
        '#updatedAt': 'updatedAt'
      },
      ExpressionAttributeValues: {
        ':updatedAt': new Date().toISOString()
      },
      ConditionExpression: 'attribute_exists(userId) AND attribute_exists(deletedAt)',
      ReturnValues: 'ALL_NEW'
    });

    const result = await dynamoDocClient.send(updateCommand);

    debugLog('User restored successfully:', { userId });

    // 監査ログ記録（成功）
    await logSuccessAction('UPDATE', 'User', 'restore', 'deleted', 'active');

    return {
      success: true,
      message: 'ユーザーが復元されました。',
      data: result.Attributes as User
    };

  } catch (error: any) {
    // 監査ログ記録（失敗）
    await logFailureAction('UPDATE', 'User', error?.message || 'ユーザー復元に失敗しました', 'restore', '', userId);
    
    return handleError(error, 'ユーザー復元');
  }
}

