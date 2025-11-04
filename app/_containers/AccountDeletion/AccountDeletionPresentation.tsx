'use client'

import { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Divider, Alert, Spinner, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Chip } from '@heroui/react';
import { ExclamationTriangleIcon, TrashIcon, ArrowPathIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { requestAccountDeletionAction, restoreAccountAction } from '@/app/lib/actions/account-deletion-actions';
import type { DeletionStatusResponse } from '@/app/lib/actions/account-deletion-actions';
import { calculateDaysUntilDeletion, calculateDeletionDate } from '@/app/lib/utils/account-deletion-utils';
import { UserAttributesDTO } from '@/app/lib/types/TypeAPIs';
import type { AccountDeletionLocale } from '@/app/dictionaries/account-deletion/account-deletion.d.ts';

interface AccountDeletionPresentationProps {
  userAttributes: UserAttributesDTO;
  deletionStatus: DeletionStatusResponse;
  dictionary: AccountDeletionLocale;
  locale?: string;
}

export default function AccountDeletionPresentation({
  userAttributes,
  deletionStatus,
  dictionary,
  locale,
}: AccountDeletionPresentationProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: isRestoreOpen, onOpen: onRestoreOpen, onOpenChange: onRestoreOpenChange } = useDisclosure();

  const isAdmin = userAttributes.role === 'admin';
  const isDeleted = deletionStatus.isDeleted;
  const deletionRequestedAt = deletionStatus.deletionRequestedAt || userAttributes.deletionRequestedAt;
  const userLocale = locale || userAttributes.locale || 'ja';

  // 削除リクエスト実行
  const handleRequestDeletion = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await requestAccountDeletionAction();
      
      if (result.success) {
        setSuccess(result.message || dictionary.alert.deletionRequestSuccess);
        onOpenChange(); // モーダルを閉じる
        // ページをリロードして最新状態を反映
        window.location.reload();
      } else {
        setError(result.message || dictionary.alert.deletionRequestFailed);
      }
    } catch (err) {
      setError(dictionary.alert.unexpectedError);
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
        setSuccess(result.message || dictionary.alert.restoreSuccess);
        onRestoreOpenChange(); // モーダルを閉じる
        // ページをリロードして最新状態を反映
        window.location.reload();
      } else {
        setError(result.message || dictionary.alert.restoreFailed);
      }
    } catch (err) {
      setError(dictionary.alert.unexpectedError);
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
                <h1 className="text-xl font-bold text-red-700">{dictionary.label.serviceSuspendedTitle}</h1>
                <p className="text-sm text-red-600">{dictionary.label.serviceSuspendedDescription}</p>
              </div>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="space-y-4">
            <div className="bg-white p-4 rounded-lg border">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">{dictionary.label.deletionRequestDate}</span>
                  <span>{deletionRequestedAt ? new Date(deletionRequestedAt).toLocaleString(userLocale) : dictionary.label.unknown}</span>
                </div>
                
                {deletionDate && (
                  <div className="flex items-center gap-2">
                    <TrashIcon className="w-5 h-5 text-red-500" />
                    <span className="font-medium">{dictionary.label.scheduledDeletionDate}</span>
                    <span className="text-red-600 font-semibold">
                      {deletionDate.toLocaleDateString(userLocale)}
                    </span>
                  </div>
                )}

                {daysUntilDeletion !== null && (
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-5 h-5 text-orange-500" />
                    <span className="font-medium">{dictionary.label.daysUntilDeletion}</span>
                    <Chip color={daysUntilDeletion <= 7 ? "danger" : "warning"} variant="flat">
                      {dictionary.label.daysRemaining.replace('{days}', daysUntilDeletion.toString())}
                    </Chip>
                  </div>
                )}

                {deletionStatus.affectedUsers && (
                  <div className="flex items-center gap-2">
                    <UserGroupIcon className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">{dictionary.label.affectedUsers}</span>
                    <span>{dictionary.label.usersCount.replace('{count}', deletionStatus.affectedUsers.toString())}</span>
                  </div>
                )}
              </div>
            </div>

            <Alert 
              color="warning" 
              title={dictionary.label.importantNotice}
              description={dictionary.label.serviceUnavailableMessage}
            />

            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                {dictionary.label.contactLabel} <a href="mailto:support@example.com" className="text-blue-600 hover:underline">support@example.com</a>
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
        <h1 className="text-2xl font-bold text-gray-900">{dictionary.label.pageTitle}</h1>
        <p className="text-gray-600 mt-2">{dictionary.label.pageDescription}</p>
      </div>

      {error && (
        <Alert color="danger" className="mb-6" title={dictionary.alert.errorTitle} description={error} />
      )}

      {success && (
        <Alert color="success" className="mb-6" title={dictionary.alert.successTitle} description={success} />
      )}

      {/* 現在のステータス */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold">{dictionary.label.currentStatus}</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-medium">{dictionary.label.accountStatus}</span>
                <Chip color={isDeleted ? "danger" : "success"} variant="flat">
                  {isDeleted ? dictionary.label.statusDeletionRequested : dictionary.label.statusActive}
                </Chip>
              </div>

              {deletionRequestedAt && (
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">{dictionary.label.requestDate}</span>
                  <span>{new Date(deletionRequestedAt).toLocaleString(userLocale)}</span>
                </div>
              )}

              {deletionStatus.affectedUsers && (
                <div className="flex items-center gap-2">
                  <UserGroupIcon className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">{dictionary.label.affectedUsers}</span>
                  <span>{dictionary.label.usersCount.replace('{count}', deletionStatus.affectedUsers.toString())}</span>
                </div>
              )}
            </div>

            {deletionDate && daysUntilDeletion !== null && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <TrashIcon className="w-5 h-5 text-red-500" />
                  <span className="font-medium">{dictionary.label.scheduledDeletionDate}</span>
                  <span className="text-red-600 font-semibold">
                    {deletionDate.toLocaleDateString(userLocale)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-orange-500" />
                  <span className="font-medium">{dictionary.label.daysUntilDeletion}</span>
                  <Chip color={daysUntilDeletion <= 7 ? "danger" : "warning"} variant="flat">
                    {dictionary.label.daysRemaining.replace('{days}', daysUntilDeletion.toString())}
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
            <h2 className="text-lg font-semibold">{dictionary.label.adminActions}</h2>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="space-y-4">
              {!isDeleted ? (
                <div>
                  <h3 className="font-medium text-red-700 mb-2">{dictionary.label.accountDeletionTitle}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {dictionary.label.accountDeletionDescription}
                  </p>
                  <Button
                    color="danger"
                    variant="solid"
                    startContent={<TrashIcon className="w-4 h-4" />}
                    onPress={onOpen}
                    isDisabled={!userAttributes.customerId}
                  >
                    {dictionary.label.requestDeletionButton}
                  </Button>
                </div>
              ) : (
                <div>
                  <h3 className="font-medium text-green-700 mb-2">{dictionary.label.accountRestoreTitle}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {dictionary.label.accountRestoreDescription}
                  </p>
                  <Button
                    color="success"
                    variant="solid"
                    startContent={<ArrowPathIcon className="w-4 h-4" />}
                    onPress={onRestoreOpen}
                  >
                    {dictionary.label.restoreAccountButton}
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
                  <span>{dictionary.label.deletionConfirmModalTitle}</span>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Alert 
                    color="danger" 
                    title={dictionary.label.criticalWarning}
                    description={dictionary.label.deletionWarningMessage}
                  />
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">{dictionary.label.deletedContentTitle}</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>{dictionary.label.allUserAccounts}</li>
                      <li>{dictionary.label.savedFilesAndData}</li>
                      <li>{dictionary.label.paymentAndBillingHistory}</li>
                      <li>{dictionary.label.settingsAndCustomization}</li>
                    </ul>
                  </div>

                  <p className="text-sm text-gray-600">
                    {dictionary.label.restorableMessage}
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  {dictionary.label.cancelButton}
                </Button>
                <Button 
                  color="danger" 
                  onPress={handleRequestDeletion}
                  isLoading={loading}
                  startContent={!loading ? <TrashIcon className="w-4 h-4" /> : undefined}
                >
                  {loading ? dictionary.label.processingButton : dictionary.label.confirmDeletionButton}
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
                  <span>{dictionary.label.restoreConfirmModalTitle}</span>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Alert 
                    color="success" 
                    title={dictionary.label.restoreTitle}
                    description={dictionary.label.restoreDescription}
                  />
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">{dictionary.label.restoredContentTitle}</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>{dictionary.label.allUserAccountsAccess}</li>
                      <li>{dictionary.label.savedFilesAndData}</li>
                      <li>{dictionary.label.serviceFunctions}</li>
                      <li>{dictionary.label.settingsAndCustomization}</li>
                    </ul>
                  </div>

                  <p className="text-sm text-gray-600">
                    {dictionary.label.confirmRestoreQuestion}
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  {dictionary.label.cancelButton}
                </Button>
                <Button 
                  color="success" 
                  onPress={handleRestoreAccount}
                  isLoading={loading}
                  startContent={!loading ? <ArrowPathIcon className="w-4 h-4" /> : undefined}
                >
                  {loading ? dictionary.label.processingButton : dictionary.label.confirmRestoreButton}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
  