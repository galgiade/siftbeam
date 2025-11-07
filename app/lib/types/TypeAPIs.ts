export interface UserAttributesDTO {
  sub: string;
  preferred_username: string;
  customerId: string;
  role: string;
  locale: string;
  paymentMethodId?: string;
  deletionRequestedAt?: string;
}

export interface User {
  userId: string; // DynamoDBのパーティションキー
  userName: string;
  email: string;
  customerId: string;
  department: string;
  position: string;
  role: string;
  locale?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface Policy {
  policyId: string; // DynamoDBのパーティションキー
  policyName: string;
  description: string;
  customerId: string;
  acceptedFileTypes: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string; // ソフト削除用
}

export interface Group {
  groupId: string; // DynamoDBのパーティションキー
  groupName: string;
  description: string;
  customerId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string; // ソフト削除用
}

export interface UserGroup {
  userGroupId: string; // DynamoDBのパーティションキー
  userId: string;
  groupId: string;
  customerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PolicyGroup {
  policyGroupId: string; // DynamoDBのパーティションキー
  groupId: string;
  policyId: string;
  customerId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * サポートリクエストの型定義
 */
export interface SupportRequest {
  supportRequestId: string; // DynamoDBのパーティションキー
  customerId: string;
  userId: string;
  userName: string;
  issueType: 'technical' | 'billing' | 'feature' | 'bug' | 'other';
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  fileKeys: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * サポート返信の型定義
 */
export interface SupportReply {
  supportReplyId: string; // DynamoDBのパーティションキー
  supportRequestId: string;
  userId: string;
  userName: string;
  senderType: 'customer' | 'support' | 'admin';
  message: string;
  fileKeys: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * 新規オーダーリクエストの型定義
 */
export interface NewOrderRequest {
  newOrderRequestId: string; // DynamoDBのパーティションキー
  customerId: string;
  userId: string;
  userName: string;
  dataType: 'structured' | 'unstructured' | 'mixed' | 'other';
  modelType: 'classification' | 'regression' | 'clustering' | 'nlp' | 'computer_vision' | 'other';
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  fileKeys: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * 新規オーダー返信の型定義
 */
export interface NewOrderReply {
  newOrderReplyId: string; // DynamoDBのパーティションキー
  newOrderRequestId: string;
  userId: string;
  userName: string;
  senderType: 'customer' | 'support' | 'admin';
  message: string;
  fileKeys: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string; // 後方互換性のため残す（非推奨）
  errorCode?: string; // 'user.createFailed', 'auth.notAuthenticated' など
  errorDetails?: Record<string, any>; // 動的な値（{field: 'email', count: 5}など）
  errors?: Record<string, string[]>; // フィールドごとのエラー（バリデーション用）
  verificationId?: string; // 2段階認証用
  email?: string; // 2段階認証用
  debugMessage?: string; // 開発者向けメッセージ（本番では非表示推奨）
}