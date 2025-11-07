'use client'

import { useState, useRef, useEffect } from 'react'
import { Button, Card, Chip, Progress } from '@heroui/react'
import { uploadMultipleFiles, UploadFileResult } from '@/app/lib/actions/file-upload-api'
import { FaCloudArrowUp, FaFile, FaImage, FaVideo, FaMusic, FaTrash, FaCheck, FaTriangleExclamation } from 'react-icons/fa6'
import type { CommonLocale } from '@/app/dictionaries/common/common.d'

interface FileUploaderProps {
  customerId: string;
  userId: string;
  supportRequestId?: string;
  context: 'request' | 'reply'; // リクエストかリプライかを指定
  replyId?: string; // リプライの場合のみ必要
  onFilesUploaded: (fileKeys: string[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // MB
  acceptedFileTypes?: string[];
  disabled?: boolean;
  commonDictionary: CommonLocale; // 共通辞書を追加
  uploadType: 'support' | 'neworder'; // アップロード先の種類（必須）
}

interface UploadingFile {
  file: File;
  id: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  result?: UploadFileResult;
  error?: string;
}

// ファイルタイプ別のアイコン
const getFileIcon = (contentType: string) => {
  if (contentType.startsWith('image/')) return FaImage;
  if (contentType.startsWith('video/')) return FaVideo;
  if (contentType.startsWith('audio/')) return FaMusic;
  return FaFile;
};

// ファイルサイズをフォーマット
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function FileUploader({
  customerId,
  userId,
  supportRequestId,
  context,
  replyId,
  onFilesUploaded,
  maxFiles = 5,
  maxFileSize = 10, // MB
  acceptedFileTypes = ['*/*'],
  disabled = false,
  commonDictionary,
  uploadType // 必須パラメータ、デフォルト値なし
}: FileUploaderProps) {
  const dict = commonDictionary.common.fileUploader;
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // コンポーネントマウント時にuploadTypeをログ出力
  useEffect(() => {
    console.log('📤 FileUploader mounted with uploadType:', uploadType);
  }, [uploadType]);

  // ファイル状態変更時に親コンポーネントに通知
  useEffect(() => {
    const successfulFileKeys = uploadingFiles
      .filter(f => f.status === 'success' && f.result)
      .map(f => f.result!.fileKey);
    
    onFilesUploaded(successfulFileKeys);
  }, [uploadingFiles, onFilesUploaded]);

  // ファイル選択ハンドラー
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // ファイル数チェック
    const currentFileCount = uploadingFiles.filter(f => f.status === 'success').length;
    const totalFiles = currentFileCount + files.length;
    
    if (totalFiles > maxFiles) {
      alert(dict.maxFilesExceeded.replace('{maxFiles}', maxFiles.toString()));
      return;
    }

    // ファイルサイズチェック
    const oversizedFiles = files.filter(file => file.size > maxFileSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert(dict.fileSizeExceeded
        .replace('{maxFileSize}', maxFileSize.toString())
        .replace('{files}', oversizedFiles.map(f => f.name).join(', ')));
      return;
    }

    // アップロード待ちファイルを追加
    const newUploadingFiles: UploadingFile[] = files.map(file => ({
      file,
      id: `${Date.now()}-${Math.random()}`,
      status: 'pending',
      progress: 0
    }));

    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);
    
    // ファイル入力をリセット
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ファイルアップロード実行
  const handleUpload = async () => {
    const pendingFiles = uploadingFiles.filter(f => f.status === 'pending');
    if (pendingFiles.length === 0) return;

    setIsUploading(true);

    try {
      // アップロード状態を更新
      setUploadingFiles(prev => 
        prev.map(f => 
          f.status === 'pending' 
            ? { ...f, status: 'uploading' as const, progress: 0 }
            : f
        )
      );

      const filesToUpload = pendingFiles.map(f => f.file);
      
      console.log('🚀 FileUploader calling uploadMultipleFiles with:', {
        fileCount: filesToUpload.length,
        customerId,
        userId,
        uploadType,
        supportRequestId,
        context,
        replyId
      });
      
      const result = await uploadMultipleFiles(filesToUpload, customerId, userId, uploadType, supportRequestId, context, replyId);

      if (result.success && result.data) {
        // 成功したファイルを更新
        const successResults = result.data;
        setUploadingFiles(prev => 
          prev.map(f => {
            if (f.status === 'uploading') {
              const matchingResult = successResults.find(r => r.fileName === f.file.name);
              if (matchingResult) {
                return {
                  ...f,
                  status: 'success' as const,
                  progress: 100,
                  result: matchingResult
                };
              }
            }
            return f;
          })
        );

        // 成功したファイルキーは useEffect で自動的に通知される

      } else {
        // エラーの場合
        setUploadingFiles(prev => 
          prev.map(f => 
            f.status === 'uploading' 
              ? { ...f, status: 'error' as const, error: result.message }
              : f
          )
        );
      }

    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadingFiles(prev => 
        prev.map(f => 
          f.status === 'uploading' 
            ? { ...f, status: 'error' as const, error: dict.uploadFailed }
            : f
        )
      );
    } finally {
      setIsUploading(false);
    }
  };

  // ファイル削除
  const handleRemoveFile = (id: string) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== id));
    // ファイルキーの更新は useEffect で自動的に処理される
  };

  // ドラッグ&ドロップハンドラー
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && fileInputRef.current) {
      // FileListを作成してinputに設定
      const dt = new DataTransfer();
      files.forEach(file => dt.items.add(file));
      fileInputRef.current.files = dt.files;
      
      // ファイル選択イベントを発火
      handleFileSelect({ target: { files: dt.files } } as any);
    }
  };

  const pendingFiles = uploadingFiles.filter(f => f.status === 'pending');
  const successfulFiles = uploadingFiles.filter(f => f.status === 'success');

  return (
    <div className="space-y-4">
      {/* ファイル選択エリア */}
      <Card 
        className={`p-6 border-2 border-dashed transition-colors ${
          disabled 
            ? 'border-gray-200 bg-gray-50' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
        }`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <FaCloudArrowUp 
            size={48} 
            className={`mx-auto mb-4 ${disabled ? 'text-gray-300' : 'text-gray-400'}`} 
          />
          <div className="space-y-2">
            <p className={`text-lg font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
              {dict.dragAndDrop}
            </p>
            <p className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-500'}`}>
              {dict.or}
            </p>
            <Button
              color="primary"
              variant="flat"
              onPress={() => fileInputRef.current?.click()}
              isDisabled={disabled}
            >
              {dict.selectFile}
            </Button>
          </div>
          
          <div className={`mt-4 text-xs ${disabled ? 'text-gray-400' : 'text-gray-500'}`}>
            <p>{dict.maxFilesAndSize.replace('{maxFiles}', maxFiles.toString()).replace('{maxFileSize}', maxFileSize.toString())}</p>
            <p>{dict.supportedFormats}</p>
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedFileTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />
      </Card>

      {/* アップロード待ちファイル一覧 */}
      {pendingFiles.length > 0 && (
        <Card className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-gray-700">
              {dict.pendingFiles.replace('{count}', pendingFiles.length.toString())}
            </h4>
            <Button
              color="primary"
              size="sm"
              onPress={handleUpload}
              isLoading={isUploading}
              isDisabled={isUploading || disabled}
            >
              {isUploading ? dict.uploading : dict.uploadStart}
            </Button>
          </div>
          
          <div className="space-y-2">
            {pendingFiles.map((uploadingFile) => {
              const FileIcon = getFileIcon(uploadingFile.file.type);
              
              return (
                <div key={uploadingFile.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <FileIcon size={20} className="text-gray-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {uploadingFile.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(uploadingFile.file.size)}
                    </p>
                  </div>
                  
                  {uploadingFile.status === 'uploading' && (
                    <div className="w-24">
                      <Progress 
                        value={uploadingFile.progress} 
                        size="sm" 
                        color="primary"
                      />
                    </div>
                  )}
                  
                  <Button
                    size="sm"
                    variant="light"
                    color="danger"
                    isIconOnly
                    onPress={() => handleRemoveFile(uploadingFile.id)}
                    isDisabled={uploadingFile.status === 'uploading'}
                  >
                    <FaTrash size={12} />
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* アップロード済みファイル一覧 */}
      {successfulFiles.length > 0 && (
        <Card className="p-4">
          <h4 className="font-medium text-gray-700 mb-3">
            {dict.uploadedFiles.replace('{count}', successfulFiles.length.toString())}
          </h4>
          
          <div className="space-y-2">
            {successfulFiles.map((uploadingFile) => {
              const FileIcon = getFileIcon(uploadingFile.file.type);
              
              return (
                <div key={uploadingFile.id} className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                  <FileIcon size={20} className="text-green-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {uploadingFile.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(uploadingFile.file.size)} • {dict.uploadComplete}
                    </p>
                  </div>
                  
                  <FaCheck size={16} className="text-green-600" />
                  
                  <Button
                    size="sm"
                    variant="light"
                    color="danger"
                    isIconOnly
                    onPress={() => handleRemoveFile(uploadingFile.id)}
                    isDisabled={disabled}
                  >
                    <FaTrash size={12} />
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* エラーファイル一覧 */}
      {uploadingFiles.some(f => f.status === 'error') && (
        <Card className="p-4 border-red-200">
          <h4 className="font-medium text-red-700 mb-3 flex items-center gap-2">
            <FaTriangleExclamation size={16} />
            {dict.uploadError}
          </h4>
          
          <div className="space-y-2">
            {uploadingFiles
              .filter(f => f.status === 'error')
              .map((uploadingFile) => {
                const FileIcon = getFileIcon(uploadingFile.file.type);
                
                return (
                  <div key={uploadingFile.id} className="flex items-center gap-3 p-2 bg-red-50 rounded-lg">
                    <FileIcon size={20} className="text-red-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {uploadingFile.file.name}
                      </p>
                      <p className="text-xs text-red-600">
                        {uploadingFile.error || dict.uploadFailed}
                      </p>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="light"
                      color="danger"
                      isIconOnly
                      onPress={() => handleRemoveFile(uploadingFile.id)}
                    >
                      <FaTrash size={12} />
                    </Button>
                  </div>
                );
              })}
          </div>
        </Card>
      )}
    </div>
  );
}
