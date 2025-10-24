'use client'

import { Card, Button } from "@heroui/react"
import Link from "next/link"
import type { UserProfileLocale } from '@/app/dictionaries/user/user.d.ts';

interface GroupErrorDisplayProps {
  error: string;
  dictionary: UserProfileLocale;
}

/**
 * グループ管理のエラー表示コンポーネント
 * エラーメッセージを表示し、ユーザーに適切なアクションを提供
 */
export default function GroupErrorDisplay({ error, dictionary }: GroupErrorDisplayProps) {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 shadow-lg">
          <div className="text-center">
            <div className="mb-6">
              <svg 
                className="w-16 h-16 text-red-500 mx-auto mb-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                グループ管理エラー
              </h1>
              <p className="text-gray-600">
                グループ管理ページの読み込み中にエラーが発生しました。
              </p>
            </div>
            
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
              <h3 className="text-sm font-medium text-red-800 mb-2">エラー詳細:</h3>
              <pre className="text-sm text-red-700 whitespace-pre-wrap break-words">
                {error}
              </pre>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                color="primary"
                onPress={handleReload}
                className="font-medium"
              >
                ページを再読み込み
              </Button>
              
              <Button
                variant="bordered"
                as={Link}
                href="/ja/account"
                className="font-medium"
              >
                アカウントページに戻る
              </Button>
            </div>
            
            <div className="mt-6 text-sm text-gray-500">
              <p>
                問題が解決しない場合は、システム管理者にお問い合わせください。
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
