'use client'

import { useState, useEffect } from "react"
import { Button, Card, Input, Select, SelectItem, Chip } from "@heroui/react"
import { NewOrderRequest } from "@/app/lib/types/TypeAPIs"
import Link from "next/link"
import { UserAttributesDTO } from "@/app/lib/types/TypeAPIs"
import type { NewOrderLocale } from '@/app/dictionaries/newOrder/newOrder.d.ts';
import { FaPlus, FaRocket, FaEye, FaClock, FaCircleCheck, FaCircleExclamation } from "react-icons/fa6"

interface NewOrderManagementPresentationProps {
  newOrderRequests: NewOrderRequest[];
  userAttributes: UserAttributesDTO;
  dictionary: NewOrderLocale;
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
    const config = getStatusConfig(status, dictionary);
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
            <h1 className="text-3xl font-bold">{dictionary.label.newOrderManagement}</h1>
          </div>
          <Button
            color="primary"
            as={Link}
            href={`/${userAttributes.locale}/account/new-order/create`}
            startContent={<FaPlus size={16} />}
            className="font-medium"
          >
            {dictionary.label.createNewOrder}
          </Button>
        </div>
        
        {/* フィルター・検索エリア */}
        <Card className="p-6 mb-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 検索 */}
            <div>
              {isMounted ? (
                <Input
                  placeholder={dictionary.label.searchPlaceholder}
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
                  placeholder={dictionary.label.filterByStatus}
                  classNames={{
                    listbox: "bg-white shadow-lg border border-gray-200",
                    popoverContent: "bg-white shadow-lg border border-gray-200"
                  }}
                >
                  <SelectItem key="all" className="bg-white hover:bg-gray-100">{dictionary.label.filterAll}</SelectItem>
                  <SelectItem key="open" className="bg-white hover:bg-gray-100">{dictionary.label.statusOpen}</SelectItem>
                  <SelectItem key="in_progress" className="bg-white hover:bg-gray-100">{dictionary.label.statusInProgress}</SelectItem>
                  <SelectItem key="resolved" className="bg-white hover:bg-gray-100">{dictionary.label.statusResolved}</SelectItem>
                  <SelectItem key="closed" className="bg-white hover:bg-gray-100">{dictionary.label.statusClosed}</SelectItem>
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
                  placeholder={dictionary.label.filterByDataType}
                  classNames={{
                    listbox: "bg-white shadow-lg border border-gray-200",
                    popoverContent: "bg-white shadow-lg border border-gray-200"
                  }}
                >
                  <SelectItem key="all" className="bg-white hover:bg-gray-100">{dictionary.label.filterAll}</SelectItem>
                  <SelectItem key="structured" className="bg-white hover:bg-gray-100">{dictionary.label.dataTypeStructured}</SelectItem>
                  <SelectItem key="unstructured" className="bg-white hover:bg-gray-100">{dictionary.label.dataTypeUnstructured}</SelectItem>
                  <SelectItem key="mixed" className="bg-white hover:bg-gray-100">{dictionary.label.dataTypeMixed}</SelectItem>
                  <SelectItem key="other" className="bg-white hover:bg-gray-100">{dictionary.label.dataTypeOther}</SelectItem>
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
                  placeholder={dictionary.label.filterByModelType}
                  classNames={{
                    listbox: "bg-white shadow-lg border border-gray-200",
                    popoverContent: "bg-white shadow-lg border border-gray-200"
                  }}
                >
                  <SelectItem key="all" className="bg-white hover:bg-gray-100">{dictionary.label.filterAll}</SelectItem>
                  <SelectItem key="classification" className="bg-white hover:bg-gray-100">{dictionary.label.modelTypeClassification}</SelectItem>
                  <SelectItem key="regression" className="bg-white hover:bg-gray-100">{dictionary.label.modelTypeRegression}</SelectItem>
                  <SelectItem key="clustering" className="bg-white hover:bg-gray-100">{dictionary.label.modelTypeClustering}</SelectItem>
                  <SelectItem key="nlp" className="bg-white hover:bg-gray-100">{dictionary.label.modelTypeNLP}</SelectItem>
                  <SelectItem key="computer_vision" className="bg-white hover:bg-gray-100">{dictionary.label.modelTypeComputerVision}</SelectItem>
                  <SelectItem key="other" className="bg-white hover:bg-gray-100">{dictionary.label.modelTypeOther}</SelectItem>
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
              {dictionary.label.orderList} ({filteredNewOrderRequests.length}{dictionary.label.orderListCount})
            </h2>
          </div>
          
          {filteredNewOrderRequests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FaRocket size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">{dictionary.label.noOrdersFound}</p>
              <p className="text-sm">
                {newOrderRequests.length === 0 
                  ? dictionary.label.createFirstOrder
                  : dictionary.label.changeSearchCriteria
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNewOrderRequests.map((request) => (
                <div
                  key={request.newOrderRequestId}
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
                        <span>{dictionary.label.dataType} {getDataTypeLabel(request.dataType, dictionary)}</span>
                        <span>モデルタイプ: {getModelTypeLabel(request.modelType, dictionary)}</span>
                        <span>{dictionary.label.creator} {request.userName}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span>{dictionary.label.createdAt} {formatDate(request.createdAt)}</span>
                        {request.updatedAt !== request.createdAt && (
                          <span>{dictionary.label.updatedAt} {formatDate(request.updatedAt)}</span>
                        )}
                      </div>
                      
                      <p className="text-gray-700 text-sm line-clamp-2 mb-3">
                        {request.description}
                      </p>
                      
                      {request.fileKeys.length > 0 && (
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs text-gray-500">{dictionary.label.attachedFiles}</span>
                          <Chip size="sm" variant="flat" color="primary">
                            {request.fileKeys.length}{dictionary.label.filesCount}
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
                        href={`/${userAttributes.locale}/account/new-order/${request.newOrderRequestId}`}
                        startContent={<FaEye size={14} />}
                      >
                        {dictionary.label.viewDetails}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 border-t pt-2">
                    {dictionary.label.orderId} {request.newOrderRequestId}
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
