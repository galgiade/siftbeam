"""
API Batch Upload の型定義
"""

from typing import TypedDict, List, Optional, Literal


class FileInfo(TypedDict):
    """アップロードするファイルの情報"""
    fileName: str
    contentType: str
    data: str  # Base64エンコード
    metadata: Optional[dict]


class NotificationConfig(TypedDict, total=False):
    """通知設定"""
    emails: List[str]
    webhookUrl: str
    notifyOnSuccess: bool
    notifyOnFailure: bool


class BatchUploadRequest(TypedDict):
    """バッチアップロードリクエスト"""
    policyId: str
    files: List[FileInfo]
    aiTrainingUsage: Optional[Literal['allow', 'deny']]
    notification: Optional[NotificationConfig]


class TriggerFile(TypedDict):
    """トリガーファイルの内容"""
    # 必須フィールド
    processing_historyId: str
    userId: str
    userName: str
    customerId: str
    policyId: str
    policyName: str
    uploadedFileKeys: List[str]
    aiTrainingUsage: Literal['allow', 'deny']
    
    # トリガー固有の情報
    triggerType: Literal['batch_upload_complete']
    fileCount: int
    expectedTotalSize: int
    triggerTimestamp: str
    
    # メタデータ
    metadata: dict


class TriggerMetadata(TypedDict, total=False):
    """トリガーファイルのメタデータ"""
    source: Literal['browser', 'api']
    userAgent: Optional[str]
    apiVersion: Optional[str]
    uploadDuration: Optional[float]  # 秒
    retryCount: int
    maxRetries: int

