'use client'

import { useState, useEffect } from "react"
import { Button, Card, Input, Textarea, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Select, SelectItem, Divider, CardBody, CardHeader, Alert, Spinner } from "@heroui/react"
import { Policy } from "@/app/lib/types/TypeAPIs"
import { updatePolicy, deletePolicy, startPolicyAnalysis } from "@/app/lib/actions/policy-api"
import { PolicyAnalysisEntry, setActivePolicyAnalysisAction } from "@/app/lib/actions/policy-analysis-actions"
import Link from "next/link"
import { UserAttributesDTO } from "@/app/lib/types/TypeAPIs"
import type { UserProfileLocale } from '@/app/dictionaries/user/user.d.ts';
import { RiEdit2Fill } from "react-icons/ri"
import { FaCheck, FaXmark, FaPlus, FaTrash, FaPlay, FaChartLine } from "react-icons/fa6"

// 拡張されたPolicy型（analysesを含む）
interface PolicyWithAnalyses extends Policy {
  analyses: PolicyAnalysisEntry[];
}

interface PolicyManagementPresentationProps {
  policies: PolicyWithAnalyses[];
  userAttributes: UserAttributesDTO;
  dictionary: UserProfileLocale;
  availableModels: { key: string; label: string; description: string }[];
}

// 編集可能なフィールドの型定義
type EditableField = 'policyName' | 'description';

// 一般的なファイル形式の選択肢
const commonFileTypes = [
  { key: 'image/jpeg', label: 'JPEG画像' },
  { key: 'image/png', label: 'PNG画像' },
  { key: 'image/gif', label: 'GIF画像' },
  { key: 'image/webp', label: 'WebP画像' },
  { key: 'application/pdf', label: 'PDFファイル' },
  { key: 'application/msword', label: 'Wordファイル (.doc)' },
  { key: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', label: 'Wordファイル (.docx)' },
  { key: 'application/vnd.ms-excel', label: 'Excelファイル (.xls)' },
  { key: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', label: 'Excelファイル (.xlsx)' },
  { key: 'text/plain', label: 'テキストファイル' },
  { key: 'text/csv', label: 'CSVファイル' },
  { key: 'application/json', label: 'JSONファイル' },
  { key: 'application/zip', label: 'ZIPファイル' },
  { key: 'video/mp4', label: 'MP4動画' },
  { key: 'audio/mpeg', label: 'MP3音声' },
];

// 個別フィールド更新関数
async function updateSingleFieldForPolicy(
  fieldName: EditableField,
  value: string | string[],
  targetPolicy: Policy
): Promise<{ success: boolean; message: string; errors?: Record<string, string>; updatedPolicy?: Policy }> {
  try {
    console.log('updateSingleFieldForPolicy called with:', { fieldName, value, policyId: targetPolicy.policyId });
    
    const input = {
      policyId: targetPolicy.policyId,
      [fieldName]: value,
    };

    console.log('Calling updatePolicy with:', input);
    const result = await updatePolicy(input);
    console.log('updatePolicy returned:', result);
    
    if (result.success) {
      return {
        success: true,
        message: result.message || `${fieldName}が正常に更新されました。`,
        updatedPolicy: result.data
      };
    } else {
      return {
        success: false,
        message: result.message || `${fieldName}の更新に失敗しました。`,
        errors: result.errors ? Object.fromEntries(
          Object.entries(result.errors).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value])
        ) : {},
      };
    }
  } catch (error: any) {
    console.error('Error in updateSingleFieldForPolicy:', error);
    return {
      success: false,
      message: error?.message || '更新処理でエラーが発生しました。',
      errors: { [fieldName]: error?.message || '更新処理でエラーが発生しました。' }
    };
  }
}

export default function PolicyManagementPresentation({ 
  policies: initialPolicies, 
  userAttributes, 
  dictionary,
  availableModels
}: PolicyManagementPresentationProps) {
  // ポリシー一覧の状態管理
  const [policies, setPolicies] = useState<PolicyWithAnalyses[]>(initialPolicies);
  
  // ポリシー選択とフィルタリング状態
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyWithAnalyses | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // PolicyAnalysis関連の状態
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [isStartingAnalysis, setIsStartingAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisSuccess, setAnalysisSuccess] = useState<string | null>(null);
  const [switchingAnalysisId, setSwitchingAnalysisId] = useState<string | null>(null);

  // クライアントサイドでのマウント確認
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // 各フィールドの編集状態管理
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [fieldValues, setFieldValues] = useState({
    policyName: "",
    description: "",
  });
  const [tempValues, setTempValues] = useState(fieldValues);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isUpdating, setIsUpdating] = useState(false);


  // 削除確認モーダルの状態管理
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure();
  const [policyToDelete, setPolicyToDelete] = useState<PolicyWithAnalyses | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ポリシー選択時にフィールド値を更新
  const selectPolicy = (policy: PolicyWithAnalyses) => {
    setSelectedPolicy(policy);
    const newFieldValues = {
      policyName: policy.policyName ?? "",
      description: policy.description ?? "",
    };
    setFieldValues(newFieldValues);
    setTempValues(newFieldValues);
    setEditingField(null);
    setFieldErrors({});
    setAnalysisError(null);
    setAnalysisSuccess(null);
    setSelectedModel('');
  };

  // 検索フィルタリング
  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.policyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // 編集開始
  const startEditing = (field: EditableField) => {
    setEditingField(field);
    setTempValues({ ...fieldValues });
    setFieldErrors({});
  };

  // 編集キャンセル
  const cancelEditing = () => {
    setEditingField(null);
    setTempValues(fieldValues);
    setFieldErrors({});
  };

  // バリデーション
  const validateField = (field: EditableField, value: string): string | null => {
    if (!value || !value.trim()) {
      return `${field === 'policyName' ? 'ポリシー名' : '説明'}は必須です。`;
    }
    return null;
  };

  // 更新実行
  const saveField = async (field: EditableField) => {
    if (!selectedPolicy) {
      setFieldErrors({ ...fieldErrors, [field]: 'ポリシーが選択されていません。' });
      return;
    }

    const value = tempValues[field];
    const error = validateField(field, value);
    
    if (error) {
      setFieldErrors({ ...fieldErrors, [field]: error });
      return;
    }

    setIsUpdating(true);
    setFieldErrors({ ...fieldErrors, [field]: '' });

    try {
      console.log('Updating field:', { field, value, policyId: selectedPolicy.policyId });
      const result = await updateSingleFieldForPolicy(field, value, selectedPolicy);
      console.log('Update result:', result);
      
      if (result.success && result.updatedPolicy) {
        // 成功時は表示値を更新し、編集モードを終了
        setFieldValues({ ...fieldValues, [field]: value });
        setEditingField(null);
        setTempValues({ ...tempValues, [field]: value });
        
        // 選択されたポリシー情報も更新（analysesプロパティを保持）
        const updatedPolicyWithAnalyses: PolicyWithAnalyses = {
          ...result.updatedPolicy,
          analyses: selectedPolicy.analyses
        };
        setSelectedPolicy(updatedPolicyWithAnalyses);
        
        // ポリシー一覧も更新
        setPolicies(policies.map(p => 
          p.policyId === result.updatedPolicy!.policyId ? {
            ...result.updatedPolicy!,
            analyses: p.analyses
          } : p
        ));
        
        console.log('Field updated successfully:', field);
      } else {
        // エラー時はエラーメッセージを表示
        const errorMessage = result.message || `${field}の更新に失敗しました。`;
        setFieldErrors({ ...fieldErrors, [field]: errorMessage });
        console.error('Update failed:', result);
      }
    } catch (error: any) {
      console.error('Update error:', error);
      const errorMessage = error?.message || '更新中にエラーが発生しました。';
      setFieldErrors({ ...fieldErrors, [field]: errorMessage });
    } finally {
      setIsUpdating(false);
    }
  };

  // 削除処理
  const handleDeletePolicy = async () => {
    if (!policyToDelete) return;

    setIsDeleting(true);

    try {
      const result = await deletePolicy(policyToDelete.policyId);

      if (result.success) {
        // 成功時はポリシー一覧から削除
        setPolicies(policies.filter(p => p.policyId !== policyToDelete.policyId));
        
        // 選択されたポリシーが削除対象の場合は選択を解除
        if (selectedPolicy?.policyId === policyToDelete.policyId) {
          setSelectedPolicy(null);
          setEditingField(null);
          setFieldErrors({});
        }
        
        // モーダルを閉じる
        onDeleteModalClose();
        setPolicyToDelete(null);
        
        console.log('Policy deleted successfully');
      } else {
        console.error('Delete failed:', result.message);
      }
    } catch (error: any) {
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // 削除確認モーダルを開く
  const openDeleteModal = (policy: PolicyWithAnalyses) => {
    setPolicyToDelete(policy);
    onDeleteModalOpen();
  };

  // PolicyAnalysis開始
  const handleStartAnalysis = async () => {
    if (!selectedPolicy || !selectedModel) {
      setAnalysisError('ポリシーとモデルを選択してください');
      return;
    }

    setIsStartingAnalysis(true);
    setAnalysisError(null);
    setAnalysisSuccess(null);

    try {
      const result = await startPolicyAnalysis(selectedPolicy.policyId, selectedModel);

      if (result.success && result.data) {
        // 成功時は選択されたポリシーのanalysesを更新
        const updatedPolicy = {
          ...selectedPolicy,
          analyses: [result.data, ...selectedPolicy.analyses]
        };
        setSelectedPolicy(updatedPolicy);
        
        // ポリシー一覧も更新
        setPolicies(policies.map(p => 
          p.policyId === selectedPolicy.policyId ? updatedPolicy : p
        ));
        
        setAnalysisSuccess('ポリシー分析を開始しました');
        setSelectedModel('');
      } else {
        setAnalysisError(result.message || 'ポリシー分析の開始に失敗しました');
      }
    } catch (error: any) {
      setAnalysisError('ポリシー分析の開始中にエラーが発生しました');
      console.error('Start analysis error:', error);
    } finally {
      setIsStartingAnalysis(false);
    }
  };

  // 分析ステータスのチップ表示
  const renderAnalysisStatusChip = (status: string) => {
    const statusConfig = {
      pending: { color: 'warning' as const, label: '待機中' },
      running: { color: 'primary' as const, label: '実行中' },
      completed: { color: 'success' as const, label: '完了' },
      failed: { color: 'danger' as const, label: '失敗' },
      cancelled: { color: 'default' as const, label: 'キャンセル' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Chip color={config.color} variant="flat" size="sm">
        {config.label}
      </Chip>
    );
  };

  // ポリシー分析の切り替え
  const handleSwitchAnalysis = async (analysisId: string) => {
    if (!selectedPolicy) return;

    setSwitchingAnalysisId(analysisId);
    setAnalysisError(null);
    setAnalysisSuccess(null);

    try {
      const result = await setActivePolicyAnalysisAction(analysisId);

      if (result.success) {
        // 成功時は選択されたポリシーの分析データを更新
        const updatedAnalyses = selectedPolicy.analyses.map(analysis => ({
          ...analysis,
          isActive: analysis.id === analysisId
        }));

        const updatedPolicy = {
          ...selectedPolicy,
          analyses: updatedAnalyses
        };
        setSelectedPolicy(updatedPolicy);

        // ポリシー一覧も更新
        setPolicies(policies.map(p => 
          p.policyId === selectedPolicy.policyId ? updatedPolicy : p
        ));

        setAnalysisSuccess('分析モデルを切り替えました');
      } else {
        setAnalysisError(result.message || '分析モデルの切り替えに失敗しました');
      }
    } catch (error: any) {
      setAnalysisError('分析モデルの切り替え中にエラーが発生しました');
      console.error('Switch analysis error:', error);
    } finally {
      setSwitchingAnalysisId(null);
    }
  };

  // 通知の自動クリア
  useEffect(() => {
    if (analysisError || analysisSuccess) {
      const timer = setTimeout(() => {
        setAnalysisError(null);
        setAnalysisSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [analysisError, analysisSuccess]);

  // フィールド表示コンポーネント
  const renderField = (
    field: EditableField,
    label: string,
    type: 'text' | 'textarea' = 'text'
  ) => {
    const isEditing = editingField === field;
    const value = isEditing ? tempValues[field] : fieldValues[field];
    const error = fieldErrors[field];

    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            {label}
            <span className="text-red-500 ml-1">*</span>
          </label>
          
          {/* 編集ボタンまたはアクションボタン */}
          <div className="flex gap-2">
            {!isEditing ? (
              <Button
                size="sm"
                variant="light"
                isIconOnly
                onPress={() => startEditing(field)}
                className="text-blue-600 hover:text-blue-800"
              >
                <RiEdit2Fill size={16} />
              </Button>
            ) : (
              <>
                <Button
                  size="sm"
                  color="success"
                  isIconOnly
                  onPress={() => saveField(field)}
                  isDisabled={isUpdating}
                  isLoading={isUpdating}
                >
                  <FaCheck size={12} />
                </Button>
                <Button
                  size="sm"
                  color="danger"
                  variant="light"
                  isIconOnly
                  onPress={cancelEditing}
                  isDisabled={isUpdating}
                >
                  <FaXmark size={12} />
                </Button>
              </>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="flex flex-col gap-2">
            {type === 'textarea' ? (
              <Textarea
                value={tempValues[field]}
                onValueChange={(val) => {
                  setTempValues({ ...tempValues, [field]: val });
                  if (fieldErrors[field]) {
                    setFieldErrors({ ...fieldErrors, [field]: '' });
                  }
                }}
                isDisabled={isUpdating}
                variant="bordered"
                placeholder={label}
                isInvalid={!!error}
                minRows={3}
              />
            ) : (
              <Input
                type="text"
                value={tempValues[field]}
                onValueChange={(val) => {
                  setTempValues({ ...tempValues, [field]: val });
                  if (fieldErrors[field]) {
                    setFieldErrors({ ...fieldErrors, [field]: '' });
                  }
                }}
                isDisabled={isUpdating}
                variant="bordered"
                placeholder={label}
                isInvalid={!!error}
              />
            )}
            
            {/* エラーメッセージを独立して表示 */}
            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-2 rounded-md border border-red-200">
                {error}
              </div>
            )}
          </div>
        ) : (
          <div className="p-3 bg-gray-50 rounded-md border">
            <span className="text-gray-900">
              {value || '未設定'}
            </span>
          </div>
        )}
      </div>
    );
  };

  // 読み取り専用フィールド表示コンポーネント（ファイル形式用）
  const renderReadOnlyFileTypes = (label: string, fileTypes: string[]) => {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            {label}
            <span className="ml-2 text-xs text-gray-500 font-normal">
              (変更不可)
            </span>
          </label>
        </div>
        <div className="p-3 bg-gray-50 rounded-md border">
          <div className="flex flex-wrap gap-2">
            {fileTypes.length > 0 ? (
              fileTypes.map((fileType) => (
                <Chip key={fileType} variant="flat" color="primary" size="sm">
                  {commonFileTypes.find(ft => ft.key === fileType)?.label || fileType}
                </Chip>
              ))
            ) : (
              <span className="text-gray-500">未設定</span>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          ※ 許可するファイル形式は変更できません。
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">ポリシー管理</h1>
          <Button
            color="primary"
            as={Link}
            href={`/${userAttributes.locale}/account/policy-management/create`}
            startContent={<FaPlus size={16} />}
            className="font-medium"
          >
            新しいポリシーを作成
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左側: ポリシー一覧 */}
          <Card className="lg:col-span-1 p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">ポリシー一覧 ({filteredPolicies.length}件)</h2>
            
            {/* 検索 */}
            <div className="mb-6">
              {isMounted ? (
                <Input
                  placeholder="ポリシー名、説明で検索..."
                  value={searchTerm}
                  onValueChange={setSearchTerm}
                  variant="bordered"
                />
              ) : (
                <div className="h-10 bg-gray-100 rounded-lg border border-gray-300 flex items-center px-3">
                  <span className="text-gray-500 text-sm">検索...</span>
                </div>
              )}
            </div>
            
            {/* ポリシーリスト */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredPolicies.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  ポリシーが見つかりません
                </div>
              ) : (
                filteredPolicies.map((policy) => (
                  <div
                    key={policy.policyId}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPolicy?.policyId === policy.policyId
                        ? 'bg-blue-50 border-blue-300'
                        : 'bg-white hover:bg-gray-50 border-gray-200'
                    }`}
                    onClick={() => selectPolicy(policy)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{policy.policyName}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{policy.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {policy.acceptedFileTypes.length}種類のファイル形式
                        </p>
                      </div>
                      <Button
                        size="sm"
                        color="danger"
                        variant="light"
                        isIconOnly
                        onPress={() => openDeleteModal(policy)}
                        className="ml-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FaTrash size={12} />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* 右側: ポリシー編集フォーム */}
          <Card className="lg:col-span-2 p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {selectedPolicy ? `${selectedPolicy.policyName} の編集` : 'ポリシーを選択してください'}
            </h2>
            
            {selectedPolicy ? (
              <div className="flex flex-col gap-6">
                {/* ポリシー名フィールド */}
                {renderField('policyName', 'ポリシー名')}

                {/* 説明フィールド */}
                {renderField('description', '説明', 'textarea')}

                {/* 許可ファイル形式フィールド（読み取り専用） */}
                {renderReadOnlyFileTypes('許可するファイル形式', selectedPolicy.acceptedFileTypes)}
                
                {/* ポリシー情報 */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">ポリシー情報</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>作成日: {new Date(selectedPolicy.createdAt).toLocaleDateString('ja-JP')}</p>
                    <p>更新日: {new Date(selectedPolicy.updatedAt).toLocaleDateString('ja-JP')}</p>
                    <p>ポリシーID: {selectedPolicy.policyId}</p>
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>左側のリストからポリシーを選択して編集を開始してください</p>
              </div>
            )}
          </Card>
        </div>

        {/* ポリシー分析セクション（選択されたポリシーがある場合のみ表示） */}
        {selectedPolicy && (
          <Card className="mt-8 shadow-lg">
            <CardHeader className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FaChartLine className="text-blue-600" />
                <h2 className="text-xl font-bold">
                  {selectedPolicy.policyName} の性能分析結果
                </h2>
              </div>
              <Chip color="primary" variant="flat">
                {selectedPolicy.analyses.length}件の分析結果
              </Chip>
            </CardHeader>
            <Divider />
            <CardBody>
              {/* 通知 */}
              {analysisError && (
                <Alert color="danger" title="エラー" description={analysisError} className="mb-4" />
              )}
              {analysisSuccess && (
                <Alert color="success" title="成功" description={analysisSuccess} className="mb-4" />
              )}
              {/* 分析結果テーブル（横長） */}
              <div>
                <h3 className="font-medium text-gray-800 mb-4">
                  AI性能分析結果
                </h3>
                {selectedPolicy.analyses.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <FaChartLine className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">分析結果がありません</p>
                    <p className="text-sm">このポリシーを使用したAI分析がまだ実行されていません。</p>
                    <p className="text-sm">上記のフォームから新しい分析を開始してください。</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table 
                      aria-label="ポリシー分析結果" 
                      selectionMode="none"
                      className="min-w-full"
                    >
                      <TableHeader>
                        <TableColumn className="min-w-[140px]">分析日時</TableColumn>
                        <TableColumn className="min-w-[160px]">使用モデル</TableColumn>
                        <TableColumn className="min-w-[100px]">ステータス</TableColumn>
                        <TableColumn className="min-w-[100px]">Top-1精度</TableColumn>
                        <TableColumn className="min-w-[100px]">欠陥検出率</TableColumn>
                        <TableColumn className="min-w-[100px]">F1スコア</TableColumn>
                        <TableColumn className="min-w-[120px]">レイテンシ(P95)</TableColumn>
                        <TableColumn className="min-w-[100px]">エラー率</TableColumn>
                        <TableColumn className="min-w-[120px]">レポート</TableColumn>
                        <TableColumn className="min-w-[120px]">使用状況</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {selectedPolicy.analyses.map((analysis) => (
                          <TableRow key={analysis.id}>
                            <TableCell>
                              <div className="text-sm">
                                {new Date(analysis.createdAt).toLocaleString('ja-JP', {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm font-medium">{analysis.model}</div>
                            </TableCell>
                            <TableCell>
                              {renderAnalysisStatusChip(analysis.status)}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm font-mono">
                                {analysis.top1Accuracy !== undefined 
                                  ? `${(analysis.top1Accuracy * 100).toFixed(1)}%` 
                                  : '-'}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm font-mono">
                                {analysis.recallDefect !== undefined 
                                  ? `${(analysis.recallDefect * 100).toFixed(1)}%` 
                                  : '-'}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm font-mono">
                                {analysis.f1Macro !== undefined 
                                  ? `${(analysis.f1Macro * 100).toFixed(1)}%` 
                                  : '-'}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm font-mono">
                                {analysis.latencyP95Ms !== undefined 
                                  ? `${analysis.latencyP95Ms.toFixed(0)}ms` 
                                  : '-'}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm font-mono">
                                {analysis.errorRate !== undefined 
                                  ? `${(analysis.errorRate * 100).toFixed(2)}%` 
                                  : '-'}
                              </div>
                            </TableCell>
                            <TableCell>
                              {analysis.reportUrl ? (
                                <Button
                                  size="sm"
                                  variant="light"
                                  color="primary"
                                  as="a"
                                  href={analysis.reportUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  レポート表示
                                </Button>
                              ) : (
                                <span className="text-gray-400 text-sm">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {analysis.status === 'completed' ? (
                                analysis.isActive ? (
                                  <Chip color="success" variant="flat" size="sm">
                                    使用中
                                  </Chip>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="light"
                                    color="primary"
                                    onPress={() => handleSwitchAnalysis(analysis.id)}
                                    isLoading={switchingAnalysisId === analysis.id}
                                    isDisabled={switchingAnalysisId !== null}
                                  >
                                    選択
                                  </Button>
                                )
                              ) : (
                                <span className="text-gray-400 text-sm">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        )}
      </div>


      {/* 削除確認モーダル */}
      <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose}>
        <ModalContent>
          <ModalHeader>ポリシーの削除</ModalHeader>
          <ModalBody>
            <p>
              「{policyToDelete?.policyName}」を削除してもよろしいですか？
            </p>
            <p className="text-sm text-gray-600">
              この操作は取り消すことができません。
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onPress={onDeleteModalClose}
              isDisabled={isDeleting}
            >
              キャンセル
            </Button>
            <Button
              color="danger"
              onPress={handleDeletePolicy}
              isLoading={isDeleting}
              isDisabled={isDeleting}
            >
              削除
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}