'use client'

import { Card, Button } from "@heroui/react"
import Link from "next/link"
import { useParams } from 'next/navigation'
import { FaLock } from 'react-icons/fa'
import { accessDeniedDictionaries } from '@/app/dictionaries/common/accessDenied'

interface AccessDeniedErrorProps {
  backButtonHref?: string;
}

/**
 * アクセス権限エラー表示の共通コンポーネント
 * 管理者専用ページに一般ユーザーがアクセスしようとした際に表示
 */
export default function AccessDeniedError({ 
  backButtonHref 
}: AccessDeniedErrorProps) {
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  
  // ロケールに応じた辞書を取得
  const dictionary = accessDeniedDictionaries[locale as keyof typeof accessDeniedDictionaries] || accessDeniedDictionaries['en'];
  
  // デフォルトのリンク先はユーザープロフィールページ
  const href = backButtonHref || `/${locale}/account/user`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="max-w-md p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
          <FaLock className="h-8 w-8 text-yellow-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {dictionary.title}
        </h2>
        <p className="text-gray-600 mb-6">
          {dictionary.message}
        </p>
        <Button
          as={Link}
          href={href}
          color="primary"
          size="lg"
          className="w-full"
        >
          {dictionary.backButton}
        </Button>
      </Card>
    </div>
  );
}

