'use client'

import { useState, useEffect } from "react"
import { Button, Card, Input, Select, SelectItem, Chip } from "@heroui/react"
import { NewOrderRequest } from "@/app/lib/types/TypeAPIs"
import Link from "next/link"
import { UserAttributesDTO } from "@/app/lib/types/TypeAPIs"
import type { UserProfileLocale } from '@/app/dictionaries/user/user.d.ts';
import { FaPlus, FaRocket, FaEye, FaClock, FaCircleCheck, FaCircleExclamation } from "react-icons/fa6"

interface NewOrderManagementPresentationProps {
  newOrderRequests: NewOrderRequest[];
  userAttributes: UserAttributesDTO;
  dictionary: UserProfileLocale;
}

// データタイプのラベル
const dataTypeLabels = {
  'structured': '構造化データ',
  'unstructured': '非構造化データ',
  'mixed': '混合データ',
  'other': 'その他'
} as const;

// モデルタイプのラベル
const modelTypeLabels = {
  'classification': '分類モデル',
  'regression': '回帰モデル',
  'clustering': 'クラスタリング',
  'nlp': '自然言語処理',
  'computer_vision': 'コンピュータビジョン',
  'other': 'その他'
} as const;

// ステータスのラベルとアイコン
const statusConfig = {
  'open': { 
    label: '未着手', 
    color: 'danger' as const, 
    icon: FaCircleExclamation,
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200'
  },
  'in_progress': { 
    label: '進行中', 
    color: 'warning' as const, 
    icon: FaClock,
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    borderColor: 'border-yellow-200'
  },
  'resolved': { 
    label: '完了', 
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

export default function NewOrderManagementPresentation({ 
  newOrderRequests: initialNewOrderRequests, 
  userAttributes, 
  dictionary 
}: NewOrderManagementPresentationProps) {
  // 新規オーダーリクエスト一覧の状態管理
  const [newOrderRequests] = useState<NewOrderRequest[]>(initialNewOrderRequests);
  
  // フィルタリング状態
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved' | 'closed'>('all');
  const [dataTypeFilter, setDataTypeFilter] = useState<'all' | 'structured' | 'unstructured' | 'mixed' | 'other'>('all');
  const [modelTypeFilter, setModelTypeFilter] = useState<'all' | 'classification' | 'regression' | 'clustering' | 'nlp' | 'computer_vision' | 'other'>('all');
  const [isMounted, setIsMounted] = useState(false);

  // クライアントサイドでのマウント確認
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 検索・フィルタリング
  const filteredNewOrderRequests = newOrderRequests.filter(request => {
    const matchesSearch = request.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.userName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesDataType = dataTypeFilter === 'all' || request.dataType === dataTypeFilter;
    const matchesModelType = modelTypeFilter === 'all' || request.modelType === modelTypeFilter;
    
    return matchesSearch && matchesStatus && matchesDataType && matchesModelType;
  });

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
    const config = statusConfig[status];
    const Icon = config.icon;
    
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor} ${config.borderColor} border`}>
        <Icon size={12} />
        {config.label}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <FaRocket className="text-blue-600" size={32} />
            <h1 className="text-3xl font-bold">新規オーダー管理</h1>
          </div>
          <Button
            color="primary"
            as={Link}
            href={`/${userAttributes.locale}/account/new-order/create`}
            startContent={<FaPlus size={16} />}
            className="font-medium"
          >
            新しいオーダーを作成
          </Button>
        </div>
        
        {/* フィルター・検索エリア */}
        <Card className="p-6 mb-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 検索 */}
            <div>
              {isMounted ? (
                <Input
                  placeholder="件名、説明、ユーザー名で検索..."
                  value={searchTerm}
                  onValueChange={setSearchTerm}
                  variant="bordered"
                />
              ) : (
                <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
              )}
            </div>
            
            {/* ステータスフィルター */}
            <div>
              {isMounted ? (
                <Select
                  selectedKeys={[statusFilter]}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as typeof statusFilter;
                    setStatusFilter(selectedKey);
                  }}
                  variant="bordered"
                  placeholder="ステータスでフィルター"
                  classNames={{
                    listbox: "bg-white shadow-lg border border-gray-200",
                    popoverContent: "bg-white shadow-lg border border-gray-200"
                  }}
                >
                  <SelectItem key="all" className="bg-white hover:bg-gray-100">すべて</SelectItem>
                  <SelectItem key="open" className="bg-white hover:bg-gray-100">未着手</SelectItem>
                  <SelectItem key="in_progress" className="bg-white hover:bg-gray-100">進行中</SelectItem>
                  <SelectItem key="resolved" className="bg-white hover:bg-gray-100">完了</SelectItem>
                  <SelectItem key="closed" className="bg-white hover:bg-gray-100">クローズ</SelectItem>
                </Select>
              ) : (
                <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
              )}
            </div>
            
            {/* データタイプフィルター */}
            <div>
              {isMounted ? (
                <Select
                  selectedKeys={[dataTypeFilter]}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as typeof dataTypeFilter;
                    setDataTypeFilter(selectedKey);
                  }}
                  variant="bordered"
                  placeholder="データタイプでフィルター"
                  classNames={{
                    listbox: "bg-white shadow-lg border border-gray-200",
                    popoverContent: "bg-white shadow-lg border border-gray-200"
                  }}
                >
                  <SelectItem key="all" className="bg-white hover:bg-gray-100">すべて</SelectItem>
                  <SelectItem key="structured" className="bg-white hover:bg-gray-100">構造化データ</SelectItem>
                  <SelectItem key="unstructured" className="bg-white hover:bg-gray-100">非構造化データ</SelectItem>
                  <SelectItem key="mixed" className="bg-white hover:bg-gray-100">混合データ</SelectItem>
                  <SelectItem key="other" className="bg-white hover:bg-gray-100">その他</SelectItem>
                </Select>
              ) : (
                <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
              )}
            </div>
            
            {/* モデルタイプフィルター */}
            <div>
              {isMounted ? (
                <Select
                  selectedKeys={[modelTypeFilter]}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as typeof modelTypeFilter;
                    setModelTypeFilter(selectedKey);
                  }}
                  variant="bordered"
                  placeholder="モデルタイプでフィルター"
                  classNames={{
                    listbox: "bg-white shadow-lg border border-gray-200",
                    popoverContent: "bg-white shadow-lg border border-gray-200"
                  }}
                >
                  <SelectItem key="all" className="bg-white hover:bg-gray-100">すべて</SelectItem>
                  <SelectItem key="classification" className="bg-white hover:bg-gray-100">分類モデル</SelectItem>
                  <SelectItem key="regression" className="bg-white hover:bg-gray-100">回帰モデル</SelectItem>
                  <SelectItem key="clustering" className="bg-white hover:bg-gray-100">クラスタリング</SelectItem>
                  <SelectItem key="nlp" className="bg-white hover:bg-gray-100">自然言語処理</SelectItem>
                  <SelectItem key="computer_vision" className="bg-white hover:bg-gray-100">コンピュータビジョン</SelectItem>
                  <SelectItem key="other" className="bg-white hover:bg-gray-100">その他</SelectItem>
                </Select>
              ) : (
                <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
              )}
            </div>
          </div>
        </Card>

        {/* 新規オーダーリクエスト一覧 */}
        <Card className="p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              オーダー一覧 ({filteredNewOrderRequests.length}件)
            </h2>
          </div>
          
          {filteredNewOrderRequests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FaRocket size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">新規オーダーが見つかりません</p>
              <p className="text-sm">
                {newOrderRequests.length === 0 
                  ? '新しい新規オーダーを作成してください'
                  : '検索条件を変更してください'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNewOrderRequests.map((request) => (
                <div
                  key={request['neworder-requestId']}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg text-gray-900">
                          {request.subject}
                        </h3>
                        <StatusChip status={request.status} />
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span>データタイプ: {dataTypeLabels[request.dataType]}</span>
                        <span>モデルタイプ: {modelTypeLabels[request.modelType]}</span>
                        <span>作成者: {request.userName}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span>作成日: {formatDate(request.createdAt)}</span>
                        {request.updatedAt !== request.createdAt && (
                          <span>更新日: {formatDate(request.updatedAt)}</span>
                        )}
                      </div>
                      
                      <p className="text-gray-700 text-sm line-clamp-2 mb-3">
                        {request.description}
                      </p>
                      
                      {request.fileKeys.length > 0 && (
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs text-gray-500">添付ファイル:</span>
                          <Chip size="sm" variant="flat" color="primary">
                            {request.fileKeys.length}件
                          </Chip>
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4">
                      <Button
                        color="primary"
                        variant="flat"
                        size="sm"
                        as={Link}
                        href={`/${userAttributes.locale}/account/new-order/${request['neworder-requestId']}`}
                        startContent={<FaEye size={14} />}
                      >
                        詳細を見る
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 border-t pt-2">
                    オーダーID: {request['neworder-requestId']}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
