'use client'

import { useState, useRef } from 'react';
import { Button, Card, CardBody, Progress, Chip } from '@heroui/react';
import { FaCloudArrowUp, FaFile, FaImage, FaVideo, FaMusic, FaTrash, FaCheck, FaTriangleExclamation, FaBan } from 'react-icons/fa6';
import { generatePresignedUrl } from '@/app/lib/actions/generate-presigned-url';
import { createProcessingHistory } from '@/app/lib/actions/processing-history-api';
import { checkUsageLimits } from '@/app/lib/actions/usage-limit-check';
import { sendUsageLimitNotificationEmailAction } from '@/app/lib/actions/email-actions';
import { formatFileSize } from '@/app/lib/utils/s3-utils';
import { UsageLimit } from '@/app/lib/actions/usage-limits-api';

interface ServiceFileUploaderProps {
  customerId: string;
  userId: string;
  userName: string;
  policyId: string;
  policyName: string;
  notifyLimits: UsageLimit[];
  restrictLimits: UsageLimit[];
  onProcessingStarted: () => void;
  dictionary: any;
  locale: string;
}

interface UploadingFile {
  file: File;
  id: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  s3Key?: string;
  error?: string;
}

// ファイルタイプ別のアイコン
const getFileIcon = (contentType: string) => {
  if (contentType.startsWith('image/')) return FaImage;
  if (contentType.startsWith('video/')) return FaVideo;
  if (contentType.startsWith('audio/')) return FaMusic;
  return FaFile;
};


export default function ServiceFileUploader({
  customerId,
  userId,
  userName,
  policyId,
  policyName,
  notifyLimits,
  restrictLimits,
  onProcessingStarted,
  dictionary,
  locale
}: ServiceFileUploaderProps) {
  const [files, setFiles] = useState<UploadingFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [usageLimitError, setUsageLimitError] = useState<string>('');
  const [usageLimitWarning, setUsageLimitWarning] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxFiles = 10;
  const maxFileSize = 100 * 1024 * 1024; // 100MB

  // ファイル選択処理
  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    // エラーとワーニングをクリア
    setUsageLimitError('');
    setUsageLimitWarning('');
    setSuccessMessage('');

    const newFiles: UploadingFile[] = [];
    const currentFileCount = files.length;

    for (let i = 0; i < selectedFiles.length && currentFileCount + newFiles.length < maxFiles; i++) {
      const file = selectedFiles[i];
      
      // ファイルサイズチェック
      if (file.size > maxFileSize) {
        alert(`${file.name} のファイルサイズが大きすぎます。100MB以下のファイルを選択してください。`);
        continue;
      }

      newFiles.push({
        file,
        id: `${Date.now()}-${i}`,
        status: 'pending',
        progress: 0
      });
    }

    setFiles(prev => [...prev, ...newFiles]);
  };

  // ドラッグ&ドロップ処理
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  // ファイル削除
  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    setUsageLimitError('');
    setUsageLimitWarning('');
    setSuccessMessage('');
  };

  // ファイルアップロードと処理開始
  const handleStartProcessing = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setUsageLimitError('');
    setUsageLimitWarning('');
    setSuccessMessage('');
    
    try {
      // 合計ファイルサイズを計算
      const totalFileSize = files.reduce((sum, f) => sum + f.file.size, 0);
      
      // 利用制限をチェック
      const limitCheckResult = await checkUsageLimits(
        customerId,
        totalFileSize,
        notifyLimits,
        restrictLimits
      );

      if (!limitCheckResult.success) {
        setUsageLimitError(limitCheckResult.message || '利用制限のチェックに失敗しました。');
        setIsProcessing(false);
        return;
      }

      // アップロードできない場合
      if (!limitCheckResult.data?.canUpload) {
        setUsageLimitError(limitCheckResult.data?.restrictReason || '利用停止制限に達しているため、アップロードできません。');
        setIsProcessing(false);
        return;
      }

      // 処理履歴IDを生成
      const processingHistoryId = crypto.randomUUID();
      
      // アップロード予定のファイルキーを事前に生成
      const uploadedFileKeys: string[] = files.map(fileItem => 
        `service/input/${customerId}/${processingHistoryId}/${fileItem.file.name}`
      );
      
      // 処理履歴を作成（アップロード前に作成）
      // 注: createdAtは処理開始時刻として自動的に設定されます
      // S3イベントLambdaがファイルサイズを更新します
      const historyResult = await createProcessingHistory({
        'processing-historyId': processingHistoryId,
        userId,
        userName: userName || 'User',
        customerId,
        policyId,
        policyName,
        usageAmountBytes: 0, // S3イベントLambdaで更新
        uploadedFileKeys,
        aiTrainingUsage: 'allow' // TODO: ユーザー設定から取得
      });

      if (!historyResult.success) {
        throw new Error('処理履歴の作成に失敗しました: ' + historyResult.message);
      }

      console.log('処理履歴作成成功:', {
        processingHistoryId,
        policyName,
        fileCount: uploadedFileKeys.length,
        startedAt: historyResult.data?.createdAt
      });
      
      // 各ファイルをアップロード（署名付きURL方式）
      let actualTotalFileSize = 0;
      const uploadStartTime = Date.now();

      for (let i = 0; i < files.length; i++) {
        const fileItem = files[i];
        
        setFiles(prev => prev.map(f => 
          f.id === fileItem.id ? { ...f, status: 'uploading', progress: 10 } : f
        ));

        try {
          // 1. 署名付きURLを生成
          const presignedUrlResult = await generatePresignedUrl({
            fileName: fileItem.file.name,
            fileType: fileItem.file.type || 'application/octet-stream',
            customerId,
            userId,
            policyId,
            processingHistoryId,
            fileType_metadata: 'input',
            isLastFile: false, // 通常ファイルはfalse
          });

          if (!presignedUrlResult.success || !presignedUrlResult.data) {
            throw new Error(presignedUrlResult.message || '署名付きURLの生成に失敗しました');
          }

          setFiles(prev => prev.map(f => 
            f.id === fileItem.id ? { ...f, progress: 30 } : f
          ));

          // 2. S3に直接アップロード
          const uploadResponse = await fetch(presignedUrlResult.data.presignedUrl, {
            method: 'PUT',
            body: fileItem.file,
            headers: {
              'Content-Type': fileItem.file.type || 'application/octet-stream',
            },
          });

          if (!uploadResponse.ok) {
            throw new Error(`S3アップロードに失敗しました: ${uploadResponse.status} ${uploadResponse.statusText}`);
          }

          actualTotalFileSize += fileItem.file.size;
          
          setFiles(prev => prev.map(f => 
            f.id === fileItem.id ? { 
              ...f, 
              status: 'success', 
              progress: 100,
              s3Key: presignedUrlResult.data!.s3Key,
            } : f
          ));

          console.log(`File uploaded successfully: ${fileItem.file.name} (${fileItem.file.size} bytes)`);
        } catch (error: any) {
          console.error(`Upload error for ${fileItem.file.name}:`, error);
          setFiles(prev => prev.map(f => 
            f.id === fileItem.id ? { 
              ...f, 
              status: 'error', 
              progress: 0, 
              error: error.message 
            } : f
          ));
          throw new Error(`${fileItem.file.name}: ${error.message}`);
        }
      }

      // すべてのファイルアップロード完了後、トリガーファイルを作成
      const uploadDuration = (Date.now() - uploadStartTime) / 1000; // 秒
      console.log(`All files uploaded: ${files.length} files, total size: ${actualTotalFileSize} bytes, duration: ${uploadDuration}s`);
      
      // トリガーファイルの内容を作成（API版と統一）
      const triggerContent = {
        'processing-historyId': processingHistoryId,
        userId,
        userName: userName || 'User',
        customerId,
        policyId,
        policyName,
        uploadedFileKeys,
        aiTrainingUsage: 'allow' as const,
        fileCount: files.length,
        usageAmountBytes: actualTotalFileSize,
        createdAt: new Date().toISOString(),
        metadata: {
          source: 'browser',
          apiVersion: '2025-10-28'
        }
      };
      
      // トリガーファイルをBlobとして作成
      const triggerBlob = new Blob(
        [JSON.stringify(triggerContent, null, 2)], 
        { type: 'application/json' }
      );
      const triggerFile = new File([triggerBlob], '_trigger.json', { type: 'application/json' });
      
      try {
        // トリガーファイル用の署名付きURLを生成
        const triggerPresignedUrlResult = await generatePresignedUrl({
          fileName: '_trigger.json',
          fileType: 'application/json',
          customerId,
          userId,
          policyId,
          processingHistoryId,
          fileType_metadata: 'input',
          isLastFile: true, // トリガーファイルでStep Functions起動
        });

        if (!triggerPresignedUrlResult.success || !triggerPresignedUrlResult.data) {
          throw new Error(triggerPresignedUrlResult.message || 'トリガーファイル用署名付きURLの生成に失敗しました');
        }

        // S3に直接アップロード
        const triggerUploadResponse = await fetch(triggerPresignedUrlResult.data.presignedUrl, {
          method: 'PUT',
          body: triggerFile,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!triggerUploadResponse.ok) {
          throw new Error(`トリガーファイルのS3アップロードに失敗しました: ${triggerUploadResponse.status}`);
        }

        console.log('Trigger file uploaded successfully, Step Functions will be triggered');
      } catch (error: any) {
        console.error('Failed to upload trigger file:', error);
        // トリガーファイルの失敗は警告のみ（メインファイルは成功している）
        // 手動でStep Functionsを起動することも可能
      }

      // 通知が必要な場合はメールを送信
      if (limitCheckResult.data?.shouldNotify && limitCheckResult.data.notifyEmails.length > 0) {
        const exceedingLimitDescription = limitCheckResult.data.exceedingLimits.notify
          .map(limit => {
            if (limit.usageLimitValue && limit.usageUnit) {
              return `${limit.usageLimitValue} ${limit.usageUnit}`;
            } else if (limit.amountLimitValue) {
              return `$${limit.amountLimitValue}`;
            }
            return '制限値';
          })
          .join(', ');

        const emailResult = await sendUsageLimitNotificationEmailAction(
          limitCheckResult.data.notifyEmails,
          customerId,
          limitCheckResult.data.currentUsageBytes + actualTotalFileSize,
          exceedingLimitDescription,
          locale
        );

        if (emailResult.success) {
          setUsageLimitWarning(
            `通知制限（${exceedingLimitDescription}）に達しました。${emailResult.sentCount}件の通知メールを送信しました。`
          );
        } else {
          setUsageLimitWarning(
            `通知制限に達しましたが、メール送信に失敗しました: ${emailResult.message}`
          );
        }
      }

      // 成功時の処理
      setSuccessMessage(`${uploadedFileKeys.length}個のファイルのアップロードが完了し、AI処理を開始しました！`);
      setFiles([]);
      onProcessingStarted();

    } catch (error: any) {
      console.error('Processing start error:', error);
      setUsageLimitError('処理の開始に失敗しました: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const canStartProcessing = files.length > 0 && files.every(f => f.status === 'pending') && !isProcessing;

  return (
    <div className="space-y-6">
      {/* 成功メッセージ表示 */}
      {successMessage && (
        <Card className="border-success-200 bg-success-50">
          <CardBody className="p-4">
            <div className="flex items-start gap-3">
              <FaCheck className="text-success text-xl mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-success-800 mb-1">
                  アップロード完了
                </h4>
                <p className="text-sm text-success-700">
                  {successMessage}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* 利用制限エラー表示 */}
      {usageLimitError && (
        <Card className="border-danger-200 bg-danger-50">
          <CardBody className="p-4">
            <div className="flex items-start gap-3">
              <FaBan className="text-danger text-xl mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-danger-800 mb-1">
                  アップロード不可
                </h4>
                <p className="text-sm text-danger-700">
                  {usageLimitError}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* 利用制限警告表示 */}
      {usageLimitWarning && (
        <Card className="border-warning-200 bg-warning-50">
          <CardBody className="p-4">
            <div className="flex items-start gap-3">
              <FaTriangleExclamation className="text-warning text-xl mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-warning-800 mb-1">
                  通知制限に達しました
                </h4>
                <p className="text-sm text-warning-700">
                  {usageLimitWarning}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* ファイル選択エリア */}
      <Card 
        className={`border-2 border-dashed transition-colors ${
          isDragOver 
            ? 'border-primary bg-primary-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <CardBody
          className="text-center p-8 cursor-pointer"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <FaCloudArrowUp className={`text-6xl mx-auto mb-4 ${
            isDragOver ? 'text-primary' : 'text-gray-400'
          }`} />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            ファイルをドラッグ&ドロップ
          </h3>
          <p className="text-gray-500 mb-4">
            または <span className="text-primary font-medium">クリックして選択</span>
          </p>
          <div className="text-sm text-gray-400 space-y-1">
            <p>最大 {maxFiles} ファイル、各ファイル 100MB まで</p>
            <p>対応形式: {policyName} で指定された形式</p>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
        </CardBody>
      </Card>

      {/* 選択されたファイル一覧 */}
      {files.length > 0 && (
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">
                選択されたファイル ({files.length}/{maxFiles})
              </h4>
              <Button
                color="danger"
                variant="light"
                size="sm"
                onPress={() => {
                  setFiles([]);
                  setUsageLimitError('');
                  setUsageLimitWarning('');
                  setSuccessMessage('');
                }}
                startContent={<FaTrash />}
              >
                すべて削除
              </Button>
            </div>
            
            <div className="space-y-3">
              {files.map((fileItem) => {
                const FileIcon = getFileIcon(fileItem.file.type);
                
                return (
                  <div key={fileItem.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FileIcon className="text-2xl text-gray-600" />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900 truncate">
                          {fileItem.file.name}
                        </p>
                        <Chip
                          size="sm"
                          color={
                            fileItem.status === 'success' ? 'success' :
                            fileItem.status === 'error' ? 'danger' :
                            fileItem.status === 'uploading' ? 'warning' : 'default'
                          }
                          startContent={
                            fileItem.status === 'success' ? <FaCheck /> :
                            fileItem.status === 'error' ? <FaTriangleExclamation /> : null
                          }
                        >
                          {fileItem.status === 'pending' ? '待機中' :
                           fileItem.status === 'uploading' ? 'アップロード中' :
                           fileItem.status === 'success' ? '完了' : 'エラー'}
                        </Chip>
                      </div>
                      
                      <p className="text-sm text-gray-500">
                        {formatFileSize(fileItem.file.size)}
                      </p>
                      
                      {fileItem.status === 'uploading' && (
                        <Progress 
                          value={fileItem.progress} 
                          className="mt-2"
                          color="primary"
                          size="sm"
                        />
                      )}
                      
                      {fileItem.error && (
                        <p className="text-sm text-danger mt-1">
                          {fileItem.error}
                        </p>
                      )}
                    </div>
                    
                    <Button
                      isIconOnly
                      color="danger"
                      variant="light"
                      size="sm"
                      onPress={() => removeFile(fileItem.id)}
                      isDisabled={fileItem.status === 'uploading'}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      )}

      {/* 処理開始ボタン */}
      {files.length > 0 && (
        <div className="flex justify-end">
          <Button
            color="primary"
            size="lg"
            onPress={handleStartProcessing}
            isDisabled={!canStartProcessing}
            isLoading={isProcessing}
          >
            {isProcessing ? '処理開始中...' : '処理を開始'}
          </Button>
        </div>
      )}
    </div>
  );
}
