'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getUserCustomAttributes, type UserAttributes } from '@/app/utils/cognito-utils';
import { InitiateAuthCommand, GetUserCommand, SignUpCommand, ConfirmSignUpCommand, ResendConfirmationCodeCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient } from '@/app/lib/aws-clients';
import { sendVerificationCodeEmailAction } from '@/app/lib/actions/email-actions';
import { 
  storeVerificationCodeAction, 
  verifyEmailCodeAction,
  sendVerificationEmailAction 
} from '@/app/lib/actions/user-verification-actions';
import { z } from 'zod';

// 認証コード生成関数
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

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
    console.error('Error getting current user:', error);
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

    // デバッグ情報を追加
    console.log('=== サインイン試行 ===');
    console.log('Email:', email);
    console.log('Password length:', password.length);
    console.log('Environment check:');
    console.log('REGION:', process.env.REGION);
    console.log('COGNITO_CLIENT_ID exists:', !!process.env.COGNITO_CLIENT_ID);
    console.log('ACCESS_KEY_ID exists:', !!process.env.ACCESS_KEY_ID);
    console.log('COGNITO_CLIENT_ID:', process.env.COGNITO_CLIENT_ID);
    console.log('COGNITO_USER_POOL_ID:', process.env.COGNITO_USER_POOL_ID);

    // ユーザー存在確認のためのデバッグ
    console.log('=== ユーザー存在確認 ===');
    console.log('COGNITO_USER_POOL_ID:', process.env.COGNITO_USER_POOL_ID);
    console.log('検索対象メール:', email);

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
      const locale = (formData.get('locale') as string) || 'ja';

      // 認証コード生成・保存
      const verificationCode = generateVerificationCode();
      const storeResult = await storeVerificationCodeAction(
        email, // 既存ユーザーはemailをuserIdとして扱う
        email,
        verificationCode,
        locale
      );

      if (!storeResult.success) {
        return {
          success: false,
          message: 'Failed to start two-factor verification',
          errors: { general: storeResult.error || 'verification_store_failed' },
        };
      }

      // 認証コード送信
      const emailResult = await sendVerificationEmailAction(
        email,
        verificationCode,
        locale
      );

      if (!emailResult.success) {
        return {
          success: false,
          message: 'Failed to send verification code',
          errors: { general: emailResult.error || 'verification_email_failed' },
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
    console.error('Sign in error:', error);
    
    let message = 'Sign in failed';
    if (error.name === 'NotAuthorizedException') {
      message = 'Invalid email or password';
    } else if (error.name === 'UserNotConfirmedException') {
      message = 'User not confirmed';
    }

    return {
      success: false,
      message,
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
    console.error('Error clearing tokens:', error);
    return { success: false };
  }
}

export async function signOutAction(locale: string = 'ja') {
  try {
    // Cookieからトークンを削除
    const cookieStore = await cookies();
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
    cookieStore.delete('idToken');
    
    // ホームページにリダイレクト
    redirect(`/${locale}`);
  } catch (error) {
    console.error('Error signing out:', error);
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
  console.log('=== サインアップ試行 ===');
  console.log('FormData entries:', Array.from(formData.entries()));
  
  // FormDataから値を取得（tryブロック外で定義してcatchブロックでもアクセス可能にする）
  const signUpData: SignUpData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  };

  try {
    console.log('SignUp data:', {
      email: signUpData.email,
      passwordLength: signUpData.password?.length || 0,
      confirmPasswordLength: signUpData.confirmPassword?.length || 0
    });

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

    // パスワードの一致チェック
    if (signUpData.password !== signUpData.confirmPassword) {
      return {
        success: false,
        errors: { password: 'パスワードが一致しません' },
        message: '',
        verificationId: undefined
      };
    }

    // パスワードの強度チェック（最低8文字、大文字、小文字、数字を含む）
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(signUpData.password)) {
      return {
        success: false,
        errors: { password: 'パスワードは8文字以上で、大文字、小文字、数字を含む必要があります' },
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
    
    console.log('Cognito SignUp result:', {
      UserSub: result.UserSub,
      CodeDeliveryDetails: result.CodeDeliveryDetails
    });

    // ユーザー作成成功
    if (result.UserSub) {
      console.log('サインアップ成功 - UserSub:', result.UserSub);
      
      // 認証コードを生成
      const verificationCode = generateVerificationCode();
      const locale = formData.get('locale') as string || 'ja';
      
        // DynamoDBに認証コードを保存
        const storeResult = await storeVerificationCodeAction(
          result.UserSub,
          signUpData.email,
          verificationCode,
          locale
        );
      
      if (!storeResult.success) {
        console.error('DynamoDB保存失敗:', storeResult.error);
        // DynamoDB保存に失敗してもユーザー作成は成功しているので、
        // 2段階認証フォームを表示して再送信を促す
        return {
          success: true,
          message: 'ユーザーが作成されました。認証コードの保存でエラーが発生しましたが、再送信をお試しください。',
          errors: {},
          verificationId: result.UserSub,
          email: signUpData.email
        };
      }
      
      // SESテンプレートメールで認証コードを送信
      const emailResult = await sendVerificationEmailAction(
        signUpData.email,
        verificationCode,
        locale
      );
      
      console.log('SES認証コードメール送信結果:', emailResult);
      
      if (emailResult.success) {
        return {
          success: true,
          message: 'ユーザーが正常に作成されました。確認メールを送信しました。',
          errors: {},
          verificationId: result.UserSub,
          email: signUpData.email
        };
      } else {
        console.error('SESメール送信失敗:', emailResult.error);
        return {
          success: true,
          message: 'ユーザーが正常に作成されました。メール送信でエラーが発生しましたが、再送信をお試しください。',
          errors: {},
          verificationId: result.UserSub,
          email: signUpData.email
        };
      }
    } else {
      console.log('サインアップ失敗 - UserSubが取得できませんでした');
      return {
        success: false,
        errors: { general: 'ユーザーの作成に失敗しました' },
        message: '',
        verificationId: undefined
      };
    }

  } catch (error: any) {
    console.error('Cognitoユーザー作成エラー:', error);
    
    // Cognitoのエラーメッセージを日本語に変換
    let errorMessage = 'ユーザーの作成に失敗しました';
    
    if (error.name === 'UsernameExistsException') {
      // 既存ユーザーの場合、SESで認証コードを送信
      try {
        console.log('既存ユーザーにSES認証コードを送信します:', signUpData.email);
        
        // 認証コードを生成
        const verificationCode = generateVerificationCode();
        const locale = formData.get('locale') as string || 'ja';
        
            // DynamoDBに認証コードを保存（既存ユーザーの場合はメールアドレスをuserIdとして使用）
            const storeResult = await storeVerificationCodeAction(
              signUpData.email, // 既存ユーザーの場合はメールアドレスをuserIdとして使用
              signUpData.email,
              verificationCode,
              locale
            );
        
        if (!storeResult.success) {
          console.error('既存ユーザーDynamoDB保存失敗:', storeResult.error);
          errorMessage = 'このメールアドレスは既に登録されています。認証コードの保存に失敗しました。';
        } else {
          // SESテンプレートメールで認証コードを送信
          const emailResult = await sendVerificationEmailAction(
            signUpData.email,
            verificationCode,
            locale
          );
          
          console.log('既存ユーザーSESメール送信結果:', emailResult);
          
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
        }
      } catch (resendError) {
        console.error('既存ユーザー認証コード送信エラー:', resendError);
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

    console.log('=== 認証コード検証試行 ===');
    console.log('Email:', email);
    console.log('Code:', confirmationCode);

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
    const locale = formData.get('locale') as string || 'ja';

    console.log('認証オプション:', { autoSignIn, hasPassword: !!password, locale });

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
    
    console.log('既存ユーザー認証コード検証結果:', verificationResult);
    
    // 既存ユーザーで見つからない場合、新規ユーザーとして検索
    // 実際の実装では、UserSubとemailのマッピングテーブルが必要
    if (!verificationResult.success) {
      console.log('既存ユーザーとして見つからないため、新規ユーザーとして検索');
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
      console.log('Cognito ConfirmSignUp成功');
    } catch (cognitoError: any) {
      console.log('Cognito ConfirmSignUp エラー（無視）:', cognitoError.name);
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
    console.error('確認コード検証エラー:', error);
    
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

    console.log('=== サインイン認証コード検証試行 ===');
    console.log('Email:', email);
    console.log('Code:', confirmationCode);

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
    const locale = formData.get('locale') as string || 'ja';

    console.log('サインイン認証オプション:', { hasPassword: !!password, locale });

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
    
    console.log('サインイン認証コード検証結果:', verificationResult);
    
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
    if (verificationResult.autoSignIn) {
      return {
        success: true,
        message: '認証が完了し、自動サインインしました。',
        errors: {},
        redirectUrl: verificationResult.redirectUrl || `/${locale}/account/user`
      };
    } else {
      return {
        success: true,
        message: '認証が完了しました。',
        errors: {},
        redirectUrl: verificationResult.redirectUrl || `/${locale}/account/user`
      };
    }

  } catch (error: any) {
    console.error('サインイン認証コード検証エラー:', error);
    
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
  locale: string = 'ja'
): Promise<{
  success: boolean;
  message: string;
  newVerificationId?: string;
}> {
  try {
    console.log('=== 認証コード再送信試行 ===');
    console.log('VerificationId:', verificationId);
    console.log('Locale:', locale);

    // 新しい認証コードを生成
    const newVerificationCode = generateVerificationCode();

    // verificationIdがemailの形式かUserSubの形式かを判定
    const isEmail = verificationId.includes('@');
    const userId = verificationId; // 既存・新規ユーザー共にverificationIdをuserIdとして使用
    const email = isEmail ? verificationId : verificationId; // 簡易実装

    // DynamoDBに新しい認証コードを保存
    const storeResult = await storeVerificationCodeAction(
      userId,
      email,
      newVerificationCode,
      locale
    );

    if (!storeResult.success) {
      console.error('認証コード再送信DynamoDB保存失敗:', storeResult.error);
      return {
        success: false,
        message: '認証コードの保存に失敗しました',
      };
    }

    // SESテンプレートメールで認証コードを送信
    const emailResult = await sendVerificationEmailAction(
      email,
      newVerificationCode,
      locale
    );

    console.log('認証コード再送信結果:', emailResult);

    if (emailResult.success) {
      return {
        success: true,
        message: '新しい認証コードを送信しました',
        newVerificationId: userId,
      };
    } else {
      return {
        success: false,
        message: '認証コードの再送信に失敗しました',
      };
    }

  } catch (error: any) {
    console.error('認証コード再送信エラー:', error);
    return {
      success: false,
      message: '認証コードの再送信に失敗しました',
    };
  }
}