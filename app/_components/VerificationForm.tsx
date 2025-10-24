'use client';

import { useState, useActionState, useTransition } from 'react';
import { Button, Card, Input, Link } from '@heroui/react';
import { resendVerificationCodeAction } from '@/app/lib/actions/verification-actions';
import { confirmSignUpAction, confirmSignInAction } from '@/app/lib/auth/auth-actions';

interface VerificationFormProps {
  verificationId: string;
  email: string;
  locale?: string;
  password?: string; // 自動サインイン用のパスワード
  mode?: 'signup' | 'signin'; // サインアップかサインインか
  onVerificationSuccess: 
    | { type: 'reload' }
    | { type: 'redirect'; url: string }
    | { type: 'callback'; callback: () => void };
}


export default function VerificationForm({
  verificationId,
  email,
  locale = 'ja',
  password,
  mode = 'signup',
  onVerificationSuccess
}: VerificationFormProps) {
  
  // 認証成功時の処理を実行する関数
  const handleVerificationSuccess = () => {
    if (onVerificationSuccess.type === 'reload') {
      window.location.reload();
    } else if (onVerificationSuccess.type === 'redirect') {
      window.location.href = onVerificationSuccess.url;
    } else if (onVerificationSuccess.type === 'callback') {
      onVerificationSuccess.callback();
    }
  };
  const [code, setCode] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [currentVerificationId, setCurrentVerificationId] = useState(verificationId);
  const [isPending, startTransition] = useTransition();
  const [attemptCount, setAttemptCount] = useState(0); // 試行回数を追跡

  // モードに応じて適切なアクションを選択
  const confirmAction = mode === 'signin' ? confirmSignInAction : confirmSignUpAction;

  const [state, formAction] = useActionState(confirmAction, {
    success: false,
    message: '',
    errors: { general: '' },
    redirectUrl: undefined
  });

  // フォーム送信をラップして試行回数をカウント
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!state.success) {
      setAttemptCount(prev => prev + 1);
    }
  };

  // 認証成功時の処理
  if (state.success && !isPending) {
    handleVerificationSuccess();
  }

  // 認証コード再送信
  const handleResendCode = () => {
    startTransition(async () => {
      setIsResending(true);
      setResendMessage('');

      try {
        const result = await resendVerificationCodeAction(currentVerificationId, locale);
        
        if (result.success && result.newVerificationId) {
          setCurrentVerificationId(result.newVerificationId);
          setResendMessage('新しい認証コードを送信しました');
          setCode(''); // 入力をクリア
          setAttemptCount(0); // 試行回数をリセット
        } else {
          setResendMessage(result.message);
        }
      } catch (error) {
        setResendMessage('認証コードの再送信に失敗しました');
      } finally {
        setIsResending(false);
      }
    });
  };

  // エラーが発生した場合の処理
  if (state.message && !state.success) {
    return (
      <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl shadow-blue-100/50 p-8">
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              認証コードをリセット
            </h2>
            <p className="text-gray-600">
              試行回数が上限に達しました。新しい認証コードを要求してください。
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onPress={() => handleResendCode()}
              isLoading={isResending}
              color="primary"
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              {isResending ? '送信中...' : '新しい認証コードを送信'}
            </Button>
            
            <Link
              href="/ja/signup/auth"
              className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 font-medium text-center block"
            >
              戻る
            </Link>
          </div>

          {resendMessage && (
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-blue-700 text-sm font-normal leading-relaxed">{resendMessage}</p>
            </div>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl shadow-blue-100/50 p-8">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          認証コードを入力
        </h2>
        <p className="text-gray-600 mb-3">
          <span className="font-medium">{email}</span> に送信された6桁の認証コードを入力してください
        </p>
        
        {/* 進捗バー */}
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
          <div 
            className={`h-1.5 rounded-full transition-all duration-300 ${
              attemptCount === 0 ? 'bg-blue-500 w-0' :
              attemptCount <= 2 ? 'bg-green-500' :
              attemptCount <= 4 ? 'bg-amber-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min((attemptCount / 5) * 100, 100)}%` }}
          ></div>
        </div>
      </div>

      <form action={formAction} onSubmit={handleFormSubmit} className="space-y-6">
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="password" value={password || ''} />
        <input type="hidden" name="autoSignIn" value={password ? 'true' : 'false'} />
        <input type="hidden" name="locale" value={locale} />
        
        <div className="space-y-3">
          {/* 認証コードラベルと試行回数表示 */}
          <div className="flex items-center justify-between">
            <label htmlFor="confirmationCode" className="block text-sm font-medium text-gray-700">
              認証コード
              <span className="text-red-500 ml-1">*</span>
            </label>
            {attemptCount > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  試行回数: {attemptCount}/5
                </span>
                {attemptCount >= 3 && (
                  <div className="flex items-center gap-1">
                    <svg className="w-3 h-3 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="text-xs text-amber-600 font-medium">注意</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <Input
            id="confirmationCode"
            type="text"
            name="confirmationCode"
            value={code}
            onValueChange={setCode}
            placeholder="123456"
            maxLength={6}
            isDisabled={isPending}
            isRequired
            variant="bordered"
            autoComplete="one-time-code"
            isInvalid={!!state.message && !state.success}
            errorMessage={state.message && !state.success ? state.message : ''}
            classNames={{
              input: "text-gray-900 placeholder:text-gray-400 text-center text-2xl font-mono tracking-widest",
              inputWrapper: "bg-white border-gray-300 hover:border-gray-400 focus-within:border-blue-500 transition-colors h-14",
              errorMessage: "text-red-600 text-sm font-medium"
            }}
            startContent={
              <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
            }
          />
        </div>

        {state.message && !state.success && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-red-700 text-sm font-normal leading-relaxed">{state.message}</p>
              {attemptCount > 0 && attemptCount < 5 && (
                <p className="text-red-600 text-xs mt-1">
                  残り試行回数: {5 - attemptCount}回
                </p>
              )}
            </div>
          </div>
        )}

        {resendMessage && (
          <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
            <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-green-700 text-sm font-normal leading-relaxed">{resendMessage}</p>
          </div>
        )}

        <Button
          type="submit"
          isDisabled={isPending || code.length !== 6}
          isLoading={isPending}
          color="primary"
          size="lg"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {isPending ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              認証中...
            </div>
          ) : (
            '認証コードを確認'
          )}
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">または</span>
          </div>
        </div>

        <div className="text-center space-y-4">
          <p className="text-sm text-gray-600">
            認証コードが届かない場合
          </p>
          <Button
            type="button"
            onPress={handleResendCode}
            isLoading={isResending}
            variant="bordered"
            size="md"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
          >
            {isResending ? '送信中...' : '認証コードを再送信'}
          </Button>
        </div>

        <div className="text-center pt-4">
          <Link
            href="/ja/signup/auth"
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200 text-sm font-medium py-2 px-4 rounded-lg hover:bg-gray-50 inline-block"
          >
            ← 戻る
          </Link>
        </div>
      </form>
    </Card>
  );
}
