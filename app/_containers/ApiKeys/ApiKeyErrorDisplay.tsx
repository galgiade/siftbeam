'use client'

import { Button, Card, CardBody, CardHeader, Alert } from '@heroui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { APIKeyLocale } from '@/app/dictionaries/apiKey/apiKey.d'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import AccessDeniedError from '@/app/_components/common/error/AccessDeniedError'

interface ApiKeyErrorDisplayProps {
  error: string;
  dictionary: APIKeyLocale;
}

/**
 * APIキー管理のエラー表示コンポーネント
 */
export default function ApiKeyErrorDisplay({ error, dictionary }: ApiKeyErrorDisplayProps) {
  const params = useParams();
  const locale = params.locale as string || 'en';
  
  // アクセス権限エラーかどうかを判定
  const isAccessDenied = error === dictionary.error.accessDenied;

  // アクセス権限エラーの場合
  if (isAccessDenied) {
    return <AccessDeniedError />;
  }

  // その他のエラーの場合
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader className="flex items-center gap-3 bg-red-50">
          <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
          <div>
            <h1 className="text-xl font-bold text-red-800">{dictionary.error.title}</h1>
            <p className="text-sm text-red-600">{dictionary.error.description}</p>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <Alert 
            color="danger" 
            title={dictionary.error.title}
            description={dictionary.error.contactAdmin}
          />
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">{dictionary.error.detailsTitle}</h3>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
              {error}
            </pre>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">{dictionary.error.troubleshooting}</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• {dictionary.error.reloadPage}</li>
              <li>• {dictionary.error.checkNetwork}</li>
              <li>• {dictionary.error.checkAdminPermission}</li>
              <li>• {dictionary.error.contactAdmin}</li>
            </ul>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
