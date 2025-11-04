'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Card, CardBody, CardHeader, Button, Chip, Tooltip } from '@heroui/react';
import { FaDownload, FaClock, FaExclamationTriangle, FaSync, FaCheck, FaTimes } from 'react-icons/fa';
import { ProcessingHistory, updateProcessingHistory } from '@/app/lib/actions/processing-history-api';
import { getProcessingStatusMessage, getDownloadableFiles, formatFileSize } from '@/app/lib/utils/s3-utils';
import { downloadFiles } from '@/app/lib/actions/download-api';
import type { ServiceLocale } from '@/app/dictionaries/service/ServiceLocale.d.ts';

interface ProcessingHistoryListProps {
  processingHistory: ProcessingHistory[];
  dictionary: ServiceLocale;
  refreshKey: number;
}

/**
 * 処理履歴一覧コンポーネント
 */
export default function ProcessingHistoryList({ 
  processingHistory, 
  dictionary, 
  refreshKey 
}: ProcessingHistoryListProps) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // refreshKeyが変更されたときに更新処理を実行
  useEffect(() => {
    if (refreshKey > 0) {
      handleRefresh();
    }
  }, [refreshKey]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // サーバーサイドのデータを再取得
      router.refresh();
      // UIフィードバックのために少し待つ
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDownload = async (history: ProcessingHistory) => {
    try {
      const downloadableFiles = getDownloadableFiles(history);
      
      if (downloadableFiles.length === 0) {
        alert(dictionary.processingHistory.noDownloadableFiles);
        return;
      }

      // 出力ファイルのみを取得
      const outputFiles = downloadableFiles.filter(f => f.fileType === 'output');
      
      if (outputFiles.length === 0) {
        alert(dictionary.processingHistory.noOutputFiles);
        return;
      }

      // S3キーの配列を取得
      const s3Keys = outputFiles.map(f => f.s3Key);
      
      // Server Actionを呼び出してファイルをダウンロード
      const result = await downloadFiles(s3Keys);
      
      if (!result.success || !result.data) {
        alert(result.error || dictionary.processingHistory.downloadFailed);
        return;
      }

      // Base64データをBlobに変換
      const binaryString = atob(result.data.content);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: result.data.contentType });
      
      // ダウンロード用のURLを作成
      const url = URL.createObjectURL(blob);
      
      // ファイル名を決定
      let fileName = result.data.fileName;
      if (s3Keys.length > 1) {
        // 複数ファイルの場合はカスタムZIPファイル名
        fileName = `${history.policyName}_${history['processing-historyId'].substring(0, 8)}.zip`;
      }
      
      // ダウンロードを開始
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // URLを解放
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Download error:', error);
      alert(dictionary.processingHistory.downloadFailed);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  /**
   * ファイルが1年経過して削除されているかを判定
   */
  const isFileExpired = (createdAt: string): boolean => {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    return new Date(createdAt) < oneYearAgo;
  };

  const handleToggleAiTraining = async (history: ProcessingHistory) => {
    const newValue = history.aiTrainingUsage === 'allow' ? 'deny' : 'allow';
    setUpdatingId(history['processing-historyId']);

    try {
      const result = await updateProcessingHistory({
        'processing-historyId': history['processing-historyId'],
        aiTrainingUsage: newValue
      });

      if (!result.success) {
        alert(dictionary.processingHistory.aiTrainingUpdateFailed + ': ' + result.message);
      } else {
        // 更新成功時にデータを再取得
        await handleRefresh();
      }
    } catch (error) {
      console.error('Toggle AI training error:', error);
      alert(dictionary.processingHistory.aiTrainingUpdateFailed);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            {dictionary.processingHistory.title} {dictionary.processingHistory.count.replace('{count}', processingHistory.length.toString())}
          </h3>
          <Button
            color="primary"
            variant="light"
            size="sm"
            onPress={handleRefresh}
            isLoading={isRefreshing}
            startContent={!isRefreshing ? <FaSync /> : null}
          >
            {dictionary.processingHistory.refresh}
          </Button>
        </CardHeader>
        <CardBody>
          {processingHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FaClock className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="font-semibold mb-2">{dictionary.processingHistory.empty}</p>
              <p className="text-sm">{dictionary.processingHistory.emptyDescription}</p>
            </div>
          ) : (
            <Table aria-label={dictionary.table.ariaLabel}>
              <TableHeader>
                <TableColumn>{dictionary.processingHistory.columns.policy}</TableColumn>
                <TableColumn>{dictionary.processingHistory.columns.user}</TableColumn>
                <TableColumn>{dictionary.processingHistory.columns.status}</TableColumn>
                <TableColumn>{dictionary.processingHistory.columns.startTime}</TableColumn>
                <TableColumn>{dictionary.processingHistory.columns.fileSize}</TableColumn>
                <TableColumn>{dictionary.processingHistory.columns.aiTraining}</TableColumn>
                <TableColumn>{dictionary.processingHistory.columns.errorDetail}</TableColumn>
                <TableColumn>{dictionary.processingHistory.columns.download}</TableColumn>
              </TableHeader>
              <TableBody>
                {processingHistory.map((history) => {
                  const statusInfo = getProcessingStatusMessage(history.status);
                  
                  return (
                    <TableRow key={history['processing-historyId']}>
                      {/* ポリシー */}
                      <TableCell>
                        <p className="font-medium text-sm">{history.policyName}</p>
                      </TableCell>

                      {/* ユーザー */}
                      <TableCell>
                        <div className="text-sm">
                          {history.userName || dictionary.processingHistory.unknownUser}
                        </div>
                      </TableCell>

                      {/* ステータス */}
                      <TableCell>
                        <Chip
                          size="sm"
                          color={statusInfo.color}
                          variant="flat"
                        >
                          {statusInfo.message}
                        </Chip>
                      </TableCell>

                      {/* 開始時刻 */}
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(history.createdAt)}
                        </div>
                      </TableCell>

                      {/* ファイルサイズ */}
                      <TableCell>
                        <div className="text-sm">
                          {history.usageAmountBytes ? formatFileSize(history.usageAmountBytes) : '-'}
                        </div>
                      </TableCell>

                      {/* AI学習トグル */}
                      <TableCell>
                        <div className="flex justify-center rounded-md bg-gray-200">
                          {history.aiTrainingUsage === 'allow' ? (
                            <Button
                              size="sm"
                              color="success"
                              startContent={<FaCheck />}
                              onPress={() => handleToggleAiTraining(history)}
                              isDisabled={
                                updatingId === history['processing-historyId'] || 
                                history.status === 'in_progress'
                              }
                            >
                              {dictionary.processingHistory.allow}
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              color="danger"
                              startContent={<FaTimes />}
                              onPress={() => handleToggleAiTraining(history)}
                              isDisabled={
                                updatingId === history['processing-historyId'] || 
                                history.status === 'in_progress'
                              }
                            >
                              {dictionary.processingHistory.deny}
                            </Button>
                          )}
                        </div>
                      </TableCell>

                      {/* エラー詳細 */}
                      <TableCell>
                        {history.errorDetail ? (
                          <Tooltip content={history.errorDetail} color="danger" className="max-w-md">
                            <div className="flex items-center gap-1 text-xs text-danger cursor-help">
                              <FaExclamationTriangle />
                              <span className="truncate max-w-[100px]">
                                {history.errorDetail.length > 20 
                                  ? `${history.errorDetail.substring(0, 20)}...` 
                                  : history.errorDetail
                                }
                              </span>
                            </div>
                          </Tooltip>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </TableCell>

                      {/* ダウンロード */}
                      <TableCell>
                        <div className="flex justify-center">
                          {history.status === 'success' && history.downloadS3Keys.length > 0 ? (
                            isFileExpired(history.createdAt) ? (
                              <Tooltip 
                                content={dictionary.processingHistory.fileExpiredTooltip}
                                color="warning"
                              >
                                <Button
                                  isIconOnly
                                  size="sm"
                                  variant="flat"
                                  isDisabled
                                  className="opacity-50 cursor-not-allowed"
                                >
                                  <FaDownload className="text-gray-400" />
                                </Button>
                              </Tooltip>
                            ) : (
                              <Button
                                isIconOnly
                                size="sm"
                                variant="flat"
                                color="success"
                                onPress={() => handleDownload(history)}
                              >
                                <FaDownload />
                              </Button>
                            )
                          ) : (
                            <Button
                              isIconOnly
                              size="sm"
                              variant="flat"
                              isDisabled
                              className="opacity-30 cursor-not-allowed"
                            >
                              <FaDownload className="text-gray-400" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>
    </>
  );
}
