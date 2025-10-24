'use client'

import { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Divider, Alert, Chip } from '@heroui/react';
import { ExclamationTriangleIcon, ArrowPathIcon, ArrowLeftIcon, UserGroupIcon, ClockIcon, BuildingOfficeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { restoreAccountAction, calculateDaysUntilDeletion, calculateDeletionDate } from '@/app/lib/actions/account-deletion-actions';
import type { DeletionStatusResponse } from '@/app/lib/actions/account-deletion-actions';
import { UserAttributesDTO } from '@/app/lib/types/TypeAPIs';
import { useRouter } from 'next/navigation';

interface AccountDeletionCancelPresentationProps {
  userAttributes: UserAttributesDTO;
  deletionStatus: DeletionStatusResponse;
  locale: string;
}

export default function AccountDeletionCancelPresentation({
  userAttributes,
  deletionStatus,
  locale,
}: AccountDeletionCancelPresentationProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // 削除リクエスト取り消し実行
  const handleCancelDeletion = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await restoreAccountAction();
      
      if (result.success) {
        // 成功時はメインページにリダイレクト
        router.push(`/${locale}/account/account-deletion`);
      } else {
        setError(result.message || '削除リクエストの取り消しに失敗しました');
      }
    } catch (err) {
      setError('予期しないエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  // 戻る
  const handleGoBack = () => {
    router.push(`/${locale}/account/account-deletion`);
  };

  // 削除予定日と残り日数を計算
  const deletionRequestedAt = deletionStatus.deletionRequestedAt;
  const deletionDate = deletionRequestedAt ? calculateDeletionDate(deletionRequestedAt) : null;
  const daysUntilDeletion = deletionRequestedAt ? calculateDaysUntilDeletion(deletionRequestedAt) : null;

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* ヘッダー */}
      <div className="mb-8">
        <Button
          variant="light"
          startContent={<ArrowLeftIcon className="w-4 h-4" />}
          onPress={handleGoBack}
          className="mb-4"
        >
          戻る
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">削除リクエストの取り消し</h1>
        <p className="text-gray-600">アカウント削除リクエストを取り消し、サービスの利用を再開します。</p>
      </div>

      {error && (
        <Alert color="danger" className="mb-6" title="エラー" description={error} />
      )}

      {/* 現在の状態カード */}
      <Card className="mb-6 border-orange-200 bg-orange-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="w-8 h-8 text-orange-500" />
            <div>
              <h2 className="text-xl font-bold text-orange-700">削除申請中</h2>
              <p className="text-sm text-orange-600">現在、アカウント削除が申請されています</p>
            </div>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <Alert 
            color="warning" 
            title="サービス利用停止中"
            description="すべてのユーザーのサービス利用が停止されています。削除リクエストを取り消すことで、サービス利用を再開できます。"
          />
        </CardBody>
      </Card>

      {/* 削除申請情報 */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ClockIcon className="w-5 h-5" />
            削除申請情報
          </h2>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <BuildingOfficeIcon className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium">組織ID</p>
                  <p className="text-sm text-gray-600">{userAttributes.customerId}</p>
                </div>
              </div>
              
              {deletionRequestedAt && (
                <div className="flex items-center gap-3">
                  <ClockIcon className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium">削除申請日時</p>
                    <p className="text-sm text-gray-600">
                      {new Date(deletionRequestedAt).toLocaleString('ja-JP')}
                    </p>
                  </div>
                </div>
              )}

              {deletionStatus.affectedUsers && (
                <div className="flex items-center gap-3">
                  <UserGroupIcon className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="font-medium">影響ユーザー数</p>
                    <Chip color="warning" variant="flat" size="sm">
                      {deletionStatus.affectedUsers}名のユーザー
                    </Chip>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {deletionDate && (
                <div className="flex items-center gap-3">
                  <ClockIcon className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="font-medium">削除予定日</p>
                    <p className="text-sm text-red-600 font-semibold">
                      {deletionDate.toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                </div>
              )}

              {daysUntilDeletion !== null && (
                <div className="flex items-center gap-3">
                  <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="font-medium">削除まで</p>
                    <Chip color={daysUntilDeletion <= 7 ? "danger" : "warning"} variant="flat" size="sm">
                      あと{daysUntilDeletion}日
                    </Chip>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* 復旧される内容 */}
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5" />
            復旧される内容
          </h2>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3 text-green-700">ユーザーアクセス</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  すべてのユーザーアカウントへのアクセス
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  ユーザープロファイル機能
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  アクセス権限の復旧
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-3 text-green-700">サービス機能</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  ファイルとドキュメントへのアクセス
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  設定とカスタマイズ機能
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  すべてのサービス機能
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-800">
              <strong>復旧について:</strong> 削除リクエストを取り消すことで、すべてのユーザーが即座にサービスを利用できるようになります。データは保持されており、完全に復旧されます。
            </p>
          </div>
        </CardBody>
      </Card>

      {/* アクションボタン */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          variant="light"
          size="lg"
          onPress={handleGoBack}
          className="min-w-[200px]"
        >
          戻る
        </Button>
        
        <Button
          color="success"
          variant="solid"
          size="lg"
          startContent={<ArrowPathIcon className="w-5 h-5" />}
          onPress={handleCancelDeletion}
          isLoading={loading}
          className="min-w-[200px]"
        >
          {loading ? '復旧処理中...' : '削除リクエストを取り消す'}
        </Button>
      </div>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-500">
          この操作について不明な点がある場合は、
          <a href="mailto:support@example.com" className="text-blue-600 hover:underline ml-1">
            サポートチーム
          </a>
          にお問い合わせください。
        </p>
      </div>
    </div>
  );
}
  