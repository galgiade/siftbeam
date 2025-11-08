'use client'

import { useState, useEffect } from 'react';
import { Card, CardBody, Select, SelectItem, Chip, Spinner } from '@heroui/react';
import { FaCog, FaFileAlt, FaCheckCircle } from 'react-icons/fa';
import type { ServiceLocale } from '@/app/dictionaries/service/ServiceLocale.d.ts';

interface Policy {
  id: string;
  policyName: string;
  description?: string;
  acceptedFileTypes: string[];
}

interface PolicySelectorProps {
  customerId: string;
  userId: string;
  onPolicySelected: (policyId: string, policyName: string) => void;
  dictionary: ServiceLocale;
}

/**
 * ポリシー選択コンポーネント
 */
export default function PolicySelector({ 
  customerId, 
  userId, 
  onPolicySelected, 
  dictionary 
}: PolicySelectorProps) {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // ポリシーAPIから取得
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        setLoading(true);
        
        // 実際のポリシーAPIから取得（policy-api.tsのqueryPoliciesを使用）
        const { queryPolicies } = await import('@/app/lib/actions/policy-api');
        const result = await queryPolicies({ customerId });
        
        if (result.success && result.data) {
          const formattedPolicies: Policy[] = result.data.policies.map(p => ({
            id: p.policyId,
            policyName: p.policyName,
            description: p.description,
            acceptedFileTypes: p.acceptedFileTypes
          }));
          setPolicies(formattedPolicies);
          setError('');
        } else {
          setError(dictionary.error.policiesFetchFailed);
        }
      } catch (err: any) {
        console.error('Policy fetch error:', err);
        setError(dictionary.error.policiesFetchFailed);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, [customerId, userId, dictionary]);

  const handlePolicyChange = (policyId: string) => {
    const policy = policies.find(p => p.id === policyId);
    if (policy) {
      setSelectedPolicy(policy);
      onPolicySelected(policy.id, policy.policyName);
    }
  };

  const formatFileTypes = (fileTypes: string[]): string => {
    return fileTypes
      .map(type => {
        // MIMEタイプを読みやすい形式に変換
        if (type.startsWith('image/')) return type.replace('image/', '').toUpperCase();
        if (type.startsWith('text/')) return type.replace('text/', '').toUpperCase();
        if (type.includes('json')) return 'JSON';
        if (type.includes('excel')) return 'Excel';
        return type;
      })
      .join(', ');
  };

  if (loading) {
    return (
      <Card>
        <CardBody className="text-center p-8">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">{dictionary.page.loading}</p>
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-danger-200 bg-danger-50">
        <CardBody className="text-center p-6">
          <FaCog className="text-4xl text-danger-500 mx-auto mb-4" />
          <p className="text-danger-700">{error}</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* ポリシー選択 */}
      <Select
        label="処理ポリシーを選択"
        placeholder="ポリシーを選択してください"
        selectedKeys={selectedPolicy ? [selectedPolicy.id] : []}
        onSelectionChange={(keys) => {
          const selectedKey = Array.from(keys)[0] as string;
          if (selectedKey) {
            handlePolicyChange(selectedKey);
          }
        }}
        startContent={<FaCog className="text-primary" />}
        size="lg"
      >
        {policies.map((policy) => (
          <SelectItem key={policy.id}>
            <div className="flex flex-col">
              <span className="font-medium">{policy.policyName}</span>
              {policy.description && (
                <span className="text-sm text-gray-500">{policy.description}</span>
              )}
            </div>
          </SelectItem>
        ))}
      </Select>

      {/* 選択されたポリシーの詳細 */}
      {selectedPolicy && (
        <Card className="bg-primary-50 border-primary-200">
          <CardBody className="p-4">
            <div className="flex items-start gap-3">
              <FaCheckCircle className="text-primary text-xl mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold text-primary-800 mb-2">
                  {selectedPolicy.policyName}
                </h4>
                
                {selectedPolicy.description && (
                  <p className="text-sm text-primary-700 mb-3">
                    {selectedPolicy.description}
                  </p>
                )}
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FaFileAlt className="text-primary-600" />
                    <span className="text-sm font-medium text-primary-800">
                      対応ファイル形式:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedPolicy.acceptedFileTypes.map((fileType, index) => (
                      <Chip
                        key={index}
                        size="sm"
                        color="primary"
                        variant="flat"
                      >
                        {fileType.startsWith('image/') ? fileType.replace('image/', '').toUpperCase() :
                         fileType.startsWith('text/') ? fileType.replace('text/', '').toUpperCase() :
                         fileType.includes('json') ? 'JSON' :
                         fileType.includes('excel') ? 'Excel' :
                         fileType}
                      </Chip>
                    ))}
                  </div>
                </div>
                
                <div className="mt-3 p-3 bg-primary-100 rounded-lg">
                  <p className="text-xs text-primary-700">
                    💡 このポリシーを選択すると、対応するファイル形式のみアップロード可能になります。
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* ポリシー一覧（選択されていない場合） */}
      {!selectedPolicy && policies.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {policies.map((policy) => (
            <Card 
              key={policy.id}
              isPressable
              onPress={() => handlePolicyChange(policy.id)}
              className="hover:bg-gray-50 transition-colors"
            >
              <CardBody className="p-4">
                <div className="flex items-start gap-3">
                  <FaCog className="text-primary text-lg mt-1" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {policy.policyName}
                    </h4>
                    {policy.description && (
                      <p className="text-sm text-gray-600 mb-2">
                        {policy.description}
                      </p>
                    )}
                    <div className="text-xs text-gray-500">
                      対応形式: {formatFileTypes(policy.acceptedFileTypes)}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
