'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { clearInvalidTokensAction } from '@/app/lib/auth/auth-actions';

interface AuthErrorHandlerProps {
  hasAuthError: boolean;
  locale: string;
}

export default function AuthErrorHandler({ hasAuthError, locale }: AuthErrorHandlerProps) {
  const router = useRouter();

  useEffect(() => {
    if (hasAuthError) {
      // 無効なトークンを削除してサインインページにリダイレクト
      clearInvalidTokensAction()
        .then(() => {
          router.push(`/${locale}/signin`);
        })
        .catch((error) => {
          // エラーが発生した場合はコンソールにログを出力
          console.error('Failed to clear invalid tokens:', error);
        });
    }
  }, [hasAuthError, locale, router]);

  return null;
}
