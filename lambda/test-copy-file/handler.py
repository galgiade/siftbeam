"""
TestCopyFile Lambda Function

テスト用: S3の入力ファイルを出力パスにコピーする

処理フロー:
1. 入力S3キーからファイルを取得
2. 出力S3キーにコピー
3. 結果を返す

S3パス構造 (タイムスタンプなし):
- 入力: service/input/{customerId}/{processingHistoryId}/{fileName}
- 出力: service/output/{customerId}/{processingHistoryId}/{fileName}

注: processingHistoryIdで一意性が保証されるため、タイムスタンプは不要
"""

import boto3
import os
import logging
from typing import Dict, Any
from datetime import datetime, timezone

# ロガー設定
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# AWS クライアント
s3_client = boto3.client('s3')

# 環境変数
S3_BUCKET = os.environ.get('S3_BUCKET', 'siftbeam')


def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    S3ファイルをコピーするLambda関数
    
    Args:
        event: {
            "inputS3Bucket": "siftbeam",
            "inputS3Key": "service/input/{customerId}/{processingHistoryId}/{filename}",
            "outputS3Key": "service/output/{customerId}/{processingHistoryId}/{filename}",
            "processingHistoryId": "xxx",
            "customerId": "cus_xxx",
            "userId": "user_xxx",
            "policyId": "policy_xxx"
        }
        context: Lambda context
    
    Returns:
        {
            "statusCode": 200,
            "outputS3Key": "service/output/...",
            "fileSizeBytes": 1024,
            "message": "ファイルコピー完了"
        }
    """
    try:
        logger.info(f"Received event: {event}")
        
        # 入力パラメータ取得
        input_bucket = event.get('inputS3Bucket', S3_BUCKET)
        input_s3_key = event['inputS3Key']
        output_s3_key = event['outputS3Key']
        processing_history_id = event['processingHistoryId']
        customer_id = event['customerId']
        user_id = event['userId']
        policy_id = event['policyId']
        
        logger.info(f"Copying file from s3://{input_bucket}/{input_s3_key} to s3://{input_bucket}/{output_s3_key}")
        
        # 入力ファイルの存在確認とサイズ取得
        try:
            head_response = s3_client.head_object(
                Bucket=input_bucket,
                Key=input_s3_key
            )
            file_size = head_response['ContentLength']
            logger.info(f"Input file size: {file_size} bytes")
        except s3_client.exceptions.NoSuchKey:
            error_msg = f"Input file not found: s3://{input_bucket}/{input_s3_key}"
            logger.error(error_msg)
            raise FileNotFoundError(error_msg)
        
        # ファイルをコピー
        copy_source = {
            'Bucket': input_bucket,
            'Key': input_s3_key
        }
        
        # 出力ファイルのメタデータ
        output_metadata = {
            'customerId': customer_id,
            'userId': user_id,
            'policyId': policy_id,
            'processingHistoryId': processing_history_id,
            'fileType': 'output',
            'processedAt': datetime.now(timezone.utc).isoformat(),
            'sourceKey': input_s3_key
        }
        
        # S3コピー実行
        s3_client.copy_object(
            CopySource=copy_source,
            Bucket=input_bucket,
            Key=output_s3_key,
            Metadata=output_metadata,
            MetadataDirective='REPLACE'
        )
        
        logger.info(f"File copied successfully to s3://{input_bucket}/{output_s3_key}")
        
        # 成功レスポンス
        return {
            'statusCode': 200,
            'outputS3Key': output_s3_key,
            'fileSizeBytes': file_size,
            'inputS3Key': input_s3_key,
            'processingHistoryId': processing_history_id,
            'message': 'ファイルコピー完了'
        }
        
    except FileNotFoundError as e:
        logger.error(f"File not found error: {repr(e)}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error during file copy: {repr(e)}")
        raise


def validate_s3_key(s3_key: str) -> bool:
    """
    S3キーのバリデーション
    
    Args:
        s3_key: 検証するS3キー
    
    Returns:
        bool: 有効な場合True
    """
    if not s3_key:
        return False
    
    # 基本的なバリデーション
    if s3_key.startswith('/') or s3_key.endswith('/'):
        return False
    
    if '//' in s3_key:
        return False
    
    return True

