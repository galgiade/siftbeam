'use client'

import type { UserManagementLocale } from '@/app/dictionaries/user-management/user-management.d.ts';
import { Button, Card } from '@heroui/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FaExclamationTriangle } from 'react-icons/fa';
import AccessDeniedError from '@/app/_components/common/error/AccessDeniedError';

/**
 * ユーザー情報取得エラー表示コンポーネント
 */
export default function UserErrorDisplay({ 
  error, 
  dictionary 
}: { 
  error: string; 
  dictionary: UserManagementLocale; 
}) {
  const params = useParams();
  const locale = params.locale as string || 'en';
  
  // アクセス権限エラーかどうかを判定
  const isAccessDenied = error === dictionary.alert.accessDenied;

  // アクセス権限エラーの場合
  if (isAccessDenied) {
    return <AccessDeniedError />;
  }

  // その他のエラーの場合（開発者向け詳細エラー）
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen mx-auto flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg border border-red-200">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <FaExclamationTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {dictionary.label.fetchUsersFailed}
          </h3>
          <div className="text-sm text-gray-500 mb-4 max-h-32 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-left bg-gray-50 p-2 rounded text-xs">
              {error}
            </pre>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
            <p className="text-xs text-red-800">
              <strong>{dictionary.label.developerInfo}</strong><br />
              {dictionary.label.checkDynamoDBConnection}<br />
              {dictionary.label.checkEnvironmentVariables}<br />
              {dictionary.label.checkIAMPermissions}<br />
              {dictionary.label.checkNetworkConnection}
            </p>
          </div>
          <button
            onClick={handleRetry}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
          >
            {dictionary.label.retry}
          </button>
        </div>
      </div>
    </div>
  );
}
