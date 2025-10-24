"""
DynamoDB レコード削除 Lambda
指定されたcustomerIdに関連する全てのDynamoDBレコードを削除
"""

import json
import os
import boto3
from typing import Dict, Any, List
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')

# 環境変数から各テーブル名を取得
TABLES = {
    'users': os.environ.get('USER_TABLE_NAME', 'siftbeam-users'),
    'policy': os.environ.get('POLICY_TABLE_NAME', 'siftbeam-policy'),
    'group': os.environ.get('GROUP_TABLE_NAME', 'siftbeam-group'),
    'user_group': os.environ.get('USER_GROUP_TABLE_NAME', 'siftbeam-user-group'),
    'policy_group': os.environ.get('POLICY_GROUP_TABLE_NAME', 'siftbeam-policy-group'),
    'support_request': os.environ.get('SUPPORT_REQUEST_TABLE_NAME', 'siftbeam-support-request'),
    'support_reply': os.environ.get('SUPPORT_REPLY_TABLE_NAME', 'siftbeam-support-reply'),
    'neworder_request': os.environ.get('NEWORDER_REQUEST_TABLE_NAME', 'siftbeam-neworder-request'),
    'neworder_reply': os.environ.get('NEWORDER_REPLY_TABLE_NAME', 'siftbeam-neworder-reply'),
    'processing_history': os.environ.get('PROCESSING_HISTORY_TABLE_NAME', 'siftbeam-processing-history'),
    'usage_limits': os.environ.get('USAGE_LIMITS_TABLE_NAME', 'siftbeam-usage-limits'),
    'audit_logs': os.environ.get('AUDIT_LOG_TABLE_NAME', 'siftbeam-audit-logs'),
    'api_keys': os.environ.get('API_KEY_TABLE_NAME', 'siftbeam-api-keys'),
    'policy_analysis': os.environ.get('POLICY_ANALYSIS_TABLE_NAME', 'siftbeam-policy-analysis'),
    'data_usage': os.environ.get('DATA_USAGE_TABLE_NAME', 'siftbeam-data-usage'),
    'storage_usage_daily': 'siftbeam-storage-usage-daily'
}

CUSTOMER_CREATED_AT_INDEX = os.environ.get('CUSTOMER_CREATED_AT_INDEX', 'customerId-createdAt-index')


def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    指定されたcustomerIdに関連する全てのDynamoDBレコードを削除
    
    Args:
        event: {
            "customerId": "cus_xxx",
            "executionId": "arn:aws:states:..."
        }
    
    Returns:
        {
            "statusCode": 200,
            "deletedRecords": {
                "users": 5,
                "policy": 3,
                ...
            },
            "totalDeleted": 25
        }
    """
    try:
        customer_id = event['customerId']
        execution_id = event.get('executionId', 'unknown')
        
        print(f"Starting DynamoDB record deletion for customerId: {customer_id}")
        print(f"Execution ID: {execution_id}")
        
        deleted_counts = {}
        total_deleted = 0
        
        # 各テーブルからレコードを削除
        for table_name, table_full_name in TABLES.items():
            try:
                count = delete_records_from_table(table_full_name, customer_id)
                deleted_counts[table_name] = count
                total_deleted += count
                print(f"Deleted {count} records from {table_name}")
            except Exception as e:
                print(f"Error deleting from {table_name}: {str(e)}")
                deleted_counts[table_name] = 0
                # エラーがあっても続行
        
        print(f"Successfully deleted {total_deleted} records for customerId: {customer_id}")
        
        return {
            'statusCode': 200,
            'deletedRecords': deleted_counts,
            'totalDeleted': total_deleted,
            'customerId': customer_id
        }
        
    except Exception as e:
        print(f"Error in lambda_handler: {str(e)}")
        return {
            'statusCode': 500,
            'error': str(e),
            'message': 'Failed to delete DynamoDB records'
        }


def delete_records_from_table(table_name: str, customer_id: str) -> int:
    """
    指定されたテーブルからcustomerIdに関連するレコードを削除
    
    Args:
        table_name: テーブル名
        customer_id: Stripe customer ID
    
    Returns:
        削除されたレコード数
    """
    table = dynamodb.Table(table_name)
    deleted_count = 0
    
    try:
        # テーブルによってクエリ方法を変える
        if table_name == 'siftbeam-storage-usage-daily':
            # storage-usage-dailyはcustomerIdがパーティションキー
            items = query_by_partition_key(table, customer_id)
        else:
            # その他のテーブルはGSIを使用
            items = query_by_gsi(table, customer_id)
        
        # バッチ削除
        with table.batch_writer() as batch:
            for item in items:
                # パーティションキーとソートキーを取得
                key = get_table_key(table_name, item)
                if key:
                    batch.delete_item(Key=key)
                    deleted_count += 1
        
        return deleted_count
        
    except Exception as e:
        print(f"Error deleting from {table_name}: {str(e)}")
        raise


def query_by_partition_key(table, customer_id: str) -> List[Dict[str, Any]]:
    """
    パーティションキーでクエリ
    """
    items = []
    last_evaluated_key = None
    
    while True:
        query_params = {
            'KeyConditionExpression': 'customerId = :customerId',
            'ExpressionAttributeValues': {
                ':customerId': customer_id
            }
        }
        
        if last_evaluated_key:
            query_params['ExclusiveStartKey'] = last_evaluated_key
        
        response = table.query(**query_params)
        items.extend(response.get('Items', []))
        
        last_evaluated_key = response.get('LastEvaluatedKey')
        if not last_evaluated_key:
            break
    
    return items


def query_by_gsi(table, customer_id: str) -> List[Dict[str, Any]]:
    """
    GSIでクエリ
    """
    items = []
    last_evaluated_key = None
    
    while True:
        query_params = {
            'IndexName': CUSTOMER_CREATED_AT_INDEX,
            'KeyConditionExpression': 'customerId = :customerId',
            'ExpressionAttributeValues': {
                ':customerId': customer_id
            }
        }
        
        if last_evaluated_key:
            query_params['ExclusiveStartKey'] = last_evaluated_key
        
        response = table.query(**query_params)
        items.extend(response.get('Items', []))
        
        last_evaluated_key = response.get('LastEvaluatedKey')
        if not last_evaluated_key:
            break
    
    return items


def get_table_key(table_name: str, item: Dict[str, Any]) -> Dict[str, Any]:
    """
    テーブルのプライマリキーを取得
    """
    # 各テーブルのキー構造を定義
    key_schemas = {
        'siftbeam-users': {'userId': item.get('userId')},
        'siftbeam-policy': {'policyId': item.get('policyId')},
        'siftbeam-group': {'groupId': item.get('groupId')},
        'siftbeam-user-group': {'userId': item.get('userId'), 'groupId': item.get('groupId')},
        'siftbeam-policy-group': {'policyId': item.get('policyId'), 'groupId': item.get('groupId')},
        'siftbeam-support-request': {'requestId': item.get('requestId')},
        'siftbeam-support-reply': {'requestId': item.get('requestId'), 'replyId': item.get('replyId')},
        'siftbeam-neworder-request': {'requestId': item.get('requestId')},
        'siftbeam-neworder-reply': {'requestId': item.get('requestId'), 'replyId': item.get('replyId')},
        'siftbeam-processing-history': {'processingHistoryId': item.get('processingHistoryId')},
        'siftbeam-usage-limits': {'customerId': item.get('customerId')},
        'siftbeam-audit-logs': {'logId': item.get('logId')},
        'siftbeam-api-keys': {'apiKeyId': item.get('apiKeyId')},
        'siftbeam-policy-analysis': {'analysisId': item.get('analysisId')},
        'siftbeam-data-usage': {'usageId': item.get('usageId')},
        'siftbeam-storage-usage-daily': {'customerId': item.get('customerId'), 'date': item.get('date')}
    }
    
    return key_schemas.get(table_name, {})

