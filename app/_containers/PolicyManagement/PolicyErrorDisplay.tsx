'use client'

import { Button, Card } from "@heroui/react"
import type { PolicyManagementLocale } from '@/app/dictionaries/policy-management/policy-management.d.ts';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FaExclamationTriangle } from 'react-icons/fa';
import AccessDeniedError from '@/app/_components/common/error/AccessDeniedError';

interface PolicyErrorDisplayProps {
  error: string;
  dictionary: PolicyManagementLocale;
}

export default function PolicyErrorDisplay({ error, dictionary }: PolicyErrorDisplayProps) {
  const params = useParams();
  const locale = params.locale as string || 'en';
  
  // アクセス権限エラーかどうかを判定
  const isAccessDenied = error === dictionary.alert.accessDenied;

  // アクセス権限エラーの場合
  if (isAccessDenied) {
    return <AccessDeniedError />;
  }

  // その他のエラーの場合
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">{dictionary.label.policyManagement}</h1>
        
        <Card className="p-8 shadow-lg">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
              <FaExclamationTriangle className="w-8 h-8 text-red-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {dictionary.label.errorOccurred}
            </h2>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <pre className="text-red-700 text-sm text-left whitespace-pre-wrap font-mono">
                {error}
              </pre>
            </div>
            
            <p className="text-gray-600 mb-6">
              {dictionary.label.contactAdmin}
            </p>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {dictionary.label.reloadPage}
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                {dictionary.label.goBack}
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
