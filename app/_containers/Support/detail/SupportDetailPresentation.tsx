'use client'

import { useState, useActionState, useEffect, startTransition, useCallback } from "react"
import { Button, Card, Textarea } from "@heroui/react"
import { SupportRequest, SupportReply } from "@/app/lib/types/TypeAPIs"
import { createSupportReply } from "@/app/lib/actions/support-api"
import { UserAttributesDTO } from "@/app/lib/types/TypeAPIs"
import type { UserProfileLocale } from '@/app/dictionaries/user/user.d.ts';
import { FaLifeRing, FaPaperPlane, FaArrowLeft, FaClock, FaCircleCheck, FaCircleExclamation, FaUser, FaHeadset, FaFile, FaImage, FaVideo, FaMusic } from "react-icons/fa6"
import Link from "next/link"
import FileUploader from "@/app/_components/FileUploader"
import { v4 as uuidv4 } from 'uuid'

interface SupportDetailPresentationProps {
  supportRequest: SupportRequest;
  replies: SupportReply[];
  userAttributes: UserAttributesDTO;
  dictionary: UserProfileLocale;
}

// 問題タイプのラベル
const issueTypeLabels = {
  'technical': '技術的な問題',
  'billing': '請求・支払い',
  'feature': '機能追加',
  'bug': 'バグ報告',
  'other': 'その他'
} as const;

// ステータスのラベルとアイコン
const statusConfig = {
  'open': { 
    label: '未対応', 
    color: 'danger' as const, 
    icon: FaCircleExclamation,
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200'
  },
  'in_progress': { 
    label: '対応中', 
    color: 'warning' as const, 
    icon: FaClock,
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    borderColor: 'border-yellow-200'
  },
  'resolved': { 
    label: '解決済み', 
    color: 'success' as const, 
    icon: FaCircleCheck,
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200'
  },
  'closed': { 
    label: 'クローズ', 
    color: 'default' as const, 
    icon: FaCircleCheck,
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-200'
  }
} as const;

// 送信者タイプのアイコン
const senderTypeConfig = {
  'customer': { icon: FaUser, label: 'お客様', color: 'text-blue-600' },
  'support': { icon: FaHeadset, label: 'サポート', color: 'text-green-600' },
  'admin': { icon: FaHeadset, label: '管理者', color: 'text-purple-600' }
} as const;

// ファイルキーからファイル名を抽出する関数
const extractFileName = (fileKey: string): string => {
  // support/${customerId}/${support-requestId}/request/${timestamp}_${fileName}
  // support/${customerId}/${support-requestId}/reply/${support-replyId}/${timestamp}_${fileName}
  const parts = fileKey.split('/');
  const fileNameWithTimestamp = parts[parts.length - 1];
  
  // タイムスタンプ部分を除去 (YYYYMMDD_HHMMSS_fileName -> fileName)
  const timestampMatch = fileNameWithTimestamp.match(/^\d{8}_\d{6}_(.+)$/);
  return timestampMatch ? timestampMatch[1] : fileNameWithTimestamp;
};

// ファイルタイプ別のアイコンを取得する関数
const getFileTypeIcon = (fileName: string) => {
  const extension = fileName.toLowerCase().split('.').pop();
  
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) {
    return { icon: FaImage, color: 'text-green-600' };
  }
  if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(extension || '')) {
    return { icon: FaFile, color: 'text-red-600' };
  }
  if (['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(extension || '')) {
    return { icon: FaVideo, color: 'text-purple-600' };
  }
  if (['mp3', 'wav', 'flac', 'aac'].includes(extension || '')) {
    return { icon: FaMusic, color: 'text-blue-600' };
  }
  
  return { icon: FaFile, color: 'text-gray-600' };
};

export default function SupportDetailPresentation({ 
  supportRequest, 
  replies: initialReplies,
  userAttributes, 
  dictionary 
}: SupportDetailPresentationProps) {
  
  // 返信一覧の状態管理
  const [replies, setReplies] = useState<SupportReply[]>(initialReplies);
  const [replyMessage, setReplyMessage] = useState("");
  const [replyFileKeys, setReplyFileKeys] = useState<string[]>([]);
  const [replyId, setReplyId] = useState(() => uuidv4()); // 初期化時にUUID生成
  const [replyError, setReplyError] = useState(""); // 返信エラーメッセージ
  
  // ハイドレーション対応
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ファイルアップロード完了ハンドラーをメモ化
  const handleReplyFilesUploaded = useCallback((fileKeys: string[]) => {
    setReplyFileKeys(fileKeys);
  }, []);

  // Server Actionの状態管理
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      try {
        const result = await createSupportReply({
          'support-replyId': replyId, // 事前生成されたUUID
          'support-requestId': supportRequest['support-requestId'],
          userId: userAttributes.sub,
          userName: userAttributes.preferred_username || 'ユーザー',
          senderType: 'customer' as const,
          message: formData.get('message') as string,
          fileKeys: JSON.parse(formData.get('replyFileKeys') as string || '[]'),
        });

        if (result.success && result.data) {
          // 返信が成功したら返信一覧を更新
          setReplies(prev => [...prev, result.data!]);
          setReplyMessage(""); // メッセージをクリア
          setReplyFileKeys([]); // ファイルキーをクリア
          setReplyId(uuidv4()); // 新しいリプライ用のUUIDを生成
          setReplyError(''); // エラーをクリア
        }

        return result;
      } catch (error: any) {
        return {
          success: false,
          message: error?.message || '返信送信中にエラーが発生しました。',
        };
      }
    },
    { success: false, message: '' }
  );

  // 日付フォーマット関数
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ステータスチップコンポーネント
  const StatusChip = ({ status }: { status: SupportRequest['status'] }) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    
    return (
      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.textColor} ${config.borderColor} border`}>
        <Icon size={14} />
        {config.label}
      </div>
    );
  };

  // 返信者アイコンコンポーネント
  const SenderIcon = ({ senderType }: { senderType: SupportReply['senderType'] }) => {
    const config = senderTypeConfig[senderType];
    const Icon = config.icon;
    
    return (
      <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 ${config.color}`}>
        <Icon size={16} />
      </div>
    );
  };

  // クライアントサイドバリデーション
  const validateReplyForm = (): boolean => {
    console.log('validateReplyForm called, replyMessage:', replyMessage);
    const errors: Record<string, string> = {};

    if (!replyMessage.trim()) {
      errors.message = 'メッセージを入力してください。';
      console.log('Validation error set:', errors.message);
    }

    if (Object.keys(errors).length > 0) {
      console.log('Setting replyError to:', errors.message);
      setReplyError(errors.message || '');
      return false;
    }
    
    return true;
  };

  // フォーム送信ハンドラー
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    console.log('=== handleSubmit called ===');
    console.log('replyMessage:', replyMessage);
    console.log('replyError before validation:', replyError);
    
    if (!validateReplyForm()) {
      console.log('❌ Validation failed');
      console.log('replyError after validation:', replyError);
      return;
    }
    
    console.log('✅ Validation passed');

    // FormDataを手動で作成
    const formDataObj = new FormData();
    formDataObj.set('message', replyMessage);
    formDataObj.set('replyFileKeys', JSON.stringify(replyFileKeys));
    
    // startTransition内でformActionを呼び出し
    startTransition(() => {
      formAction(formDataObj);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="light"
            as={Link}
            href={`/${userAttributes.locale}/account/support`}
            startContent={<FaArrowLeft size={16} />}
          >
            一覧に戻る
          </Button>
          <div className="flex items-center gap-3">
            <FaLifeRing className="text-blue-600" size={24} />
            <h1 className="text-2xl font-bold">サポートリクエスト詳細</h1>
          </div>
        </div>

        {/* サポートリクエスト詳細 */}
        <Card className="p-6 mb-6 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold text-gray-900">
                  {supportRequest.subject}
                </h2>
                <StatusChip status={supportRequest.status} />
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span>問題タイプ: {issueTypeLabels[supportRequest.issueType]}</span>
                <span>作成者: {supportRequest.userName}</span>
                <span>作成日: {formatDate(supportRequest.createdAt)}</span>
                {supportRequest.updatedAt !== supportRequest.createdAt && (
                  <span>更新日: {formatDate(supportRequest.updatedAt)}</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">問題の詳細</h3>
            <div className="p-4 bg-gray-50 rounded-lg border">
              <p className="text-gray-900 whitespace-pre-wrap">{supportRequest.description}</p>
            </div>
          </div>
          
          {supportRequest.fileKeys.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">添付ファイル ({supportRequest.fileKeys.length}件)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {supportRequest.fileKeys.map((fileKey, index) => {
                  const fileName = extractFileName(fileKey);
                  const { icon: FileIcon, color } = getFileTypeIcon(fileName);
                  
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                      <FileIcon size={20} className={`${color} flex-shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate" title={fileName}>
                          {fileName}
                        </p>
                        <p className="text-xs text-gray-500">
                          リクエスト作成時
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          <div className="text-xs text-gray-500 border-t pt-3">
            リクエストID: {supportRequest['support-requestId']}
          </div>
        </Card>

        {/* 返信一覧 */}
        <Card className="p-6 mb-6 shadow-lg">
          <h3 className="text-lg font-bold mb-4">
            返信履歴 ({replies.length}件)
          </h3>
          
          {replies.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>まだ返信がありません</p>
            </div>
          ) : (
            <div className="space-y-6">
              {replies.map((reply) => (
                <div key={reply['support-replyId']} className="flex gap-3">
                  <SenderIcon senderType={reply.senderType} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-gray-900">{reply.userName}</span>
                      <span className="text-xs text-gray-500">
                        {senderTypeConfig[reply.senderType].label}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(reply.createdAt)}
                      </span>
                    </div>
                    
                    {/* メッセージ部分 */}
                    {reply.message && (
                      <div className="p-3 bg-white border rounded-lg mb-3">
                        <p className="text-gray-900 whitespace-pre-wrap">{reply.message}</p>
                      </div>
                    )}
                    
                    {/* 添付ファイル部分 */}
                    {reply.fileKeys.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-medium text-gray-600">
                          添付ファイル ({reply.fileKeys.length}件)
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                          {reply.fileKeys.map((fileKey, index) => {
                            const fileName = extractFileName(fileKey);
                            const { icon: FileIcon, color } = getFileTypeIcon(fileName);
                            
                            return (
                              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
                                <FileIcon size={16} className={`${color} flex-shrink-0`} />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-gray-900 truncate" title={fileName}>
                                    {fileName}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* 返信フォーム */}
        {supportRequest.status !== 'closed' && (
          <Card className="p-6 shadow-lg">
            <h3 className="text-lg font-bold mb-4">返信を送信</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                {isMounted ? (
                  <Textarea
                    name="message"
                    value={replyMessage}
                    onValueChange={(value) => {
                      setReplyMessage(value);
                      // 入力時にエラーをクリア
                      if (replyError) {
                        setReplyError('');
                      }
                    }}
                    placeholder="返信メッセージを入力してください..."
                    variant="bordered"
                    minRows={4}
                    isRequired
                    isDisabled={isPending}
                    isInvalid={!!replyError}
                    errorMessage={replyError}
                  />
                ) : (
                  <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
                )}
              </div>
              
              {/* ファイル添付 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  ファイル添付
                  <span className="text-gray-500 ml-2 text-xs">(任意)</span>
                </label>
                <FileUploader
                  customerId={userAttributes.customerId}
                  userId={userAttributes.sub}
                  supportRequestId={supportRequest['support-requestId']}
                  context="reply" // リプライファイル
                  replyId={replyId} // 事前生成されたリプライUUID
                  onFilesUploaded={handleReplyFilesUploaded}
                  maxFiles={5}
                  maxFileSize={10}
                  disabled={isPending}
                />
                {replyFileKeys.length > 0 && (
                  <p className="text-xs text-gray-600 mt-2">
                    {replyFileKeys.length}個のファイルが選択されています
                  </p>
                )}
              </div>
              
              {/* エラーメッセージ */}
              {state.message && !state.success && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{state.message}</p>
                </div>
              )}
              
              {/* 成功メッセージ */}
              {state.success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm">返信が送信されました。</p>
                </div>
              )}
              
              <div className="flex justify-end">
                <Button
                  type="button"
                  color="primary"
                  startContent={!isPending ? <FaPaperPlane size={16} /> : undefined}
                  isLoading={isPending}
                  isDisabled={isPending}
                  onPress={() => handleSubmit()}
                >
                  {isPending ? '送信中...' : '返信を送信'}
                </Button>
              </div>
            </form>
          </Card>
        )}
        
        {supportRequest.status === 'closed' && (
          <Card className="p-6 shadow-lg">
            <div className="text-center py-8 text-gray-500">
              <FaCircleCheck size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">このサポートリクエストはクローズされています</p>
              <p className="text-sm">新しい問題がある場合は、新しいサポートリクエストを作成してください。</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
