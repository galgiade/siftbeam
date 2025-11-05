'use client'

import { useState, useActionState, useEffect, useTransition } from "react";
import { Button, Card, Input, Link, Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { signUpAction } from '@/app/lib/auth/auth-actions';
import VerificationForm from '@/app/_components/VerificationForm';
// メインのプレゼンテーションコンポーネント
export default function SignUpPresentation({ locale, dictionary }: { locale: string, dictionary: any }) {
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [verificationId, setVerificationId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState(""); // 自動サインイン用のパスワード
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Next.js 15のuseActionStateを正しく使用
  const [state, formAction, isPending] = useActionState(signUpAction, {
    success: false,
    message: '',
    errors: { general: '' },
    verificationId: undefined,
    email: undefined
  });

  // メールアドレスバリデーション関数
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "";
    }
    if (!emailRegex.test(email)) {
      return dictionary.alert.invalidEmailFormat;
    }
    return "";
  };

  // パスワードバリデーション関数
  // 要件: 最小8文字、少なくとも1つの数字、1つの大文字、1つの小文字を含む
  const validatePassword = (password: string) => {
    if (!password) {
      return "";
    }
    
    // 最小8文字チェック
    if (password.length < 8) {
      return dictionary.alert.invalidPasswordFormat;
    }
    
    // 少なくとも1つの小文字を含む
    if (!/[a-z]/.test(password)) {
      return dictionary.alert.invalidPasswordFormat;
    }
    
    // 少なくとも1つの大文字を含む
    if (!/[A-Z]/.test(password)) {
      return dictionary.alert.invalidPasswordFormat;
    }
    
    // 少なくとも1つの数字を含む
    if (!/\d/.test(password)) {
      return dictionary.alert.invalidPasswordFormat;
    }
    
    return "";
  };

  // メールアドレス変更時のハンドラー
  const handleEmailChange = (value: string) => {
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  // パスワード変更時のハンドラー
  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordError(validatePassword(value));
    
    // パスワード確認の再チェック
    if (confirmPassword) {
      setConfirmPasswordError(confirmPassword !== value ? dictionary.alert.passwordMismatch : '');
    }
  };

  // パスワード確認変更時のハンドラー
  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setConfirmPasswordError(password !== value ? dictionary.alert.passwordMismatch : '');
  };

  // フォーム送信前のバリデーション（クライアントサイド）
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const emailValue = formData.get('email') as string;
    const passwordValue = formData.get('password') as string;
    const confirmPasswordValue = formData.get('confirmPassword') as string;

    console.log('フォーム送信試行:', { email: !!emailValue, password: !!passwordValue, confirmPassword: !!confirmPasswordValue });

    // 基本的なバリデーション
    if (!emailValue || !passwordValue || !confirmPasswordValue) {
      event.preventDefault();
      console.log('必須フィールドが未入力のため送信を中止');
      return;
    }

    // メールアドレスの形式チェック
    const emailValidationError = validateEmail(emailValue);
    if (emailValidationError) {
      event.preventDefault();
      setEmailError(emailValidationError);
      console.log('メールアドレス形式エラーのため送信を中止');
      return;
    }

    // パスワードの形式チェック
    const passwordValidationError = validatePassword(passwordValue);
    if (passwordValidationError) {
      event.preventDefault();
      setPasswordError(passwordValidationError);
      console.log('パスワード形式エラーのため送信を中止');
      return;
    }

    // パスワード確認チェック
    if (passwordValue !== confirmPasswordValue) {
      event.preventDefault();
      setConfirmPasswordError(dictionary.alert.passwordMismatch);
      console.log('パスワード不一致のため送信を中止');
      return;
    }

    console.log('バリデーション通過 - フォーム送信を実行');
    
    // 自動サインイン用にパスワードを保存
    setUserPassword(passwordValue);
  };

  // フォームの有効性をチェック
  const isFormValid = () => {
    return email && 
           password && 
           confirmPassword && 
           !emailError && 
           !passwordError && 
           !confirmPasswordError &&
           password === confirmPassword;
  };

  // コンポーネント初期化時のログ
  useEffect(() => {
    console.log('SignUpPresentation初期化:', {
      locale,
      timestamp: new Date().toISOString(),
      hasFormAction: !!formAction,
      initialState: state
    });
  }, []);

  // サインアップ成功時の処理
  useEffect(() => {
    console.log('useActionState状態変更:', {
      success: state.success,
      hasVerificationId: !!state.verificationId,
      showVerification,
      message: state.message,
      errors: state.errors
    });

    // 成功時のみ認証フォームを表示
    if (state.success && state.verificationId && !showVerification) {
      console.log('認証フォーム表示開始');
      setShowVerification(true);
      setVerificationId(state.verificationId);
      // stateからメールアドレスを取得
      if (state.email) {
        setUserEmail(state.email);
      }
    }
  }, [state.success, state.verificationId, state.email, showVerification]);

  // 認証成功時の処理（不要になったが削除）

  // 認証フォームを表示
  if (showVerification && verificationId && userEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* ロゴ・ブランドエリア */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              {dictionary.label.signUpTitle}
            </h1>
            <p className="mt-3 text-gray-600">
              {dictionary.label.welcomeMessage}
            </p>
          </div>

          {/* 進行状況 */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  ✓
                </div>
                <span className="ml-2 text-sm font-medium text-green-600">{dictionary.label.accountCreation}</span>
              </div>
              <div className="w-8 h-px bg-blue-600"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <span className="ml-2 text-sm font-medium text-blue-600">{dictionary.label.verificationTitle}</span>
              </div>
              <div className="w-8 h-px bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <span className="ml-2 text-sm text-gray-500">{dictionary.label.completed}</span>
              </div>
            </div>
          </div>

          <VerificationForm
            verificationId={verificationId}
            email={userEmail}
            locale={locale}
            password={userPassword}
            mode="signup"
            onVerificationSuccess={{ type: 'redirect', url: `/${locale}/signin` }}
          />

          {/* フッター */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              {dictionary.label.copyright}
            </p>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* ロゴ・ブランドエリア */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {dictionary.label.signUpTitle}
          </h1>
          <p className="mt-3 text-gray-600">
            {dictionary.label.welcomeMessage}
          </p>
        </div>

        {/* 進行状況 */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">{dictionary.label.accountCreation}</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <span className="ml-2 text-sm text-gray-500">{dictionary.label.companyInfo}</span>
            </div>
            <div className="flex items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <span className="ml-2 text-sm text-gray-500">{dictionary.label.adminSetup}</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
                4
              </div>
              <span className="ml-2 text-sm text-gray-500">{dictionary.label.paymentSetup}</span>
            </div>
              
            </div>
          </div>
      </div>

        {/* メインカード */}
        <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl shadow-blue-100/50 p-8">
          <form action={formAction} onSubmit={handleFormSubmit} className="space-y-6">
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="autoSignIn" value="true" />
            <input type="hidden" name="redirectUrl" value={`/${locale}/signup/company`} />
            
            {/* メールアドレス入力 */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {dictionary.label.emailLabel}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder={dictionary.label.emailPlaceholder}
                onValueChange={handleEmailChange}
                isDisabled={isPending}
                isRequired
                variant="bordered"
                autoComplete="email"
                isInvalid={!!emailError || !!state.errors?.email}
                errorMessage={emailError || state.errors?.email}
                classNames={{
                  input: "text-gray-900 placeholder:text-gray-400",
                  inputWrapper: "bg-white border-gray-300 hover:border-gray-400 focus-within:border-blue-500 transition-colors",
                  errorMessage: "text-red-600 text-sm font-medium"
                }}
                startContent={
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                }
              />
            </div>
            
            {/* パスワード入力 */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {dictionary.label.passwordLabel}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder={dictionary.label.passwordPlaceholder}
                onValueChange={handlePasswordChange}
                isDisabled={isPending}
                isRequired
                variant="bordered"
                autoComplete="new-password"
                isInvalid={!!passwordError || !!state.errors?.password}
                errorMessage={passwordError || state.errors?.password}
                description={dictionary.label.passwordDescription}
                classNames={{
                  input: "text-gray-900 placeholder:text-gray-400",
                  inputWrapper: "bg-white border-gray-300 hover:border-gray-400 focus-within:border-blue-500 transition-colors",
                  description: "text-xs text-gray-500 font-normal mt-1",
                  errorMessage: "text-red-600 text-sm font-medium"
                }}
                startContent={
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
              />
            </div>

            {/* パスワード確認入力 */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                {dictionary.label.confirmPasswordLabel}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder={dictionary.label.confirmPasswordPlaceholder}
                value={confirmPassword}
                onValueChange={handleConfirmPasswordChange}
                isDisabled={isPending}
                isRequired
                variant="bordered"
                autoComplete="new-password"
                isInvalid={!!confirmPasswordError}
                errorMessage={confirmPasswordError}
                classNames={{
                  input: "text-gray-900 placeholder:text-gray-400",
                  inputWrapper: "bg-white border-gray-300 hover:border-gray-400 focus-within:border-blue-500 transition-colors",
                  errorMessage: "text-red-600 text-sm font-medium"
                }}
                startContent={
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
              />
            </div>
            
            {/* エラーメッセージ */}
            {state.message && !state.success && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 text-sm font-normal leading-relaxed">{state.message}</p>
              </div>
            )}
            
            {/* 成功メッセージ */}
            {state.success && (
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                <p className="text-green-700 text-sm font-normal leading-relaxed">{state.message}</p>
                  </div>
            )}
            
            {/* サインアップボタン */}
            <Button
              type="submit"
              isDisabled={isPending || !isFormValid()}
              isLoading={isPending}
              color={isFormValid() ? "primary" : "default"}
              size="lg"
              className={`w-full font-semibold py-3 shadow-lg transition-all duration-200 ${
                isFormValid() 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {dictionary.label.registering}
                </div>
              ) : (
                dictionary.label.register
              )}
            </Button>
            
            {/* 区切り線 */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">{dictionary.label.orDivider}</span>
              </div>
            </div>
            
            {/* サインインリンク */}
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                {dictionary.label.alreadyHaveAccount}
              </p>
              <Link
                href={`/${locale}/signin`}
                className="inline-flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
              >
                {dictionary.label.signIn}
              </Link>
            </div>
          </form>
        </Card>

        {/* フッター */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            {dictionary.label.copyright}
          </p>
        </div>
      </div>
    </div>

  );
}