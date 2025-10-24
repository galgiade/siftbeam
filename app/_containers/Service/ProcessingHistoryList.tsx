'use client'

import { useState, useEffect } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Card, CardBody, CardHeader, Button, Chip, Tooltip } from '@heroui/react';
import { FaDownload, FaClock, FaCheckCircle, FaExclamationTriangle, FaSync, FaCheck, FaTimes } from 'react-icons/fa';
import { ProcessingHistory, updateProcessingHistory } from '@/app/lib/actions/processing-history-api';
import { getProcessingStatusMessage, getDownloadableFiles, calculateProcessingDuration, formatFileSize } from '@/app/lib/utils/s3-utils';

interface ProcessingHistoryListProps {
  processingHistory: ProcessingHistory[];
  dictionary: any;
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
    // 実際のリフレッシュ処理（親コンポーネントで処理）
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleDownload = async (s3Key: string, fileName: string) => {
    try {
      // TODO: 実際のダウンロード処理を実装
      console.log('Downloading:', { s3Key, fileName });
      
      // 実際のダウンロードAPI呼び出し（実装時）
      // const response = await fetch(`/api/download?key=${encodeURIComponent(s3Key)}`);
      // if (!response.ok) {
      //   if (response.status === 404) {
      //     throw new Error('FILE_NOT_FOUND');
      //   }
      //   throw new Error('Download failed');
      // }
      
      alert(`${fileName} のダウンロードを開始します。`);
    } catch (error) {
      console.error('Download error:', error);
      
      // ファイルが見つからない場合（S3で削除済み）
      if (error instanceof Error && error.message === 'FILE_NOT_FOUND') {
        alert('ファイルは保存期間（1年）を過ぎたため削除されました。');
      } else {
        alert('ダウンロードに失敗しました。');
      }
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

  const formatFileSizeWithFallback = (bytes?: number): string => {
    if (!bytes) return '不明';
    return formatFileSize(bytes);
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
        alert('AI学習使用の更新に失敗しました: ' + result.message);
      }
    } catch (error) {
      console.error('Toggle AI training error:', error);
      alert('AI学習使用の更新に失敗しました');
    } finally {
      setUpdatingId(null);
      // リフレッシュ
      handleRefresh();
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            処理履歴 ({processingHistory.length}件)
          </h3>
          <Button
            color="primary"
            variant="light"
            size="sm"
            onPress={handleRefresh}
            isLoading={isRefreshing}
            startContent={!isRefreshing ? <FaSync /> : null}
          >
            更新
          </Button>
        </CardHeader>
        <CardBody>
          {processingHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FaClock className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="font-semibold mb-2">処理履歴がありません</p>
              <p className="text-sm">ファイルをアップロードして処理を開始すると、ここに履歴が表示されます。</p>
            </div>
          ) : (
            <Table aria-label="処理履歴テーブル">
              <TableHeader>
                <TableColumn>ポリシー</TableColumn>
                <TableColumn>ユーザー</TableColumn>
                <TableColumn>ステータス</TableColumn>
                <TableColumn>開始時刻</TableColumn>
                <TableColumn>処理時間</TableColumn>
                <TableColumn>ファイルサイズ</TableColumn>
                <TableColumn>AI学習使用</TableColumn>
                <TableColumn>エラー詳細</TableColumn>
                <TableColumn>ダウンロード</TableColumn>
              </TableHeader>
              <TableBody>
                {processingHistory.map((history) => {
                  const statusInfo = getProcessingStatusMessage(history.status);
                  const duration = calculateProcessingDuration(history.createdAt, history.completedAt);
                  
                  return (
                    <TableRow key={history['processing-historyId']}>
                      {/* ポリシー */}
                      <TableCell>
                        <p className="font-medium text-sm">{history.policyName}</p>
                      </TableCell>

                      {/* ユーザー */}
                      <TableCell>
                        <div className="text-sm">
                          {history.userName || 'Unknown User'}
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

                      {/* 処理時間 */}
                      <TableCell>
                        <div className="text-sm">
                          {duration ? `${duration}秒` : '-'}
                        </div>
                      </TableCell>

                      {/* ファイルサイズ */}
                      <TableCell>
                        <div className="text-sm">
                          {history.fileSizeBytes ? formatFileSize(history.fileSizeBytes) : '-'}
                        </div>
                      </TableCell>

                      {/* AI学習トグル */}
                      <TableCell>
                        <div className="flex justify-center">
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
                              許可
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
                              拒否
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
                                content="ファイルは保存期間（1年）を過ぎたため削除されました" 
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
                                onPress={() => {
                                  const downloadableFiles = getDownloadableFiles(history);
                                  if (downloadableFiles.length > 0) {
                                    handleDownload(downloadableFiles[0].s3Key, downloadableFiles[0].fileName);
                                  }
                                }}
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
