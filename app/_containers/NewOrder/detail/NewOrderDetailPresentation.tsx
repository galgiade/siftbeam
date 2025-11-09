'use client'

import { useState, useActionState, useEffect, startTransition, useCallback } from "react"
import { Button, Card, Textarea } from "@heroui/react"
import { NewOrderRequest, NewOrderReply } from "@/app/lib/types/TypeAPIs"
import { createNewOrderReply } from "@/app/lib/actions/neworder-api"
import { UserAttributesDTO } from "@/app/lib/types/TypeAPIs"
import type { NewOrderLocale } from '@/app/dictionaries/newOrder/newOrder.d.ts';
import type { CommonLocale } from '@/app/dictionaries/common/common.d';
import { useRouter } from "next/navigation"
import { FaPaperPlane, FaArrowLeft, FaClock, FaCircleCheck, FaCircleExclamation, FaUser, FaHeadset, FaFile, FaImage, FaVideo, FaMusic } from "react-icons/fa6"
import Link from "next/link"
import FileUploader from "@/app/_components/FileUploader"
import FileDownloadButton from "@/app/_components/FileDownloadButton"
import { v4 as uuidv4 } from 'uuid'

interface NewOrderDetailPresentationProps {
  newOrderRequest: NewOrderRequest;
  replies: NewOrderReply[];
  userAttributes: UserAttributesDTO;
  dictionary: NewOrderLocale;
  commonDictionary: CommonLocale;
}

// データタイプのラベルを取得する関数
const getDataTypeLabel = (dataType: string, dictionary: NewOrderLocale): string => {
  const labels: Record<string, string> = {
    'structured': dictionary.label.dataTypeStructured,
    'unstructured': dictionary.label.dataTypeUnstructured,
    'mixed': dictionary.label.dataTypeMixed,
    'other': dictionary.label.dataTypeOther
  };
  return labels[dataType] || dataType;
};

// モデルタイプのラベルを取得する関数
const getModelTypeLabel = (modelType: string, dictionary: NewOrderLocale): string => {
  const labels: Record<string, string> = {
    'classification': dictionary.label.modelTypeClassification,
    'regression': dictionary.label.modelTypeRegression,
    'clustering': dictionary.label.modelTypeClustering,
    'nlp': dictionary.label.modelTypeNLP,
    'computer_vision': dictionary.label.modelTypeComputerVision,
    'other': dictionary.label.modelTypeOther
  };
  return labels[modelType] || modelType;
};

// ステータスのラベルとアイコンを取得する関数
const getStatusConfig = (status: string, dictionary: NewOrderLocale) => {
  const configs: Record<string, any> = {
    'open': { 
      label: dictionary.label.statusOpen, 
      color: 'danger' as const, 
      icon: FaCircleExclamation,
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200'
    },
    'in_progress': { 
      label: dictionary.label.statusInProgress, 
      color: 'warning' as const, 
      icon: FaClock,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-200'
    },
    'resolved': { 
      label: dictionary.label.statusResolved, 
      color: 'success' as const, 
      icon: FaCircleCheck,
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200'
    },
    'closed': { 
      label: dictionary.label.statusClosed, 
      color: 'default' as const, 
      icon: FaCircleCheck,
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-700',
      borderColor: 'border-gray-200'
    }
  };
  return configs[status] || configs['open'];
};

// 送信者タイプのアイコンを取得する関数
const getSenderTypeConfig = (senderType: string, dictionary: NewOrderLocale) => {
  const configs: Record<string, any> = {
    'customer': { icon: FaUser, label: dictionary.label.customer, color: 'text-blue-600' },
    'support': { icon: FaHeadset, label: dictionary.label.support, color: 'text-green-600' },
    'admin': { icon: FaUser, label: dictionary.label.customerAdmin, color: 'text-purple-600' }
  };
  return configs[senderType] || configs['customer'];
};

// ファイルキーからファイル名を抽出する関数
const extractFileName = (fileKey: string): string => {
  // neworder/${customerId}/${neworder-requestId}/request/${timestamp}_${fileName}
  // neworder/${customerId}/${neworder-requestId}/reply/${neworder-replyId}/${timestamp}_${fileName}
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

export default function NewOrderDetailPresentation({ 
  newOrderRequest, 
  replies: initialReplies,
  userAttributes, 
  dictionary,
  commonDictionary
}: NewOrderDetailPresentationProps) {
  const router = useRouter();
  
  // 返信一覧の状態管理
  const [replies, setReplies] = useState<NewOrderReply[]>(initialReplies);
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
        const result = await createNewOrderReply({
          newOrderReplyId: replyId, // 事前生成されたUUID
          newOrderRequestId: newOrderRequest.newOrderRequestId,
          userId: userAttributes.sub,
          userName: userAttributes.preferred_username || dictionary.label.customer,
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
          message: error?.message || dictionary.alert.replyError,
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
  const StatusChip = ({ status }: { status: NewOrderRequest['status'] }) => {
    const config = getStatusConfig(status, dictionary);
    const Icon = config.icon;
    
    return (
      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.textColor} ${config.borderColor} border`}>
        <Icon size={14} />
        {config.label}
      </div>
    );
  };

  // 返信者アイコンコンポーネント
  const SenderIcon = ({ senderType }: { senderType: NewOrderReply['senderType'] }) => {
    const config = getSenderTypeConfig(senderType, dictionary);
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
      errors.message = dictionary.alert.messageRequired;
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
            href={`/${userAttributes.locale}/account/new-order`}
            startContent={<FaArrowLeft size={16} />}
          >
            {dictionary.label.backToList}
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{dictionary.label.newOrderDetail}</h1>
          </div>
        </div>

        {/* 新規オーダーリクエスト詳細 */}
        <Card className="p-6 mb-6 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold text-gray-900">
                  {newOrderRequest.subject}
                </h2>
                <StatusChip status={newOrderRequest.status} />
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                <span>{dictionary.label.dataType} {getDataTypeLabel(newOrderRequest.dataType, dictionary)}</span>
                <span>{dictionary.label.modelType} {getModelTypeLabel(newOrderRequest.modelType, dictionary)}</span>
                <span>{dictionary.label.creator} {newOrderRequest.userName}</span>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span>{dictionary.label.createdAt} {formatDate(newOrderRequest.createdAt)}</span>
                {newOrderRequest.updatedAt !== newOrderRequest.createdAt && (
                  <span>{dictionary.label.updatedAt} {formatDate(newOrderRequest.updatedAt)}</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">{dictionary.label.projectDetails}</h3>
            <div className="p-4 bg-gray-50 rounded-lg border">
              <p className="text-gray-900 whitespace-pre-wrap">{newOrderRequest.description}</p>
            </div>
          </div>
          
          {newOrderRequest.fileKeys.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">{dictionary.label.attachedFilesCount} ({newOrderRequest.fileKeys.length}{dictionary.label.filesCount})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {newOrderRequest.fileKeys.map((fileKey, index) => {
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
                          {dictionary.label.requestCreationTime}
                        </p>
                      </div>
                      <FileDownloadButton
                        fileKey={fileKey}
                        fileName={fileName}
                        size="md"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          <div className="text-xs text-gray-500 border-t pt-3">
            {dictionary.label.orderId} {newOrderRequest.newOrderRequestId}
          </div>
        </Card>

        {/* 返信一覧 */}
        <Card className="p-6 mb-6 shadow-lg">
          <h3 className="text-lg font-bold mb-4">
            {dictionary.label.communicationHistory} ({replies.length}{dictionary.label.filesCount})
          </h3>
          
          {replies.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>{dictionary.label.noConversation}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {replies.map((reply) => (
                <div key={reply.newOrderReplyId} className="flex gap-3">
                  <SenderIcon senderType={reply.senderType} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-gray-900">{reply.userName}</span>
                      <span className="text-xs text-gray-500">
                        {getSenderTypeConfig(reply.senderType, dictionary).label}
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
                          {dictionary.label.attachedFilesCount} ({reply.fileKeys.length}{dictionary.label.filesCount})
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
                                <FileDownloadButton
                                  fileKey={fileKey}
                                  fileName={fileName}
                                  size="sm"
                                />
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
        {newOrderRequest.status !== 'closed' && (
          <Card className="p-6 shadow-lg">
            <h3 className="text-lg font-bold mb-4">{dictionary.label.sendMessage}</h3>
            
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
                    placeholder={dictionary.label.messagePlaceholder}
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
                  {dictionary.label.fileAttachment}
                  <span className="text-gray-500 ml-2 text-xs">{dictionary.label.optionalLabel}</span>
                </label>
                <FileUploader
                  customerId={userAttributes.customerId}
                  userId={userAttributes.sub}
                  supportRequestId={newOrderRequest.newOrderRequestId}
                  context="reply" // リプライファイル
                  replyId={replyId} // 事前生成されたリプライUUID
                  onFilesUploaded={handleReplyFilesUploaded}
                  maxFiles={10}
                  maxFileSize={50}
                  disabled={isPending}
                  commonDictionary={commonDictionary}
                  uploadType="neworder"
                />
                {replyFileKeys.length > 0 && (
                  <p className="text-xs text-gray-600 mt-2">
                    {replyFileKeys.length}{dictionary.label.filesSelected}
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
                  <p className="text-green-700 text-sm">{dictionary.label.messageSent}</p>
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
                  {isPending ? dictionary.label.sending : dictionary.label.sendMessageButton}
                </Button>
              </div>
            </form>
          </Card>
        )}
        
        {newOrderRequest.status === 'closed' && (
          <Card className="p-6 shadow-lg">
            <div className="text-center py-8 text-gray-500">
              <FaCircleCheck size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">{dictionary.label.orderClosed}</p>
              <p className="text-sm">{dictionary.label.createNewOrderIfNeeded}</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
