'use client'

import { useState } from 'react';
import { downloadFile } from '@/app/lib/actions/download-api';
import { FaDownload } from 'react-icons/fa';

interface FileDownloadButtonProps {
  fileKey: string;
  fileName?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function FileDownloadButton({ 
  fileKey, 
  fileName, 
  className,
  size = 'sm'
}: FileDownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (isDownloading) return;

    setIsDownloading(true);

    try {
      // Server Actionを呼び出してファイルをダウンロード
      const result = await downloadFile(fileKey);

      if (!result.success || !result.data) {
        alert(result.error || 'ダウンロードに失敗しました。');
        return;
      }

      const { content, fileName: downloadFileName, contentType } = result.data;

      // Base64をBlobに変換
      const byteCharacters = atob(content);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: contentType });

      // BlobからURLを作成
      const url = window.URL.createObjectURL(blob);

      // ダウンロードを開始
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || downloadFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // URLを解放
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Download error:', error);
      alert('ダウンロード中にエラーが発生しました。');
    } finally {
      setIsDownloading(false);
    }
  };

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5'
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className={className || `${sizeClasses[size]} text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0`}
      title={`${fileName || fileKey.split('/').pop()}をダウンロード`}
      aria-label={`${fileName || fileKey.split('/').pop()}をダウンロード`}
    >
      <FaDownload 
        size={iconSizes[size]} 
        className={isDownloading ? 'animate-pulse' : ''} 
      />
    </button>
  );
}

