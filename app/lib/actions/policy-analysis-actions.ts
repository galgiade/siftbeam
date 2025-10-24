'use server'

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand, GetCommand, UpdateCommand, DeleteCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';
import { getUserCustomAttributes } from '@/app/utils/cognito-utils';
import { logSuccessAction, logFailureAction } from './audit-log-actions';

const client = new DynamoDBClient({
  region: process.env.REGION || 'ap-northeast-1',
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});
const docClient = DynamoDBDocumentClient.from(client);

const POLICY_ANALYSIS_TABLE_NAME = process.env.POLICY_ANALYSIS_TABLE_NAME || 'siftbeam-policy-analysis';

export type AnalysisStatus = "pending" | "running" | "completed" | "failed" | "cancelled";

export interface PolicyAnalysisEntry {
  id: string;
  policyId: string;
  customerId: string;
  model: string; // モデル名とバージョン
  status: AnalysisStatus;
  isActive: boolean; // このポリシー分析が現在使用中かどうか
  
  // 分析結果（完了時のみ）
  top1Accuracy?: number;
  recallDefect?: number;
  f1Macro?: number;
  latencyP95Ms?: number;
  errorRate?: number;
  
  // メタデータ
  reportUrl?: string;
  
  // エラー情報（失敗時のみ）
  errorDetail?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface PolicyAnalysisResponse {
  success: boolean;
  message?: string;
  analysis?: PolicyAnalysisEntry;
  analyses?: PolicyAnalysisEntry[];
  lastEvaluatedKey?: Record<string, any>;
}

export interface CreatePolicyAnalysisRequest {
  policyId: string;
  model: string;
  isActive?: boolean;
}

export interface UpdatePolicyAnalysisRequest {
  id: string;
  status?: AnalysisStatus;
  top1Accuracy?: number;
  recallDefect?: number;
  f1Macro?: number;
  latencyP95Ms?: number;
  errorRate?: number;
  reportUrl?: string;
  errorDetail?: string;
}

export interface PolicyAnalysisFilter {
  policyId?: string;
  status?: AnalysisStatus;
  model?: string;
  startDate?: string;
  endDate?: string;
  searchText?: string; // model, reportUrl
}

/**
 * ポリシー分析を作成
 */
export async function createPolicyAnalysisAction(request: CreatePolicyAnalysisRequest): Promise<PolicyAnalysisResponse> {
  try {
    const userAttributes = await getUserCustomAttributes();
    if (!userAttributes || !userAttributes['custom:customerId']) {
      await logFailureAction('CREATE', 'PolicyAnalysis', 'User not authenticated or customer ID not found');
      return {
        success: false,
        message: 'User not authenticated or customer ID not found'
      };
    }

    const customerId = userAttributes['custom:customerId'];
    const timestamp = new Date().toISOString();
    const analysisId = uuidv4();

    const analysisEntry: PolicyAnalysisEntry = {
      id: analysisId,
      policyId: request.policyId,
      customerId,
      model: request.model,
      status: 'pending',
      isActive: request.isActive ?? false,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const command = new PutCommand({
      TableName: POLICY_ANALYSIS_TABLE_NAME,
      Item: analysisEntry,
      ConditionExpression: 'attribute_not_exists(id)', // 重複防止
    });

    await docClient.send(command);

    await logSuccessAction('CREATE', 'PolicyAnalysis', 'policyId', '', request.policyId);

    return {
      success: true,
      message: 'Policy analysis created successfully',
      analysis: analysisEntry
    };
  } catch (error: any) {
    console.error('Error creating policy analysis:', error);
    await logFailureAction('CREATE', 'PolicyAnalysis', error.message || 'Failed to create policy analysis');
    return {
      success: false,
      message: error.message || 'Failed to create policy analysis'
    };
  }
}

/**
 * 顧客IDでポリシー分析一覧を取得
 */
export async function getPolicyAnalysesByCustomerIdAction(
  limit: number = 20,
  lastEvaluatedKey?: Record<string, any>,
  filter?: PolicyAnalysisFilter
): Promise<PolicyAnalysisResponse> {
  try {
    const userAttributes = await getUserCustomAttributes();
    if (!userAttributes || !userAttributes['custom:customerId']) {
      return { success: false, message: 'Unauthorized access' };
    }

    const customerId = userAttributes['custom:customerId'];

    let filterExpression = '';
    const expressionAttributeValues: Record<string, any> = {};
    const expressionAttributeNames: Record<string, string> = {};

    // Base filter for customerId
    expressionAttributeValues[':customerId'] = customerId;

    // Optional filters
    if (filter?.policyId) {
      filterExpression += ' AND policyId = :policyId';
      expressionAttributeValues[':policyId'] = filter.policyId;
    }
    if (filter?.status) {
      filterExpression += ' AND #status = :status';
      expressionAttributeNames['#status'] = 'status';
      expressionAttributeValues[':status'] = filter.status;
    }
    if (filter?.model) {
      filterExpression += ' AND contains(#model, :model)';
      expressionAttributeNames['#model'] = 'model';
      expressionAttributeValues[':model'] = filter.model;
    }
    if (filter?.startDate) {
      filterExpression += ' AND createdAt >= :startDate';
      expressionAttributeValues[':startDate'] = filter.startDate;
    }
    if (filter?.endDate) {
      filterExpression += ' AND createdAt <= :endDate';
      expressionAttributeValues[':endDate'] = filter.endDate;
    }
    if (filter?.searchText) {
      const search = filter.searchText.toLowerCase();
      filterExpression += ` AND (contains(#model, :search) OR contains(reportUrl, :search))`;
      expressionAttributeNames['#model'] = 'model';
      expressionAttributeValues[':search'] = search;
    }

    const command = new ScanCommand({
      TableName: POLICY_ANALYSIS_TABLE_NAME,
      FilterExpression: `customerId = :customerId${filterExpression || ''}`,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined,
      Limit: limit,
      ExclusiveStartKey: lastEvaluatedKey,
    });

    const response = await docClient.send(command);

    await logSuccessAction('READ', 'PolicyAnalysis', 'count', '', String(response.Items?.length || 0));

    return {
      success: true,
      analyses: response.Items as PolicyAnalysisEntry[],
      lastEvaluatedKey: response.LastEvaluatedKey,
    };
  } catch (error: any) {
    console.error('Error fetching policy analyses by customer ID:', error);
    await logFailureAction('READ', 'PolicyAnalysis', error.message || 'Failed to fetch policy analyses');
    return { success: false, message: error.message || 'Failed to fetch policy analyses' };
  }
}

/**
 * ポリシーIDでポリシー分析一覧を取得
 */
export async function getPolicyAnalysesByPolicyIdAction(
  policyId: string,
  limit: number = 20,
  lastEvaluatedKey?: Record<string, any>
): Promise<PolicyAnalysisResponse> {
  try {
    const userAttributes = await getUserCustomAttributes();
    if (!userAttributes || !userAttributes['custom:customerId']) {
      return { success: false, message: 'Unauthorized access' };
    }

    const customerId = userAttributes['custom:customerId'];

    const command = new ScanCommand({
      TableName: POLICY_ANALYSIS_TABLE_NAME,
      FilterExpression: 'policyId = :policyId AND customerId = :customerId',
      ExpressionAttributeValues: {
        ':policyId': policyId,
        ':customerId': customerId,
      },
      Limit: limit,
      ExclusiveStartKey: lastEvaluatedKey,
    });

    const response = await docClient.send(command);

    await logSuccessAction('READ', 'PolicyAnalysis', 'count', '', String(response.Items?.length || 0));

    return {
      success: true,
      analyses: response.Items as PolicyAnalysisEntry[],
      lastEvaluatedKey: response.LastEvaluatedKey,
    };
  } catch (error: any) {
    console.error('Error fetching policy analyses by policy ID:', error);
    await logFailureAction('READ', 'PolicyAnalysis', error.message || 'Failed to fetch policy analyses');
    return { success: false, message: error.message || 'Failed to fetch policy analyses' };
  }
}

/**
 * 分析IDで単一のポリシー分析を取得
 */
export async function getPolicyAnalysisByIdAction(analysisId: string): Promise<PolicyAnalysisResponse> {
  try {
    const userAttributes = await getUserCustomAttributes();
    if (!userAttributes || !userAttributes['custom:customerId']) {
      return { success: false, message: 'Unauthorized access' };
    }

    const customerId = userAttributes['custom:customerId'];

    const command = new GetCommand({
      TableName: POLICY_ANALYSIS_TABLE_NAME,
      Key: {
        id: analysisId,
      },
    });

    const response = await docClient.send(command);

    if (!response.Item) {
      return { success: false, message: 'Policy analysis not found' };
    }

    const analysis = response.Item as PolicyAnalysisEntry;

    // 顧客IDの確認
    if (analysis.customerId !== customerId) {
      return { success: false, message: 'Unauthorized access to this policy analysis' };
    }

    await logSuccessAction('READ', 'PolicyAnalysis', 'id', '', analysisId);

    return { success: true, analysis };
  } catch (error: any) {
    console.error('Error fetching policy analysis by ID:', error);
    await logFailureAction('READ', 'PolicyAnalysis', error.message || 'Failed to fetch policy analysis');
    return { success: false, message: error.message || 'Failed to fetch policy analysis' };
  }
}

/**
 * ポリシー分析を更新
 */
export async function updatePolicyAnalysisAction(request: UpdatePolicyAnalysisRequest): Promise<PolicyAnalysisResponse> {
  try {
    const userAttributes = await getUserCustomAttributes();
    if (!userAttributes || !userAttributes['custom:customerId']) {
      await logFailureAction('UPDATE', 'PolicyAnalysis', 'User not authenticated or customer ID not found');
      return {
        success: false,
        message: 'User not authenticated or customer ID not found'
      };
    }

    const customerId = userAttributes['custom:customerId'];

    // 既存の分析を取得して権限確認
    const existingAnalysis = await getPolicyAnalysisByIdAction(request.id);
    if (!existingAnalysis.success || !existingAnalysis.analysis) {
      return existingAnalysis;
    }

    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    if (request.status !== undefined) {
      updateExpressions.push('#status = :status');
      expressionAttributeNames['#status'] = 'status';
      expressionAttributeValues[':status'] = request.status;
    }

    if (request.top1Accuracy !== undefined) {
      updateExpressions.push('top1Accuracy = :top1Accuracy');
      expressionAttributeValues[':top1Accuracy'] = request.top1Accuracy;
    }

    if (request.recallDefect !== undefined) {
      updateExpressions.push('recallDefect = :recallDefect');
      expressionAttributeValues[':recallDefect'] = request.recallDefect;
    }

    if (request.f1Macro !== undefined) {
      updateExpressions.push('f1Macro = :f1Macro');
      expressionAttributeValues[':f1Macro'] = request.f1Macro;
    }

    if (request.latencyP95Ms !== undefined) {
      updateExpressions.push('latencyP95Ms = :latencyP95Ms');
      expressionAttributeValues[':latencyP95Ms'] = request.latencyP95Ms;
    }

    if (request.errorRate !== undefined) {
      updateExpressions.push('errorRate = :errorRate');
      expressionAttributeValues[':errorRate'] = request.errorRate;
    }

    if (request.reportUrl !== undefined) {
      updateExpressions.push('reportUrl = :reportUrl');
      expressionAttributeValues[':reportUrl'] = request.reportUrl;
    }

    if (request.errorDetail !== undefined) {
      updateExpressions.push('errorDetail = :errorDetail');
      expressionAttributeValues[':errorDetail'] = request.errorDetail;
    }

    if (updateExpressions.length === 0) {
      return { success: false, message: 'No fields to update' };
    }

    updateExpressions.push('updatedAt = :updatedAt');
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const command = new UpdateCommand({
      TableName: POLICY_ANALYSIS_TABLE_NAME,
      Key: { id: request.id },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined,
      ExpressionAttributeValues: expressionAttributeValues,
      ConditionExpression: 'customerId = :customerId',
      ReturnValues: 'ALL_NEW',
    });

    expressionAttributeValues[':customerId'] = customerId;

    const response = await docClient.send(command);

    await logSuccessAction('UPDATE', 'PolicyAnalysis', 'multiple', JSON.stringify(existingAnalysis.analysis), JSON.stringify(response.Attributes));

    return {
      success: true,
      message: 'Policy analysis updated successfully',
      analysis: response.Attributes as PolicyAnalysisEntry
    };
  } catch (error: any) {
    console.error('Error updating policy analysis:', error);
    await logFailureAction('UPDATE', 'PolicyAnalysis', error.message || 'Failed to update policy analysis');
    return {
      success: false,
      message: error.message || 'Failed to update policy analysis'
    };
  }
}

/**
 * ポリシー分析を削除
 */
export async function deletePolicyAnalysisAction(analysisId: string): Promise<PolicyAnalysisResponse> {
  try {
    const userAttributes = await getUserCustomAttributes();
    if (!userAttributes || !userAttributes['custom:customerId']) {
      await logFailureAction('DELETE', 'PolicyAnalysis', 'User not authenticated or customer ID not found');
      return {
        success: false,
        message: 'User not authenticated or customer ID not found'
      };
    }

    const customerId = userAttributes['custom:customerId'];

    // 既存の分析を取得して権限確認
    const existingAnalysis = await getPolicyAnalysisByIdAction(analysisId);
    if (!existingAnalysis.success || !existingAnalysis.analysis) {
      return existingAnalysis;
    }

    const command = new DeleteCommand({
      TableName: POLICY_ANALYSIS_TABLE_NAME,
      Key: { id: analysisId },
      ConditionExpression: 'customerId = :customerId',
      ExpressionAttributeValues: {
        ':customerId': customerId,
      },
    });

    await docClient.send(command);

    await logSuccessAction('DELETE', 'PolicyAnalysis', 'id', analysisId, '');

    return {
      success: true,
      message: 'Policy analysis deleted successfully'
    };
  } catch (error: any) {
    console.error('Error deleting policy analysis:', error);
    await logFailureAction('DELETE', 'PolicyAnalysis', error.message || 'Failed to delete policy analysis');
    return {
      success: false,
      message: error.message || 'Failed to delete policy analysis'
    };
  }
}

/**
 * ポリシー分析のステータスを更新（実行開始、完了、失敗など）
 */
export async function updatePolicyAnalysisStatusAction(
  analysisId: string, 
  status: AnalysisStatus, 
  errorDetail?: string
): Promise<PolicyAnalysisResponse> {
  try {
    const updateRequest: UpdatePolicyAnalysisRequest = {
      id: analysisId,
      status,
      errorDetail
    };

    return await updatePolicyAnalysisAction(updateRequest);
  } catch (error: any) {
    console.error('Error updating policy analysis status:', error);
    await logFailureAction('UPDATE', 'PolicyAnalysis', error.message || 'Failed to update policy analysis status');
    return {
      success: false,
      message: error.message || 'Failed to update policy analysis status'
    };
  }
}

/**
 * ポリシー分析の結果を更新（分析完了時）
 */
export async function updatePolicyAnalysisResultsAction(
  analysisId: string,
  results: {
    top1Accuracy: number;
    recallDefect: number;
    f1Macro: number;
    latencyP95Ms: number;
    errorRate: number;
    reportUrl?: string;
  }
): Promise<PolicyAnalysisResponse> {
  try {
    const updateRequest: UpdatePolicyAnalysisRequest = {
      id: analysisId,
      status: 'completed',
      ...results
    };

    return await updatePolicyAnalysisAction(updateRequest);
  } catch (error: any) {
    console.error('Error updating policy analysis results:', error);
    await logFailureAction('UPDATE', 'PolicyAnalysis', error.message || 'Failed to update policy analysis results');
    return {
      success: false,
      message: error.message || 'Failed to update policy analysis results'
    };
  }
}

/**
 * 管理者用：全ポリシー分析を取得（管理者のみ）
 */
export async function getAllPolicyAnalysesAction(
  limit: number = 50,
  lastEvaluatedKey?: Record<string, any>
): Promise<PolicyAnalysisResponse> {
  try {
    const userAttributes = await getUserCustomAttributes();
    if (!userAttributes || userAttributes['custom:role'] !== 'admin') {
      await logFailureAction('READ', 'PolicyAnalysis', 'Admin access required');
      return { success: false, message: 'Admin access required' };
    }

    const command = new ScanCommand({
      TableName: POLICY_ANALYSIS_TABLE_NAME,
      Limit: limit,
      ExclusiveStartKey: lastEvaluatedKey,
    });

    const response = await docClient.send(command);

    await logSuccessAction('READ', 'PolicyAnalysis', 'count', '', String(response.Items?.length || 0));

    return {
      success: true,
      analyses: response.Items as PolicyAnalysisEntry[],
      lastEvaluatedKey: response.LastEvaluatedKey,
    };
  } catch (error: any) {
    console.error('Error fetching all policy analyses:', error);
    await logFailureAction('READ', 'PolicyAnalysis', error.message || 'Failed to fetch all policy analyses');
    return { success: false, message: error.message || 'Failed to fetch all policy analyses' };
  }
}

/**
 * ステータス別ポリシー分析を取得
 */
export async function getPolicyAnalysesByStatusAction(
  status: AnalysisStatus,
  limit: number = 20,
  lastEvaluatedKey?: Record<string, any>
): Promise<PolicyAnalysisResponse> {
  try {
    const userAttributes = await getUserCustomAttributes();
    if (!userAttributes || !userAttributes['custom:customerId']) {
      return { success: false, message: 'Unauthorized access' };
    }

    const customerId = userAttributes['custom:customerId'];

    const command = new QueryCommand({
      TableName: POLICY_ANALYSIS_TABLE_NAME,
      IndexName: 'status-customerId-index',
      KeyConditionExpression: '#status = :status AND customerId = :customerId',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':status': status,
        ':customerId': customerId,
      },
      Limit: limit,
      ExclusiveStartKey: lastEvaluatedKey,
      ScanIndexForward: false,
    });

    const response = await docClient.send(command);

    await logSuccessAction('READ', 'PolicyAnalysis', 'count', '', String(response.Items?.length || 0));

    return {
      success: true,
      analyses: response.Items as PolicyAnalysisEntry[],
      lastEvaluatedKey: response.LastEvaluatedKey,
    };
  } catch (error: any) {
    console.error('Error fetching policy analyses by status:', error);
    await logFailureAction('READ', 'PolicyAnalysis', error.message || 'Failed to fetch policy analyses by status');
    return { success: false, message: error.message || 'Failed to fetch policy analyses by status' };
  }
}

/**
 * ポリシー分析をアクティブに設定（他の分析を非アクティブにする）
 */
export async function setActivePolicyAnalysisAction(analysisId: string): Promise<PolicyAnalysisResponse> {
  try {
    const userAttributes = await getUserCustomAttributes();
    if (!userAttributes || !userAttributes['custom:customerId']) {
      return { success: false, message: 'Unauthorized access' };
    }

    const customerId = userAttributes['custom:customerId'];

    // 1. 指定された分析を取得して、policyIdを確認
    const getCommand = new GetCommand({
      TableName: POLICY_ANALYSIS_TABLE_NAME,
      Key: { id: analysisId }
    });

    const getResponse = await docClient.send(getCommand);
    const targetAnalysis = getResponse.Item as PolicyAnalysisEntry;

    if (!targetAnalysis) {
      return { success: false, message: 'Policy analysis not found' };
    }

    if (targetAnalysis.customerId !== customerId) {
      return { success: false, message: 'Unauthorized access to this analysis' };
    }

    // 2. 同じpolicyIdの全ての分析を非アクティブにする
    const scanCommand = new ScanCommand({
      TableName: POLICY_ANALYSIS_TABLE_NAME,
      FilterExpression: 'policyId = :policyId AND customerId = :customerId',
      ExpressionAttributeValues: {
        ':policyId': targetAnalysis.policyId,
        ':customerId': customerId
      }
    });

    const scanResponse = await docClient.send(scanCommand);
    const allAnalyses = scanResponse.Items as PolicyAnalysisEntry[];

    // 3. 全ての分析を非アクティブにする（バッチ処理）
    const updatePromises = allAnalyses.map(async (analysis) => {
      const updateCommand = new UpdateCommand({
        TableName: POLICY_ANALYSIS_TABLE_NAME,
        Key: { id: analysis.id },
        UpdateExpression: 'SET isActive = :isActive, updatedAt = :updatedAt',
        ExpressionAttributeValues: {
          ':isActive': analysis.id === analysisId, // 指定されたIDのみアクティブ
          ':updatedAt': new Date().toISOString()
        }
      });
      return docClient.send(updateCommand);
    });

    await Promise.all(updatePromises);

    // 4. 更新された分析を取得
    const updatedGetResponse = await docClient.send(getCommand);
    const updatedAnalysis = updatedGetResponse.Item as PolicyAnalysisEntry;

    await logSuccessAction('UPDATE', 'PolicyAnalysis', 'isActive', 'false', 'true');

    return {
      success: true,
      message: 'Policy analysis activated successfully',
      analysis: updatedAnalysis
    };
  } catch (error: any) {
    console.error('Error setting active policy analysis:', error);
    await logFailureAction('UPDATE', 'PolicyAnalysis', error.message || 'Failed to set active policy analysis');
    return { success: false, message: error.message || 'Failed to set active policy analysis' };
  }
}
