'use client'

import { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Divider, Alert, Chip } from '@heroui/react';
import { ExclamationTriangleIcon, ArrowPathIcon, ArrowLeftIcon, UserGroupIcon, ClockIcon, BuildingOfficeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { restoreAccountAction } from '@/app/lib/actions/account-deletion-actions';
import type { DeletionStatusResponse } from '@/app/lib/actions/account-deletion-actions';
import { calculateDaysUntilDeletion, calculateDeletionDate } from '@/app/lib/utils/account-deletion-utils';
import { UserAttributesDTO } from '@/app/lib/types/TypeAPIs';
import { useRouter } from 'next/navigation';
import type { AccountDeletionLocale } from '@/app/dictionaries/account-deletion/account-deletion.d.ts';

interface CancelAccountDeletionPresentationProps {
  userAttributes: UserAttributesDTO;
  deletionStatus: DeletionStatusResponse;
  locale: string;
  dictionary: AccountDeletionLocale;
  accessError?: 'adminOnly' | 'notDeleted';
}

export default function CancelAccountDeletionPresentation({
  userAttributes,
  deletionStatus,
  locale,
  dictionary,
  accessError,
}: CancelAccountDeletionPresentationProps) {
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
        setError(result.message || dictionary.alert.cancelDeletionFailed);
      }
    } catch (err) {
      setError(dictionary.alert.unexpectedError);
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

  // アクセスエラーの表示
  if (accessError) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Button
          variant="light"
          startContent={<ArrowLeftIcon className="w-4 h-4" />}
          onPress={handleGoBack}
          className="mb-4"
        >
          {dictionary.label.backButton}
        </Button>

        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
              <div>
                <h1 className="text-xl font-bold text-red-700">
                  {accessError === 'adminOnly' ? dictionary.alert.adminOnlyAccess : dictionary.alert.notDeletionRequested}
                </h1>
              </div>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <p className="text-gray-700 mb-4">
              {accessError === 'adminOnly' ? dictionary.alert.adminOnlyDescription : dictionary.alert.notDeletionRequestedDescription}
            </p>
            <Button
              color="primary"
              variant="solid"
              startContent={<ArrowLeftIcon className="w-4 h-4" />}
              onPress={handleGoBack}
            >
              {dictionary.label.backButton}
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

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
          {dictionary.label.backButton}
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{dictionary.label.cancelPageTitle}</h1>
        <p className="text-gray-600">{dictionary.label.cancelPageDescription}</p>
      </div>

      {error && (
        <Alert color="danger" className="mb-6" title={dictionary.alert.errorTitle} description={error} />
      )}

      {/* 現在の状態カード */}
      <Card className="mb-6 border-orange-200 bg-orange-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="w-8 h-8 text-orange-500" />
            <div>
              <h2 className="text-xl font-bold text-orange-700">{dictionary.label.deletionRequestedTitle}</h2>
              <p className="text-sm text-orange-600">{dictionary.label.deletionRequestedDescription}</p>
            </div>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <Alert 
            color="warning" 
            title={dictionary.label.serviceSuspended}
            description={dictionary.label.serviceSuspendedDescription}
          />
        </CardBody>
      </Card>

      {/* 削除申請情報 */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ClockIcon className="w-5 h-5" />
            {dictionary.label.deletionRequestInfo}
          </h2>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <BuildingOfficeIcon className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium">{dictionary.label.organizationId}</p>
                  <p className="text-sm text-gray-600">{userAttributes.customerId}</p>
                </div>
              </div>
              
              {deletionRequestedAt && (
                <div className="flex items-center gap-3">
                  <ClockIcon className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium">{dictionary.label.deletionRequestDateTime}</p>
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
                    <p className="font-medium">{dictionary.label.affectedUsersCount}</p>
                    <Chip color="warning" variant="flat" size="sm">
                      {dictionary.label.usersAffected.replace('{count}', deletionStatus.affectedUsers.toString())}
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
                    <p className="font-medium">{dictionary.label.scheduledDeletionDate}</p>
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
                    <p className="font-medium">{dictionary.label.daysUntilDeletion}</p>
                    <Chip color={daysUntilDeletion <= 7 ? "danger" : "warning"} variant="flat" size="sm">
                      {dictionary.label.daysRemaining.replace('{days}', daysUntilDeletion.toString())}
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
            {dictionary.label.restoredContentTitle2}
          </h2>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3 text-green-700">{dictionary.label.userAccessTitle}</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {dictionary.label.allUserAccountsAccess2}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {dictionary.label.userProfileFeatures}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {dictionary.label.accessPermissionsRestore}
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-3 text-green-700">{dictionary.label.serviceFeaturesTitle}</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {dictionary.label.filesAndDocumentsAccess}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {dictionary.label.settingsAndCustomizationFeatures}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {dictionary.label.allServiceFunctions}
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-800">
              <strong>{dictionary.label.restoreNote}</strong> {dictionary.label.restoreNoteDescription}
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
          {dictionary.label.backButton}
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
          {loading ? dictionary.label.restoringButton : dictionary.label.cancelDeletionButton}
        </Button>
      </div>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-500">
          {dictionary.label.supportContact}
          <span className="ml-1">
            {dictionary.label.supportTeam}（connectechceomatsui@gmail.com）
          </span>
          {dictionary.label.pleaseContact}
        </p>
      </div>
    </div>
  );
}
  