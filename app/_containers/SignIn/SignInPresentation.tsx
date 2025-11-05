'use client'

import { useState, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input, Link } from "@heroui/react";
import VerificationForm from '@/app/_components/VerificationForm';
import { signInAction, type SignInActionState } from '@/app/lib/auth/auth-actions';
import type { SignInLocale } from '@/app/dictionaries/signIn/signIn.d.ts';

interface SignInPresentationProps {
  dictionary: SignInLocale;
  locale: string;
}

// メインのプレゼンテーションコンポーネント
export default function SignInPresentation({ dictionary, locale }: SignInPresentationProps) {
  const router = useRouter();
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [userPassword, setUserPassword] = useState(""); // 2FA用のパスワード保存
  const [state, formAction, isPending] = useActionState(signInAction, {
    success: false,
    message: '',
    errors: {}
  } as SignInActionState);

  // サインイン成功時: 2FAが有効な場合は検証フォームへ、redirectToがある場合は遷移
  useEffect(() => {
    console.log('SignIn useEffect:', {
      success: state.success,
      hasVerificationId: !!state.verificationId,
      hasEmail: !!state.email,
      showVerification,
      userPassword: !!userPassword
    });
    
    if (state.success) {
      if (state.verificationId && state.email && !showVerification) {
        // 2段階認証フローに切り替え（この画面内でVerificationFormを表示）
        console.log('2FA画面表示開始');
        setShowVerification(true);
      } else if (state.redirectTo) {
        router.push(state.redirectTo);
      }
    }
  }, [state.success, state.verificationId, state.email, state.redirectTo, showVerification, router]);

  // フォーム送信時のクライアントバリデーション（未入力エラー表示）
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    const formData = new FormData(form);
    const emailVal = (formData.get('email') as string) || '';
    const passwordVal = (formData.get('password') as string) || '';

    let blocked = false;
    if (!emailVal) {
      setEmailError(dictionary.alert.emailRequired);
      blocked = true;
    }
    if (!passwordVal) {
      setPasswordError(dictionary.alert.passwordRequired);
      blocked = true;
    }
    if (blocked) {
      event.preventDefault();
      return;
    }
    
    // フォーム送信時にパスワードを保存（2FA用）
    setUserPassword(passwordVal);
    console.log('Form submit - password saved:', !!passwordVal, passwordVal.substring(0, 3) + '***');
  };

  // フォームの有効性をチェック
  const isFormValid = () => {
    return email && password && !emailError && !passwordError;
  };


  // メールアドレスバリデーション関数
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "";
    }
    if (!emailRegex.test(email)) {
      return dictionary.alert.emailFormatInvalid;
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
      return dictionary.alert.passwordFormatInvalid;
    }
    
    // 少なくとも1つの小文字を含む
    if (!/[a-z]/.test(password)) {
      return dictionary.alert.passwordFormatInvalid;
    }
    
    // 少なくとも1つの大文字を含む
    if (!/[A-Z]/.test(password)) {
      return dictionary.alert.passwordFormatInvalid;
    }
    
    // 少なくとも1つの数字を含む
    if (!/\d/.test(password)) {
      return dictionary.alert.passwordFormatInvalid;
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
  };


  // 2段階認証フォーム表示
  if (showVerification && state.email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              {dictionary.label.twoFactorAuthTitle}
            </h1>
            <p className="mt-3 text-gray-600">
              {state.email} {dictionary.label.twoFactorAuthDescription}
            </p>
          </div>

          <VerificationForm
            verificationId={state.verificationId!}
            email={state.email}
            locale={locale}
            password={userPassword}
            mode="signin"
            onVerificationSuccess={{ type: 'redirect', url: `/${locale}/account/user` }}
          />

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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {dictionary.label.signInTitle}
          </h1>
          <p className="mt-3 text-gray-600">
            {dictionary.label.signInSubtitle}
          </p>
        </div>

        {/* メインカード */}
        <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl shadow-blue-100/50 p-8">
          <form action={formAction} onSubmit={handleFormSubmit} className="space-y-6">
            <input type="hidden" name="locale" value={locale} />
            
            {/* メールアドレス入力（ラベルを外部に） */}
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
            
            {/* パスワード入力（ラベルを外部に） */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {dictionary.label.passwordLabel}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder={dictionary.label.passwordPlaceholder}
                onValueChange={handlePasswordChange}
                isDisabled={isPending}
                isRequired
                variant="bordered"
                autoComplete="current-password"
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
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="text-gray-500 hover:text-gray-700"
                    aria-label={showPassword ? dictionary.label.hidePassword : dictionary.label.showPassword}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4-10-7 0-1.097.42-2.12 1.156-3.03M6.18 6.18A10.057 10.057 0 0112 5c5.523 0 10 4 10 7 0 1.21-.46 2.344-1.254 3.32M3 3l18 18M9.88 9.88A3 3 0 0112 9c1.657 0 3 1.343 3 3 0 .43-.086.84-.242 1.21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7zm9.542 3a3 3 0 100-6 3 3 0 000 6z" />
                      </svg>
                    )}
                  </button>
                }
              />
            </div>
            
            {/* エラーメッセージ */}
            {state.message && !state.success && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 text-sm font-normal leading-relaxed">
                  {/* エラーコードを辞書から取得して表示 */}
                  {state.message === 'notAuthorized' ? dictionary.alert.authErrors.notAuthorized :
                   state.message === 'userNotConfirmed' ? dictionary.alert.authErrors.userNotConfirmed :
                   state.message === 'userNotFound' ? dictionary.alert.authErrors.userNotFound :
                   state.message === 'passwordResetRequired' ? dictionary.alert.authErrors.passwordResetRequired :
                   state.message === 'invalidParameter' ? dictionary.alert.authErrors.invalidParameter :
                   state.message === 'tooManyRequests' ? dictionary.alert.authErrors.tooManyRequests :
                   state.message === 'signInFailed' ? dictionary.alert.signInFailed :
                   state.message}
                </p>
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
            
            {/* サインインボタン */}
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
                  {dictionary.label.signingIn}
                </div>
              ) : (
                dictionary.label.signIn
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
            
            {/* サインアップリンク */}
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                {dictionary.label.noAccount}
              </p>
              <Link
                href={`/${locale}/signup/auth`}
                className="inline-flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
              >
                {dictionary.label.signUp}
              </Link>
            </div>
            
            {/* パスワードを忘れた場合のリンク */}
            <div className="text-center pt-4">
              <Link 
                href={`/${locale}/forgot-password`}
                className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
              >
                {dictionary.label.forgotPassword}
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