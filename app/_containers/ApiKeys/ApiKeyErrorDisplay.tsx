'use client'

import { Card, CardBody, CardHeader, Alert } from '@heroui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface ApiKeyErrorDisplayProps {
  error: string;
  dictionary: any;
}

/**
 * APIキー管理のエラー表示コンポーネント
 */
export default function ApiKeyErrorDisplay({ error, dictionary }: ApiKeyErrorDisplayProps) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader className="flex items-center gap-3 bg-red-50">
          <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
          <div>
            <h1 className="text-xl font-bold text-red-800">APIキー管理エラー</h1>
            <p className="text-sm text-red-600">APIキー管理システムでエラーが発生しました</p>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <Alert 
            color="danger" 
            title="エラーが発生しました"
            description="以下の詳細を確認してください。問題が解決しない場合は、システム管理者にお問い合わせください。"
          />
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">エラー詳細:</h3>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
              {error}
            </pre>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">対処方法:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• ページを再読み込みしてください</li>
              <li>• ネットワーク接続を確認してください</li>
              <li>• 管理者権限があることを確認してください</li>
              <li>• 問題が続く場合は、システム管理者にお問い合わせください</li>
            </ul>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
