'use client'

import { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Divider, Alert, Spinner, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Chip } from '@heroui/react';
import { ExclamationTriangleIcon, TrashIcon, ArrowPathIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { requestAccountDeletionAction, restoreAccountAction } from '@/app/lib/actions/account-deletion-actions';
import type { DeletionStatusResponse } from '@/app/lib/actions/account-deletion-actions';
import { calculateDaysUntilDeletion, calculateDeletionDate } from '@/app/lib/utils/account-deletion-utils';
import { UserAttributesDTO } from '@/app/lib/types/TypeAPIs';

interface AccountDeletionPresentationProps {
  userAttributes: UserAttributesDTO;
  deletionStatus: DeletionStatusResponse;
}

export default function AccountDeletionPresentation({
  userAttributes,
  deletionStatus,
}: AccountDeletionPresentationProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: isRestoreOpen, onOpen: onRestoreOpen, onOpenChange: onRestoreOpenChange } = useDisclosure();

  const isAdmin = userAttributes.role === 'admin';
  const isDeleted = deletionStatus.isDeleted;
  const deletionRequestedAt = deletionStatus.deletionRequestedAt || userAttributes.deletionRequestedAt;

  // 削除リクエスト実行
  const handleRequestDeletion = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await requestAccountDeletionAction();
      
      if (result.success) {
        setSuccess(result.message || 'アカウント削除リクエストが送信されました');
        onOpenChange(); // モーダルを閉じる
        // ページをリロードして最新状態を反映
        window.location.reload();
      } else {
        setError(result.message || '削除リクエストに失敗しました');
      }
    } catch (err) {
      setError('予期しないエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  // アカウント復旧
  const handleRestoreAccount = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await restoreAccountAction();
      
      if (result.success) {
        setSuccess(result.message || 'アカウントが復旧されました');
        onRestoreOpenChange(); // モーダルを閉じる
        // ページをリロードして最新状態を反映
        window.location.reload();
      } else {
        setError(result.message || 'アカウント復旧に失敗しました');
      }
    } catch (err) {
      setError('予期しないエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  // 削除予定日と残り日数を計算
  const deletionDate = deletionRequestedAt ? calculateDeletionDate(deletionRequestedAt) : null;
  const daysUntilDeletion = deletionRequestedAt ? calculateDaysUntilDeletion(deletionRequestedAt) : null;

  // 利用停止状態の表示
  if (isDeleted && !isAdmin) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
              <div>
                <h1 className="text-xl font-bold text-red-700">サービス利用停止中</h1>
                <p className="text-sm text-red-600">アカウント削除が申請されています</p>
              </div>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="space-y-4">
            <div className="bg-white p-4 rounded-lg border">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">削除申請日時:</span>
                  <span>{deletionRequestedAt ? new Date(deletionRequestedAt).toLocaleString('ja-JP') : '不明'}</span>
                </div>
                
                {deletionDate && (
                  <div className="flex items-center gap-2">
                    <TrashIcon className="w-5 h-5 text-red-500" />
                    <span className="font-medium">削除予定日:</span>
                    <span className="text-red-600 font-semibold">
                      {deletionDate.toLocaleDateString('ja-JP')}
                    </span>
                  </div>
                )}

                {daysUntilDeletion !== null && (
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-5 h-5 text-orange-500" />
                    <span className="font-medium">削除まで:</span>
                    <Chip color={daysUntilDeletion <= 7 ? "danger" : "warning"} variant="flat">
                      あと{daysUntilDeletion}日
                    </Chip>
                  </div>
                )}

                {deletionStatus.affectedUsers && (
                  <div className="flex items-center gap-2">
                    <UserGroupIcon className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">影響ユーザー数:</span>
                    <span>{deletionStatus.affectedUsers}名</span>
                  </div>
                )}
              </div>
            </div>

            <Alert 
              color="warning" 
              title="重要なお知らせ"
              description="現在、すべてのサービス機能が利用できません。アカウントの復旧をご希望の場合は、管理者にお問い合わせください。"
            />

            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                お問い合わせ: <a href="mailto:support@example.com" className="text-blue-600 hover:underline">support@example.com</a>
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  // 管理者用の削除・復旧画面
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">アカウント削除管理</h1>
        <p className="text-gray-600 mt-2">組織のアカウント削除と復旧を管理します</p>
      </div>

      {error && (
        <Alert color="danger" className="mb-6" title="エラー" description={error} />
      )}

      {success && (
        <Alert color="success" className="mb-6" title="成功" description={success} />
      )}

      {/* 現在のステータス */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold">現在のステータス</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-medium">アカウント状態:</span>
                <Chip color={isDeleted ? "danger" : "success"} variant="flat">
                  {isDeleted ? "削除申請中" : "アクティブ"}
                </Chip>
              </div>

              {deletionRequestedAt && (
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">申請日時:</span>
                  <span>{new Date(deletionRequestedAt).toLocaleString('ja-JP')}</span>
                </div>
              )}

              {deletionStatus.affectedUsers && (
                <div className="flex items-center gap-2">
                  <UserGroupIcon className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">影響ユーザー数:</span>
                  <span>{deletionStatus.affectedUsers}名</span>
                </div>
              )}
            </div>

            {deletionDate && daysUntilDeletion !== null && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <TrashIcon className="w-5 h-5 text-red-500" />
                  <span className="font-medium">削除予定日:</span>
                  <span className="text-red-600 font-semibold">
                    {deletionDate.toLocaleDateString('ja-JP')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-orange-500" />
                  <span className="font-medium">削除まで:</span>
                  <Chip color={daysUntilDeletion <= 7 ? "danger" : "warning"} variant="flat">
                    あと{daysUntilDeletion}日
                  </Chip>
                </div>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* 管理者用アクション */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">管理者アクション</h2>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="space-y-4">
              {!isDeleted ? (
                <div>
                  <h3 className="font-medium text-red-700 mb-2">アカウント削除</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    組織全体のアカウント削除を申請します。この操作により、すべてのユーザーのサービス利用が停止されます。
                  </p>
                  <Button
                    color="danger"
                    variant="solid"
                    startContent={<TrashIcon className="w-4 h-4" />}
                    onPress={onOpen}
                    isDisabled={!userAttributes.customerId}
                  >
                    アカウント削除を申請
                  </Button>
                </div>
              ) : (
                <div>
                  <h3 className="font-medium text-green-700 mb-2">アカウント復旧</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    削除申請を取り消し、すべてのユーザーのサービス利用を再開します。
                  </p>
                  <Button
                    color="success"
                    variant="solid"
                    startContent={<ArrowPathIcon className="w-4 h-4" />}
                    onPress={onRestoreOpen}
                  >
                    アカウントを復旧
                  </Button>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      )}

      {/* 削除確認モーダル */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
                  <span>アカウント削除の確認</span>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Alert 
                    color="danger" 
                    title="重要な警告"
                    description="この操作は組織全体に影響します。すべてのユーザーのサービス利用が即座に停止され、90日後にデータが完全に削除されます。"
                  />
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">削除される内容:</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>すべてのユーザーアカウント</li>
                      <li>保存されたファイルとデータ</li>
                      <li>支払い情報と請求履歴</li>
                      <li>設定とカスタマイズ</li>
                    </ul>
                  </div>

                  <p className="text-sm text-gray-600">
                    この操作は90日以内であれば復旧可能です。本当に削除を申請しますか？
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  キャンセル
                </Button>
                <Button 
                  color="danger" 
                  onPress={handleRequestDeletion}
                  isLoading={loading}
                  startContent={!loading ? <TrashIcon className="w-4 h-4" /> : undefined}
                >
                  {loading ? '処理中...' : '削除を申請'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* 復旧確認モーダル */}
      <Modal isOpen={isRestoreOpen} onOpenChange={onRestoreOpenChange} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <ArrowPathIcon className="w-6 h-6 text-green-500" />
                  <span>アカウント復旧の確認</span>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Alert 
                    color="success" 
                    title="アカウント復旧"
                    description="削除申請を取り消し、すべてのユーザーのサービス利用を再開します。"
                  />
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">復旧される内容:</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>すべてのユーザーアカウントへのアクセス</li>
                      <li>保存されたファイルとデータ</li>
                      <li>サービス機能の利用</li>
                      <li>設定とカスタマイズ</li>
                    </ul>
                  </div>

                  <p className="text-sm text-gray-600">
                    アカウントを復旧しますか？
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  キャンセル
                </Button>
                <Button 
                  color="success" 
                  onPress={handleRestoreAccount}
                  isLoading={loading}
                  startContent={!loading ? <ArrowPathIcon className="w-4 h-4" /> : undefined}
                >
                  {loading ? '処理中...' : 'アカウントを復旧'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
  