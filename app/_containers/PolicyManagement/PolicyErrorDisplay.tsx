'use client'

import { Card } from "@heroui/react"
import type { UserProfileLocale } from '@/app/dictionaries/user/user.d.ts';

interface PolicyErrorDisplayProps {
  error: string;
  dictionary: UserProfileLocale;
}

export default function PolicyErrorDisplay({ error, dictionary }: PolicyErrorDisplayProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">ポリシー管理</h1>
        
        <Card className="p-8 shadow-lg">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              エラーが発生しました
            </h2>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <pre className="text-red-700 text-sm text-left whitespace-pre-wrap font-mono">
                {error}
              </pre>
            </div>
            
            <p className="text-gray-600 mb-6">
              問題が解決しない場合は、システム管理者にお問い合わせください。
            </p>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                ページを再読み込み
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                前のページに戻る
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
