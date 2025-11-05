'use client'

import { useState, useActionState, useEffect, startTransition } from "react"
import { Button, Card, Input } from "@heroui/react"
import { forgotPasswordAction, confirmForgotPasswordAction } from "@/app/lib/auth/auth-actions"
import type { ForgotPasswordLocale } from '@/app/dictionaries/forgotPassword/forgotPassword.d.ts';
import { FaArrowLeft, FaEnvelope, FaLock, FaKey } from "react-icons/fa6"
import Link from "next/link"
import { useRouter } from 'next/navigation'

interface ForgotPasswordPresentationProps {
  locale: string;
  dictionary: ForgotPasswordLocale;
}

export default function ForgotPasswordPresentation({ 
  locale, 
  dictionary 
}: ForgotPasswordPresentationProps) {
  const router = useRouter();
  
  // ステップ管理: 'email' | 'code'
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // クライアントサイドエラー
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  
  // ステップ1: メールアドレス送信
  const [emailState, emailFormAction, isEmailPending] = useActionState(
    forgotPasswordAction,
    { success: false, message: '', errors: {} as any }
  );
  
  // ステップ2: 認証コード確認とパスワード更新
  const [confirmState, confirmFormAction, isConfirmPending] = useActionState(
    confirmForgotPasswordAction,
    { success: false, message: '', errors: {} as any }
  );
  
  // メール送信成功時の処理
  useEffect(() => {
    if (emailState.success) {
      setStep('code');
    }
  }, [emailState.success]);
  
  // パスワード更新成功時の処理
  useEffect(() => {
    if (confirmState.success) {
      // 2秒後にサインインページにリダイレクト
      setTimeout(() => {
        router.push(`/${locale}/signin`);
      }, 2000);
    }
  }, [confirmState.success, locale, router]);
  
  // メールアドレスバリデーション
  const validateEmail = (value: string): string => {
    if (!value.trim()) {
      return dictionary.alert.emailRequired;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return dictionary.alert.invalidEmailFormat;
    }
    return '';
  };
  
  // パスワードバリデーション
  const validatePassword = (value: string): string => {
    if (!value) {
      return dictionary.alert.newPasswordRequired;
    }
    if (value.length < 8) {
      return dictionary.alert.invalidPasswordFormat;
    }
    if (!/[a-z]/.test(value)) {
      return dictionary.alert.invalidPasswordFormat;
    }
    if (!/[A-Z]/.test(value)) {
      return dictionary.alert.invalidPasswordFormat;
    }
    if (!/\d/.test(value)) {
      return dictionary.alert.invalidPasswordFormat;
    }
    return '';
  };
  
  // メールアドレス送信
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailError = validateEmail(email);
    if (emailError) {
      setClientErrors({ email: emailError });
      return;
    }
    
    setClientErrors({});
    const formData = new FormData();
    formData.set('email', email);
    formData.set('locale', locale);
    startTransition(() => {
      emailFormAction(formData as any);
    });
  };
  
  // 認証コード確認とパスワード更新
  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors: Record<string, string> = {};
    
    if (!code.trim()) {
      errors.code = dictionary.alert.codeRequired;
    }
    
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      errors.newPassword = passwordError;
    }
    
    if (!confirmPassword) {
      errors.confirmPassword = dictionary.alert.confirmPasswordRequired;
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = dictionary.alert.passwordMismatch;
    }
    
    if (Object.keys(errors).length > 0) {
      setClientErrors(errors);
      return;
    }
    
    setClientErrors({});
    const formData = new FormData();
    formData.set('email', email);
    formData.set('code', code);
    formData.set('newPassword', newPassword);
    formData.set('confirmPassword', confirmPassword);
    startTransition(() => {
      confirmFormAction(formData as any);
    });
  };
  
  // 戻るボタン
  const handleBack = () => {
    setStep('email');
    setCode("");
    setNewPassword("");
    setConfirmPassword("");
    setClientErrors({});
  };
  
  // 再送信
  const handleResend = () => {
    const formData = new FormData();
    formData.set('email', email);
    formData.set('locale', locale);
    startTransition(() => {
      emailFormAction(formData as any);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* ロゴ・ブランドエリア */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <FaLock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {dictionary.label.forgotPasswordTitle}
          </h1>
          <p className="text-gray-600">
            {step === 'email' ? dictionary.label.emailDescription : dictionary.label.codeDescription}
          </p>
        </div>

        <Card className="p-8 shadow-xl">
          {step === 'email' ? (
            // ステップ1: メールアドレス入力
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {dictionary.label.emailLabel}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onValueChange={(val) => {
                    setEmail(val);
                    if (clientErrors.email) {
                      setClientErrors({ ...clientErrors, email: '' });
                    }
                  }}
                  placeholder={dictionary.label.emailPlaceholder}
                  variant="bordered"
                  isDisabled={isEmailPending}
                  isInvalid={!!(clientErrors.email || emailState.errors?.email)}
                  errorMessage={clientErrors.email || emailState.errors?.email}
                  startContent={<FaEnvelope className="text-gray-400" />}
                  autoComplete="email"
                />
              </div>

              {/* エラーメッセージ */}
              {emailState.message && !emailState.success && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{emailState.message}</p>
                </div>
              )}

              <Button
                type="submit"
                color="primary"
                className="w-full"
                size="lg"
                isLoading={isEmailPending}
                isDisabled={isEmailPending}
              >
                {dictionary.label.sendCode}
              </Button>

              <div className="text-center">
                <Link 
                  href={`/${locale}/signin`}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center gap-2"
                >
                  <FaArrowLeft size={12} />
                  {dictionary.label.back}
                </Link>
              </div>
            </form>
          ) : (
            // ステップ2: 認証コードとパスワード入力
            <form onSubmit={handleConfirmSubmit} className="space-y-6">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                  {dictionary.label.codeLabel}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <Input
                  id="code"
                  type="text"
                  value={code}
                  onValueChange={(val) => {
                    setCode(val);
                    if (clientErrors.code) {
                      setClientErrors({ ...clientErrors, code: '' });
                    }
                  }}
                  placeholder={dictionary.label.codePlaceholder}
                  variant="bordered"
                  isDisabled={isConfirmPending}
                  isInvalid={!!(clientErrors.code || (confirmState.errors as any)?.code)}
                  errorMessage={clientErrors.code || (confirmState.errors as any)?.code}
                  startContent={<FaKey className="text-gray-400" />}
                  maxLength={6}
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  {dictionary.label.newPasswordLabel}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onValueChange={(val) => {
                    setNewPassword(val);
                    if (clientErrors.newPassword) {
                      setClientErrors({ ...clientErrors, newPassword: '' });
                    }
                  }}
                  placeholder={dictionary.label.newPasswordPlaceholder}
                  variant="bordered"
                  isDisabled={isConfirmPending}
                  isInvalid={!!(clientErrors.newPassword || (confirmState.errors as any)?.newPassword)}
                  errorMessage={clientErrors.newPassword || (confirmState.errors as any)?.newPassword}
                  startContent={<FaLock className="text-gray-400" />}
                  description={dictionary.label.passwordDescription}
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  {dictionary.label.confirmPasswordLabel}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onValueChange={(val) => {
                    setConfirmPassword(val);
                    if (clientErrors.confirmPassword) {
                      setClientErrors({ ...clientErrors, confirmPassword: '' });
                    }
                  }}
                  placeholder={dictionary.label.confirmPasswordPlaceholder}
                  variant="bordered"
                  isDisabled={isConfirmPending}
                  isInvalid={!!(clientErrors.confirmPassword || (confirmState.errors as any)?.confirmPassword)}
                  errorMessage={clientErrors.confirmPassword || (confirmState.errors as any)?.confirmPassword}
                  startContent={<FaLock className="text-gray-400" />}
                  autoComplete="new-password"
                />
              </div>

              {/* エラーメッセージ */}
              {confirmState.message && !confirmState.success && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{confirmState.message}</p>
                </div>
              )}

              {/* 成功メッセージ */}
              {confirmState.success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm">{dictionary.alert.passwordUpdated}</p>
                  <p className="text-green-600 text-xs mt-1">{dictionary.label.redirectingMessage}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="bordered"
                  className="flex-1"
                  onPress={handleBack}
                  isDisabled={isConfirmPending}
                  startContent={<FaArrowLeft size={14} />}
                >
                  {dictionary.label.backToEmail}
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  className="flex-1"
                  isLoading={isConfirmPending}
                  isDisabled={isConfirmPending || confirmState.success}
                >
                  {dictionary.label.updatePassword}
                </Button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-sm text-blue-600 hover:text-blue-800"
                  disabled={isEmailPending}
                >
                  {dictionary.label.resendCode}
                </button>
              </div>
            </form>
          )}
        </Card>

        {/* フッター */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <Link href={`/${locale}/signin`} className="text-blue-600 hover:text-blue-800">
            {dictionary.label.back}
          </Link>
        </div>
      </div>
    </div>
  );
}
