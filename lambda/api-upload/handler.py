"""
API Gateway経由でファイルをアップロードするLambda関数

機能:
1. APIキーを検証
2. APIキーからpolicyId, customerId, apiNameを取得
3. ポリシー情報を取得 (policyName等)
4. 処理履歴IDを生成 (UUID)
5. 処理履歴レコードを作成 (status: 'in_progress')
6. S3にファイルをアップロード (triggerStepFunction='false')
7. トリガーファイルを作成してStep Functionsを起動 (triggerStepFunction='true')
8. レスポンスを返す

環境変数:
- PROCESSING_HISTORY_TABLE_NAME: 処理履歴テーブル名
- API_KEY_TABLE_NAME: APIキーテーブル名
- POLICY_TABLE_NAME: ポリシーテーブル名
- S3_BUCKET_NAME: S3バケット名
- AWS_REGION: AWSリージョン
"""

import json
import os
import uuid
import base64
import boto3
from datetime import datetime
from typing import Dict, Any, Optional

# 環境変数
DYNAMODB_TABLE_NAME = os.environ.get('DYNAMODB_TABLE_NAME', 'siftbeam-processing-history')
S3_BUCKET_NAME = os.environ.get('S3_BUCKET_NAME', 'siftbeam')
AWS_REGION = os.environ.get('AWS_REGION', 'ap-northeast-1')

# AWSクライアント
dynamodb = boto3.resource('dynamodb', region_name=AWS_REGION)
s3_client = boto3.client('s3', region_name=AWS_REGION)
table = dynamodb.Table(DYNAMODB_TABLE_NAME)


def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    API Gateway Lambda統合のハンドラー
    
    Args:
        event: API Gatewayイベント
        context: Lambda実行コンテキスト
        
    Returns:
        API Gatewayレスポンス
    """
    try:
        print(f"Event received: {json.dumps(event, default=str)}")
        
        # リクエスト情報を取得
        headers = event.get('headers', {})
        query_params = event.get('queryStringParameters') or {}
        body = event.get('body', '')
        is_base64_encoded = event.get('isBase64Encoded', False)
        
        # APIキーIDを取得
        request_context = event.get('requestContext', {})
        identity = request_context.get('identity', {})
        api_key_id = identity.get('apiKeyId')
        
        if not api_key_id:
            return create_response(401, {
                'error': 'Unauthorized',
                'message': 'APIキーが見つかりません。'
            })
        
        print(f"API Key ID: {api_key_id}")
        
        # リクエストボディのバリデーション
        if not body:
            return create_response(400, {
                'error': 'Bad Request',
                'message': 'リクエストボディが空です。'
            })
        
        # Content-Typeを取得
        content_type = headers.get('content-type') or headers.get('Content-Type', 'application/octet-stream')
        
        # ファイル名を取得（クエリパラメータまたはヘッダーから）
        file_name = query_params.get('fileName') or headers.get('x-file-name')
        if not file_name:
            return create_response(400, {
                'error': 'Bad Request',
                'message': 'ファイル名が指定されていません。クエリパラメータ"fileName"またはヘッダー"x-file-name"を設定してください。'
            })
        
        # ファイルサイズを取得（オプション）
        file_size_str = query_params.get('fileSize') or headers.get('x-file-size')
        file_size = int(file_size_str) if file_size_str else None
        
        # APIキー情報を取得（DynamoDBから）
        api_key_info = get_api_key_info(api_key_id)
        if not api_key_info:
            return create_response(404, {
                'error': 'Not Found',
                'message': f'APIキーが見つかりません: {api_key_id}'
            })
        
        # APIキーからポリシーIDとカスタマーIDを取得
        policy_id = api_key_info.get('policyId')
        customer_id = api_key_info.get('customerId')
        
        if not policy_id:
            return create_response(400, {
                'error': 'Bad Request',
                'message': 'APIキーにポリシーIDが紐づいていません。'
            })
        
        if not customer_id:
            return create_response(400, {
                'error': 'Bad Request',
                'message': 'APIキーにカスタマーIDが紐づいていません。'
            })
        
        print(f"API Key Info: apiName={api_key_info.get('apiName')}, policyId={policy_id}, customerId={customer_id}")
        
        # ファイルデータをデコード
        if is_base64_encoded:
            file_data = base64.b64decode(body)
        else:
            file_data = body.encode('utf-8') if isinstance(body, str) else body
        
        # ファイルサイズを計算（指定されていない場合）
        if not file_size:
            file_size = len(file_data)
        
        print(f"File info: name={file_name}, size={file_size}, content_type={content_type}")
        
        # ファイルサイズチェック（100MB制限）
        max_file_size = 100 * 1024 * 1024  # 100MB
        if file_size > max_file_size:
            return create_response(400, {
                'error': 'Bad Request',
                'message': f'ファイルサイズが大きすぎます。最大{max_file_size / 1024 / 1024}MBまでです。'
            })
        
        # ポリシー情報を取得（DynamoDBから）
        policy_info = get_policy_info(policy_id)
        if not policy_info:
            return create_response(404, {
                'error': 'Not Found',
                'message': f'ポリシーが見つかりません: {policy_id}'
            })
        
        # 処理履歴IDを生成
        processing_history_id = str(uuid.uuid4())
        
        # S3キーを生成
        s3_key = f"service/input/{customer_id}/{processing_history_id}/{sanitize_filename(file_name)}"
        
        print(f"Processing History ID: {processing_history_id}")
        print(f"S3 Key: {s3_key}")
        
        # 処理履歴を作成（アップロード前）
        now = datetime.utcnow().isoformat() + 'Z'
        processing_history = {
            'processing-historyId': processing_history_id,
            'userId': api_key_id,
            'userName': api_key_info['apiName'],
            'customerId': customer_id,
            'policyId': policy_id,
            'policyName': policy_info['policyName'],
            'usageAmountBytes': 0,  # S3イベントLambdaで更新
            'status': 'in_progress',
            'downloadS3Keys': [],
            'uploadedFileKeys': [s3_key],
            'aiTrainingUsage': 'allow',
            'createdAt': now,
            'updatedAt': now
        }
        
        # DynamoDBに処理履歴を保存
        table.put_item(Item=processing_history)
        print(f"Processing history created: {processing_history_id}")
        
        # S3に通常ファイルをアップロード（triggerStepFunction='false'）
        s3_client.put_object(
            Bucket=S3_BUCKET_NAME,
            Key=s3_key,
            Body=file_data,
            ContentType=content_type,
            Metadata={
                'customerId': customer_id,
                'userId': api_key_id,
                'policyId': policy_id,
                'processingHistoryId': processing_history_id,
                'fileType': 'input',
                'uploadedAt': now,
                'triggerStepFunction': 'false'  # 通常ファイルはfalse
            }
        )
        
        print(f"File uploaded to S3: {s3_key}")
        
        # トリガーファイルを作成してアップロード
        trigger_content = {
            'processing-historyId': processing_history_id,
            'userId': api_key_id,
            'userName': api_key_info['apiName'],
            'customerId': customer_id,
            'policyId': policy_id,
            'policyName': policy_info['policyName'],
            'uploadedFileKeys': [s3_key],
            'aiTrainingUsage': 'allow',
            'fileCount': 1,
            'usageAmountBytes': file_size,
            'createdAt': datetime.utcnow().isoformat() + 'Z',
            'metadata': {
                'source': 'api',
                'apiVersion': '2025-10-28'
            }
        }
        
        # トリガーファイルをS3にアップロード
        trigger_key = f"service/input/{customer_id}/{processing_history_id}/_trigger.json"
        s3_client.put_object(
            Bucket=S3_BUCKET_NAME,
            Key=trigger_key,
            Body=json.dumps(trigger_content, ensure_ascii=False, indent=2),
            ContentType='application/json',
            Metadata={
                'customerId': customer_id,
                'userId': api_key_id,
                'policyId': policy_id,
                'processingHistoryId': processing_history_id,
                'fileType': 'input',
                'uploadedAt': now,
                'triggerStepFunction': 'true'  # トリガーファイルでStep Functions起動
            }
        )
        
        print(f"Trigger file uploaded: {trigger_key}")
        
        # 成功レスポンスを返す
        return create_response(200, {
            'success': True,
            'message': 'ファイルが正常にアップロードされました。',
            'data': {
                'processingHistoryId': processing_history_id,
                's3Key': s3_key,
                's3Bucket': S3_BUCKET_NAME,
                'fileName': file_name,
                'fileSize': file_size,
                'contentType': content_type,
                'status': 'in_progress',
                'uploadedAt': now
            }
        })
        
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        
        return create_response(500, {
            'error': 'Internal Server Error',
            'message': f'サーバーエラーが発生しました: {str(e)}'
        })


def create_response(status_code: int, body: Dict[str, Any]) -> Dict[str, Any]:
    """
    API Gatewayレスポンスを作成
    
    Args:
        status_code: HTTPステータスコード
        body: レスポンスボディ
        
    Returns:
        API Gatewayレスポンス
    """
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,x-file-name,x-file-size',
            'Access-Control-Allow-Methods': 'POST,OPTIONS'
        },
        'body': json.dumps(body, ensure_ascii=False, default=str)
    }


def sanitize_filename(filename: str) -> str:
    """
    ファイル名をサニタイズ
    
    Args:
        filename: 元のファイル名
        
    Returns:
        サニタイズされたファイル名
    """
    import re
    # 危険な文字を削除
    sanitized = re.sub(r'[^\w\s\-\.]', '_', filename)
    # 連続するアンダースコアを1つに
    sanitized = re.sub(r'_+', '_', sanitized)
    # 先頭と末尾の空白・アンダースコアを削除
    sanitized = sanitized.strip('_ ')
    return sanitized


def get_api_key_info(gateway_api_key_id: str) -> Dict[str, Any]:
    """
    API Gateway KeyIDからAPIキー情報を取得
    
    Args:
        gateway_api_key_id: API Gateway が発行したAPIキーID
        
    Returns:
        APIキー情報（apiName, policyId, customerId等）
    """
    try:
        # DynamoDBのAPIキーテーブルから情報を取得
        api_key_table_name = os.environ.get('API_KEY_TABLE_NAME', 'siftbeam-api-keys')
        api_key_table = dynamodb.Table(api_key_table_name)
        
        # api-keysIdをパーティションキーとして直接取得
        response = api_key_table.get_item(
            Key={'api-keysId': gateway_api_key_id}
        )
        
        api_key_item = response.get('Item')
        if not api_key_item:
            print(f"API key not found: {gateway_api_key_id}")
            return None
        
        print(f"API key found: {json.dumps(api_key_item, default=str)}")
        
        return {
            'apiKeyId': api_key_item.get('api-keysId'),
            'apiName': api_key_item.get('apiName'),
            'policyId': api_key_item.get('policyId'),
            'customerId': api_key_item.get('customerId'),
            'description': api_key_item.get('description')
        }
        
    except Exception as e:
        print(f"Error getting API key info: {str(e)}")
        import traceback
        traceback.print_exc()
        return None


def get_policy_info(policy_id: str) -> Dict[str, Any]:
    """
    ポリシーIDからポリシー情報を取得
    
    Args:
        policy_id: ポリシーID
        
    Returns:
        ポリシー情報（policyName, acceptedFileTypes等）
    """
    try:
        # DynamoDBのポリシーテーブルから情報を取得
        policy_table_name = os.environ.get('POLICY_TABLE_NAME', 'siftbeam-policy')
        policy_table = dynamodb.Table(policy_table_name)
        
        response = policy_table.get_item(
            Key={'policyId': policy_id}
        )
        
        policy_item = response.get('Item')
        if not policy_item:
            print(f"Policy not found: {policy_id}")
            return None
        
        print(f"Policy found: {json.dumps(policy_item, default=str)}")
        
        return {
            'policyId': policy_item.get('id'),
            'policyName': policy_item.get('policyName'),
            'description': policy_item.get('description'),
            'acceptedFileTypes': policy_item.get('acceptedFileTypes', [])
        }
        
    except Exception as e:
        print(f"Error getting policy info: {str(e)}")
        import traceback
        traceback.print_exc()
        return None

