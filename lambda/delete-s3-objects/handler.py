"""
S3 オブジェクト削除 Lambda
指定されたcustomerIdに関連する全てのS3オブジェクトを削除
"""

import json
import os
import boto3
from typing import Dict, Any, List

s3_client = boto3.client('s3')

S3_BUCKET_NAME = os.environ.get('S3_BUCKET_NAME', 'siftbeam')


def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    指定されたcustomerIdに関連する全てのS3オブジェクトを削除
    
    Args:
        event: {
            "customerId": "cus_xxx",
            "executionId": "arn:aws:states:..."
        }
    
    Returns:
        {
            "statusCode": 200,
            "deletedObjects": {
                "input": 50,
                "output": 45
            },
            "totalDeleted": 95
        }
    """
    try:
        customer_id = event['customerId']
        execution_id = event.get('executionId', 'unknown')
        
        print(f"Starting S3 object deletion for customerId: {customer_id}")
        print(f"Execution ID: {execution_id}")
        
        deleted_counts = {}
        total_deleted = 0
        
        # service/input/{customerId}/ 配下を削除
        input_count = delete_objects_with_prefix(
            S3_BUCKET_NAME,
            f'service/input/{customer_id}/'
        )
        deleted_counts['input'] = input_count
        total_deleted += input_count
        print(f"Deleted {input_count} objects from service/input/{customer_id}/")
        
        # service/output/{customerId}/ 配下を削除
        output_count = delete_objects_with_prefix(
            S3_BUCKET_NAME,
            f'service/output/{customer_id}/'
        )
        deleted_counts['output'] = output_count
        total_deleted += output_count
        print(f"Deleted {output_count} objects from service/output/{customer_id}/")
        
        print(f"Successfully deleted {total_deleted} objects for customerId: {customer_id}")
        
        return {
            'statusCode': 200,
            'deletedObjects': deleted_counts,
            'totalDeleted': total_deleted,
            'customerId': customer_id,
            'bucket': S3_BUCKET_NAME
        }
        
    except Exception as e:
        print(f"Error in lambda_handler: {str(e)}")
        return {
            'statusCode': 500,
            'error': str(e),
            'message': 'Failed to delete S3 objects'
        }


def delete_objects_with_prefix(bucket: str, prefix: str) -> int:
    """
    指定されたプレフィックスを持つ全てのオブジェクトを削除
    
    Args:
        bucket: S3バケット名
        prefix: オブジェクトのプレフィックス
    
    Returns:
        削除されたオブジェクト数
    """
    deleted_count = 0
    continuation_token = None
    
    try:
        while True:
            # オブジェクトをリスト
            list_params = {
                'Bucket': bucket,
                'Prefix': prefix,
                'MaxKeys': 1000
            }
            
            if continuation_token:
                list_params['ContinuationToken'] = continuation_token
            
            response = s3_client.list_objects_v2(**list_params)
            
            # オブジェクトが存在しない場合
            if 'Contents' not in response or len(response['Contents']) == 0:
                break
            
            # 削除するオブジェクトのリストを作成
            objects_to_delete = [
                {'Key': obj['Key']} for obj in response['Contents']
            ]
            
            # バッチ削除（最大1000個まで）
            if objects_to_delete:
                delete_response = s3_client.delete_objects(
                    Bucket=bucket,
                    Delete={
                        'Objects': objects_to_delete,
                        'Quiet': True
                    }
                )
                
                # 削除されたオブジェクト数をカウント
                deleted_count += len(objects_to_delete)
                
                # エラーがあればログ出力
                if 'Errors' in delete_response:
                    for error in delete_response['Errors']:
                        print(f"Error deleting {error['Key']}: {error['Message']}")
            
            # 次のページがあるか確認
            if not response.get('IsTruncated'):
                break
            
            continuation_token = response.get('NextContinuationToken')
        
        return deleted_count
        
    except Exception as e:
        print(f"Error deleting objects with prefix {prefix}: {str(e)}")
        raise


def get_folder_size(bucket: str, prefix: str) -> Dict[str, Any]:
    """
    フォルダのサイズと件数を取得（削除前の確認用）
    
    Args:
        bucket: S3バケット名
        prefix: オブジェクトのプレフィックス
    
    Returns:
        {'total_size': int, 'object_count': int}
    """
    total_size = 0
    object_count = 0
    continuation_token = None
    
    try:
        while True:
            list_params = {
                'Bucket': bucket,
                'Prefix': prefix,
                'MaxKeys': 1000
            }
            
            if continuation_token:
                list_params['ContinuationToken'] = continuation_token
            
            response = s3_client.list_objects_v2(**list_params)
            
            if 'Contents' not in response:
                break
            
            for obj in response['Contents']:
                total_size += obj['Size']
                object_count += 1
            
            if not response.get('IsTruncated'):
                break
            
            continuation_token = response.get('NextContinuationToken')
        
        return {
            'total_size': total_size,
            'object_count': object_count
        }
        
    except Exception as e:
        print(f"Error getting folder size for {prefix}: {str(e)}")
        return {
            'total_size': 0,
            'object_count': 0
        }

