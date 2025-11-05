'use client'

import { Button, Card } from "@heroui/react"
import Link from "next/link"
import { useParams } from 'next/navigation'
import { FaExclamationTriangle } from 'react-icons/fa'
import AccessDeniedError from '@/app/_components/common/error/AccessDeniedError'
import { UsageLimitLocale } from '@/app/dictionaries/usageLimit/usage-limit.d'

interface UsageLimitErrorDisplayProps {
  error: string;
  dictionary: UsageLimitLocale;
}

/**
 * 使用量制限管理のエラー表示コンポーネント
 */
export default function UsageLimitErrorDisplay({ error, dictionary }: UsageLimitErrorDisplayProps) {
  const params = useParams();
  const locale = params.locale as string || 'ja';
  
  // アクセス権限エラーかどうかを判定
  const isAccessDenied = error === dictionary.alert.accessDenied;

  // アクセス権限エラーの場合
  if (isAccessDenied) {
    return <AccessDeniedError />;
  }

  // その他のエラーの場合
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 shadow-lg">
          <div className="text-center">
            <div className="mb-6">
              <FaExclamationTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {dictionary.label.usageLimitManagement}
              </h1>
              <p className="text-gray-600">
                {dictionary.label.errorOccurred}
              </p>
            </div>
            
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
              <h3 className="text-sm font-medium text-red-800 mb-2">{dictionary.label.errorDetails}</h3>
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
                {dictionary.label.reloadPage}
              </Button>
              
              <Button
                variant="bordered"
                as={Link}
                href={`/${locale}/account`}
                className="font-medium"
              >
                {dictionary.label.backToAccount}
              </Button>
            </div>
            
            <div className="mt-6 text-sm text-gray-500">
              <p>
                {dictionary.label.contactSupport}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

