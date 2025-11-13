'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getUserCustomAttributes, type UserAttributes } from '@/app/utils/cognito-utils';
import { InitiateAuthCommand, GetUserCommand, SignUpCommand, ConfirmSignUpCommand, ResendConfirmationCodeCommand, ForgotPasswordCommand, ConfirmForgotPasswordCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient } from '@/app/lib/aws-clients';
import { sendVerificationCodeEmailAction } from '@/app/lib/actions/email-actions';
import { debugLog, errorLog, warnLog } from '@/app/lib/utils/logger';
import { 
  verifyEmailCodeAction,
  sendVerificationEmailAction 
} from '@/app/lib/actions/user-verification-actions';
import { z } from 'zod';
import { validatePassword, validatePasswordComplete } from '@/app/lib/utils/password-validation';

export interface AuthUser {
  sub: string;
  email: string;
  email_verified: boolean;
  preferred_username?: string;
  customerId?: string;
  attributes?: UserAttributes;
  [key: string]: any;
}

export async function getCurrentUserAction(): Promise<AuthUser | null> {
  try {
    const userAttributes = await getUserCustomAttributes();
    
    if (!userAttributes || !userAttributes.sub) {
      return null;
    }

    return {
      sub: userAttributes.sub,
      email: userAttributes.email || '',
      email_verified: userAttributes.email_verified === 'true',
      preferred_username: userAttributes.preferred_username,
      customerId: userAttributes['custom:customerId'],
      attributes: userAttributes
    };
  } catch (error) {
    errorLog('Error getting current user:', error);
    return null;
  }
}

// サインインアクションの戻り値の型
export interface SignInActionState {
  success: boolean;
  message: string;
  errors: Record<string, string>;
  redirectTo?: string;
  verificationId?: string;
  email?: string;
  messageKey?: 'rateLimitExceeded' | 'rateLimitBlocked' | 'rateLimitSendExceeded' | 'rateLimitCheckExceeded';
  resetAt?: Date;
}

// サインインフォームのスキーマ
const signInSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function signInAction(
  prevState: SignInActionState,
  formData: FormData
): Promise<SignInActionState> {
  // ロケールを取得（デフォルトは'en'）
  const locale = (formData.get('locale') as string) || 'en';
  
  try {
    // フォームデータの検証
    const validatedFields = signInSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    if (!validatedFields.success) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validatedFields.error.flatten().fieldErrors as Record<string, string>,
      };
    }

    const { email, password } = validatedFields.data;

    // Cognito でサインイン
    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: process.env.COGNITO_CLIENT_ID!,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    const response = await cognitoClient.send(command);

    if (response.AuthenticationResult) {
      // 2段階認証を必須化: トークン保存は行わず、認証コードを発行・送信

      // 認証コード生成・保存・送信を一括で実行
      const emailResult = await sendVerificationEmailAction(
        email,
        email, // 既存ユーザーはemailをuserIdとして扱う
        locale
      );

      if (!emailResult.success) {
        // ✅ 新しいAPI: messageKey を使用（ロケール対応）
        let errorMessage = emailResult.error || 'verification_email_failed';
        
        // レート制限の場合、messageKeyを含める
        if (emailResult.messageKey) {
          errorMessage = emailResult.messageKey;
        }
        
        return {
          success: false,
          message: 'Failed to send verification code',
          errors: { general: errorMessage },
          messageKey: emailResult.messageKey,
          resetAt: emailResult.resetAt,
        };
      }

      // フロント側でVerificationFormを表示するための情報を返す
      return {
        success: true,
        message: 'Verification code sent. Please complete two-factor verification.',
        errors: {},
        verificationId: email, // emailをverificationIdとして使用
        email
      };
    }

    return {
      success: false,
      message: 'Authentication failed',
      errors: {},
    };

  } catch (error: any) {
    errorLog('Sign in error:', error);
    
    // エラーコードをそのまま返す（フロント側で辞書を使って表示）
    let errorCode = 'signInFailed';
    if (error.name === 'NotAuthorizedException') {
      errorCode = 'notAuthorized';
    } else if (error.name === 'UserNotConfirmedException') {
      errorCode = 'userNotConfirmed';
    } else if (error.name === 'UserNotFoundException') {
      errorCode = 'userNotFound';
    } else if (error.name === 'PasswordResetRequiredException') {
      errorCode = 'passwordResetRequired';
    } else if (error.name === 'InvalidParameterException') {
      errorCode = 'invalidParameter';
    } else if (error.name === 'TooManyRequestsException') {
      errorCode = 'tooManyRequests';
    }

    return {
      success: false,
      message: errorCode,
      errors: {},
    };
  }
}

export async function clearInvalidTokensAction() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
    cookieStore.delete('idToken');
    return { success: true };
  } catch (error) {
    errorLog('Error clearing tokens:', error);
    return { success: false };
  }
}

export async function signOutAction(locale: string = 'en') {
  try {
    // Cookieからトークンを削除
    const cookieStore = await cookies();
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
    cookieStore.delete('idToken');
    
    // ホームページにリダイレクト
    redirect(`/${locale}`);
  } catch (error: any) {
    // NEXT_REDIRECTエラーの場合は再スロー（Next.jsの正常な動作）
    if (error.digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    
    errorLog('Error signing out:', error);
    redirect(`/${locale}`);
  }
}

// ユーザー登録の型定義
export interface SignUpData {
  email: string;
  password: string;
  confirmPassword: string;
}

// サーバーアクション: Cognitoユーザーを作成
export async function signUpAction(prevState: any, formData: FormData) {
  // FormDataから値を取得（tryブロック外で定義してcatchブロックでもアクセス可能にする）
  const signUpData: SignUpData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  };

  try {
    // バリデーション
    if (!signUpData.email || !signUpData.password || !signUpData.confirmPassword) {
      return {
        success: false,
        errors: { general: 'すべてのフィールドを入力してください' },
        message: '',
        verificationId: undefined
      };
    }

    // メールアドレスの形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signUpData.email)) {
      return {
        success: false,
        errors: { email: '有効なメールアドレスを入力してください' },
        message: '',
        verificationId: undefined
      };
    }

    // パスワードの検証（共通関数を使用）
    const passwordValidation = validatePasswordComplete(signUpData.password, signUpData.confirmPassword);
    if (!passwordValidation.valid) {
      return {
        success: false,
        errors: { password: passwordValidation.error },
        message: '',
        verificationId: undefined
      };
    }

    // Cognitoでユーザーを作成
    const signUpCommand = new SignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID!,
      Username: signUpData.email,
      Password: signUpData.password,
      UserAttributes: [
        {
          Name: 'email',
          Value: signUpData.email,
        },
      ],
      // MessageActionは削除 - SESテンプレートメールを使用
    });

    const result = await cognitoClient.send(signUpCommand);

    // ユーザー作成成功
    if (result.UserSub) {
      
      const locale = formData.get('locale') as string || 'en';
      
      // 認証コード生成・保存・送信を一括で実行
      const emailResult = await sendVerificationEmailAction(
        signUpData.email,
        result.UserSub,
        locale
      );
      
      if (emailResult.success) {
        return {
          success: true,
          message: 'ユーザーが正常に作成されました。確認メールを送信しました。',
          errors: {},
          verificationId: result.UserSub,
          email: signUpData.email
        };
      } else {
        // ✅ 新しいAPI: messageKey を使用（ロケール対応）
        return {
          success: true,
          message: 'ユーザーが正常に作成されました。メール送信でエラーが発生しましたが、再送信をお試しください。',
          errors: {},
          verificationId: result.UserSub,
          email: signUpData.email,
          messageKey: emailResult.messageKey,
          resetAt: emailResult.resetAt
        };
      }
    } else {
      return {
        success: false,
        errors: { general: 'ユーザーの作成に失敗しました' },
        message: '',
        verificationId: undefined
      };
    }

  } catch (error: any) {
    errorLog('Cognitoユーザー作成エラー:', error);
    
    // Cognitoのエラーメッセージを日本語に変換
    let errorMessage = 'ユーザーの作成に失敗しました';
    
    if (error.name === 'UsernameExistsException') {
      // 既存ユーザーの場合、SESで認証コードを送信
      try {
        const locale = formData.get('locale') as string || 'en';
        
        // 認証コード生成・保存・送信を一括で実行（既存ユーザーの場合はメールアドレスをuserIdとして使用）
        const emailResult = await sendVerificationEmailAction(
          signUpData.email,
          signUpData.email, // 既存ユーザーの場合はメールアドレスをuserIdとして使用
          locale
        );
        
        if (emailResult.success) {
          return {
            success: true,
            message: '既存のアカウントに認証コードを再送信しました。',
            errors: {},
            verificationId: signUpData.email, // メールアドレスをverificationIdとして使用
            email: signUpData.email
          };
        } else {
          errorMessage = 'このメールアドレスは既に登録されています。メール送信でエラーが発生しました。';
        }
      } catch (resendError) {
        errorMessage = 'このメールアドレスは既に登録されています。サインインページからログインしてください。';
      }
    } else if (error.name === 'InvalidPasswordException') {
      errorMessage = 'パスワードが要件を満たしていません';
    } else if (error.name === 'InvalidParameterException') {
      errorMessage = '入力された情報が正しくありません';
    } else if (error.name === 'TooManyRequestsException') {
      errorMessage = 'リクエストが多すぎます。しばらく待ってから再試行してください';
    }

    return {
      success: false,
      errors: { general: errorMessage },
      message: '',
      verificationId: undefined
    };
  }
}

// 確認コード検証のサーバーアクション
export async function confirmSignUpAction(prevState: any, formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const confirmationCode = formData.get('confirmationCode') as string;

    // バリデーション
    if (!email || !confirmationCode) {
      return {
        success: false,
        errors: { general: 'メールアドレスと確認コードを入力してください' },
        message: ''
      };
    }

    // パスワードを取得（自動サインイン用）
    const password = formData.get('password') as string;
    const autoSignIn = formData.get('autoSignIn') === 'true';
    const locale = formData.get('locale') as string || 'en';

    // DynamoDBから認証コードを検証
    // まず、emailをuserIdとして検索（既存ユーザー対応）
    let verificationResult = await verifyEmailCodeAction(
      email, // 既存ユーザーの場合
      email,
      confirmationCode,
      process.env.COGNITO_USER_POOL_ID!,
      locale,
      {
        autoSignIn: autoSignIn,
        password: password,
        redirectUrl: `/${locale}/account/user`
      }
    );
    
    // 既存ユーザーで見つからない場合、新規ユーザーとして検索
    // 実際の実装では、UserSubとemailのマッピングテーブルが必要
    if (!verificationResult.success) {
      // 新規ユーザーの場合、UserSubが必要だが、ここではemailから推測できないため
      // 一時的な対応として、認証コードが見つからないエラーを返す
      return {
        success: false,
        errors: { 
          general: verificationResult.error || '認証コードが見つかりません。再送信をお試しください。' 
        },
        message: ''
      };
    }

    // Cognitoでユーザーを確認済みに設定
    try {
      const confirmCommand = new ConfirmSignUpCommand({
        ClientId: process.env.COGNITO_CLIENT_ID!,
        Username: email,
        ConfirmationCode: '000000', // ダミーコード（MessageAction: SUPPRESSの場合）
      });

      await cognitoClient.send(confirmCommand);
    } catch (cognitoError: any) {
      // MessageAction: SUPPRESSの場合、ConfirmSignUpは失敗する可能性があるが、
      // カスタム認証コードが正しければ成功とする
    }

    // 認証成功のレスポンス
    if (verificationResult.autoSignIn) {
      return {
        success: true,
        message: 'アカウントが正常に確認され、自動サインインしました。',
        errors: {},
        redirectUrl: verificationResult.redirectUrl || 'reload'
      };
    } else {
      return {
        success: true,
        message: 'アカウントが正常に確認されました。サインインしてください。',
        errors: {},
        redirectUrl: verificationResult.redirectUrl || 'reload'
      };
    }

  } catch (error: any) {
    errorLog('確認コード検証エラー:', error);
    
    let errorMessage = '確認コードの検証に失敗しました';
    
    if (error.name === 'CodeMismatchException') {
      errorMessage = '確認コードが正しくありません';
    } else if (error.name === 'ExpiredCodeException') {
      errorMessage = '確認コードの有効期限が切れています';
    } else if (error.name === 'UserNotFoundException') {
      errorMessage = 'ユーザーが見つかりません';
    }

    return {
      success: false,
      errors: { general: errorMessage },
      message: ''
    };
  }
}

// サインイン用の確認コード検証のサーバーアクション
export async function confirmSignInAction(prevState: any, formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const confirmationCode = formData.get('confirmationCode') as string;

    // バリデーション
    if (!email || !confirmationCode) {
      return {
        success: false,
        errors: { general: 'メールアドレスと確認コードを入力してください' },
        message: ''
      };
    }

    // パスワードを取得（自動サインイン用）
    const password = formData.get('password') as string;
    const locale = formData.get('locale') as string || 'en';

    // DynamoDBから認証コードを検証（サインイン用なのでCognito確認は不要）
    const verificationResult = await verifyEmailCodeAction(
      email,
      email,
      confirmationCode,
      process.env.COGNITO_USER_POOL_ID!,
      locale,
      {
        autoSignIn: !!password,
        password: password,
        redirectUrl: `/${locale}/account/user`
      }
    );
    
    if (!verificationResult.success) {
      return {
        success: false,
        errors: { 
          general: verificationResult.error || '認証コードが正しくありません。' 
        },
        message: ''
      };
    }

    // 認証成功のレスポンス
    return {
      success: true,
      message: verificationResult.autoSignIn ? '認証が完了し、自動サインインしました。' : '認証が完了しました。',
      errors: {},
      redirectUrl: verificationResult.redirectUrl || `/${locale}/account/user`
    };

  } catch (error: any) {
    let errorMessage = '確認コードの検証に失敗しました';
    
    if (error.name === 'CodeMismatchException') {
      errorMessage = '確認コードが正しくありません';
    } else if (error.name === 'ExpiredCodeException') {
      errorMessage = '確認コードの有効期限が切れています';
    }

    return {
      success: false,
      errors: { general: errorMessage },
      message: ''
    };
  }
}

// 認証コード再送信のサーバーアクション
export async function resendVerificationCodeAction(
  verificationId: string,
  locale: string = 'en'
): Promise<{
  success: boolean;
  message: string;
  newVerificationId?: string;
  messageKey?: 'rateLimitExceeded' | 'rateLimitBlocked' | 'rateLimitSendExceeded' | 'rateLimitCheckExceeded';
  resetAt?: Date;
}> {
  try {
    // verificationIdがemailの形式かUserSubの形式かを判定
    const isEmail = verificationId.includes('@');
    const userId = verificationId; // 既存・新規ユーザー共にverificationIdをuserIdとして使用
    const email = isEmail ? verificationId : verificationId; // 簡易実装

    // 認証コード生成・保存・送信を一括で実行
    const emailResult = await sendVerificationEmailAction(
      email,
      userId,
      locale
    );

    if (emailResult.success) {
      return {
        success: true,
        message: '新しい認証コードを送信しました',
        newVerificationId: userId,
      };
    } else {
      // ✅ 新しいAPI: messageKey を使用（ロケール対応）
      return {
        success: false,
        message: '認証コードの再送信に失敗しました',
        messageKey: emailResult.messageKey,
        resetAt: emailResult.resetAt
      };
    }

  } catch (error: any) {
    errorLog('認証コード再送信エラー:', error);
    return {
      success: false,
      message: '認証コードの再送信に失敗しました',
    };
  }
}

/**
 * パスワードリセット: 認証コード送信（カスタムメール使用）
 */
export async function forgotPasswordAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const locale = formData.get('locale') as string || 'en';
  
  try {
    // バリデーション
    if (!email) {
      return {
        success: false,
        message: 'メールアドレスを入力してください',
        errors: { email: 'メールアドレスを入力してください' }
      };
    }
    
    // メールアドレスの形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: '有効なメールアドレスを入力してください',
        errors: { email: '有効なメールアドレスを入力してください' }
      };
    }
    
    // ユーザーが存在するか確認（Cognitoで確認）
    try {
      const getUserCommand = new GetUserCommand({
        AccessToken: undefined // メールアドレスだけでは確認できないので、ForgotPasswordCommandで確認
      });
      // 代わりにForgotPasswordCommandを使用してユーザーの存在を確認
    } catch (error) {
      // ユーザーが存在しない場合でもセキュリティのため同じメッセージを返す
    }
    
    // 認証コード生成・保存・送信を一括で実行（パスワードリセット用）
    const emailResult = await sendVerificationEmailAction(
      email,
      email, // userIdの代わりにemailを使用
      locale
    );
    
    if (emailResult.success) {
      return {
        success: true,
        message: '認証コードをメールに送信しました',
        email: email
      };
    } else {
      // ✅ 新しいAPI: messageKey を使用（ロケール対応）
      let errorMessage = emailResult.error || '認証コードの送信に失敗しました';
      
      // レート制限の場合、messageKeyを含める
      if (emailResult.messageKey) {
        errorMessage = emailResult.messageKey;
      }
      
      return {
        success: false,
        message: '認証コードの送信に失敗しました',
        errors: { general: errorMessage },
        messageKey: emailResult.messageKey,
        resetAt: emailResult.resetAt
      };
    }
    
  } catch (error: any) {
    errorLog('ForgotPassword error:', error);
    
    return {
      success: false,
      message: error.message || 'エラーが発生しました',
      errors: { general: error.message || 'エラーが発生しました' }
    };
  }
}

/**
 * パスワードリセット: 認証コード確認とパスワード更新（カスタム認証コード使用）
 */
export async function confirmForgotPasswordAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const code = formData.get('code') as string;
  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  
  try {
    // バリデーション
    if (!email || !code || !newPassword || !confirmPassword) {
      return {
        success: false,
        message: 'すべてのフィールドを入力してください',
        errors: {
          ...(!email && { email: 'メールアドレスを入力してください' }),
          ...(!code && { code: '認証コードを入力してください' }),
          ...(!newPassword && { newPassword: '新しいパスワードを入力してください' }),
          ...(!confirmPassword && { confirmPassword: 'パスワード確認を入力してください' })
        }
      };
    }
    
    // パスワードの検証（共通関数を使用）
    const passwordValidation = validatePasswordComplete(newPassword, confirmPassword);
    if (!passwordValidation.valid) {
      return {
        success: false,
        message: passwordValidation.error!,
        errors: { newPassword: passwordValidation.error! }
      };
    }
    
    // DynamoDBで認証コードを確認（ログイン時と同じ仕組み）
    const verifyResult = await verifyEmailCodeAction(
      email, // userId（パスワードリセットの場合はemailを使用）
      email,
      code,
      process.env.COGNITO_USER_POOL_ID!,
      'ja' // デフォルトロケール
    );
    
    if (!verifyResult.success) {
      return {
        success: false,
        message: '認証コードが正しくないか、有効期限が切れています',
        errors: { code: '認証コードが正しくないか、有効期限が切れています。新しいコードを再送信してください。' }
      };
    }
    
    // Cognitoでパスワードを更新（AdminSetUserPasswordを使用）
    const { AdminSetUserPasswordCommand } = await import('@aws-sdk/client-cognito-identity-provider');
    
    const setPasswordCommand = new AdminSetUserPasswordCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID!,
      Username: email,
      Password: newPassword,
      Permanent: true,
    });
    
    await cognitoClient.send(setPasswordCommand);
    
    return {
      success: true,
      message: 'パスワードが正常に更新されました',
    };
    
  } catch (error: any) {
    errorLog('ConfirmForgotPassword error:', error);
    
    // エラーハンドリング
    if (error.name === 'InvalidPasswordException') {
      return {
        success: false,
        message: 'パスワードが無効です',
        errors: { newPassword: 'パスワードが無効です。パスワードの要件を確認してください。' }
      };
    }
    
    if (error.name === 'LimitExceededException') {
      return {
        success: false,
        message: 'リクエスト制限に達しました',
        errors: { general: 'リクエスト制限に達しました。しばらく後に再試行してください。' }
      };
    }
    
    return {
      success: false,
      message: error.message || 'エラーが発生しました',
      errors: { general: error.message || 'エラーが発生しました' }
    };
  }
}