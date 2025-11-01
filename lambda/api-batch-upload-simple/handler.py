"""
API Gateway経由で複数ファイルをバッチアップロードするLambda関数（シンプル版）

機能:
1. APIキーを検証
2. APIキーからpolicyId, customerId, apiNameを取得
3. ファイルパスのリストを受け取る
4. Lambda内でファイルを読み込み、エンコード
5. 処理履歴をDynamoDBに作成
6. 各ファイルをS3にアップロード
7. トリガーファイルを作成してStep Functionsを起動

リクエスト形式:
{
  "filePaths": [
    "/path/to/icon.png",
    "/path/to/icon2.png"
  ]
}

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
import boto3
import mimetypes
from datetime import datetime
from typing import Dict, Any, List
from pathlib import Path

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
    API Gateway Lambda統合のハンドラー（シンプル版）
    
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
        body = event.get('body', '')
        
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
        
        # リクエストボディをパース
        try:
            request_data = json.loads(body)
        except json.JSONDecodeError:
            return create_response(400, {
                'error': 'Bad Request',
                'message': 'リクエストボディが不正です。JSON形式で送信してください。'
            })
        
        # ファイルパスのリストを取得
        file_paths = request_data.get('filePaths', [])
        if not file_paths or len(file_paths) == 0:
            return create_response(400, {
                'error': 'Bad Request',
                'message': 'ファイルパスが指定されていません。'
            })
        
        # ファイル数制限
        if len(file_paths) > 10:
            return create_response(400, {
                'error': 'Bad Request',
                'message': 'ファイル数が多すぎます。最大10ファイルまでです。'
            })
        
        # APIキー情報をDynamoDBから取得（API Gateway KeyID → APIキーテーブル）
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
        
        # ポリシー情報をDynamoDBから取得
        policy_info = get_policy_info(policy_id)
        if not policy_info:
            return create_response(404, {
                'error': 'Not Found',
                'message': f'ポリシーが見つかりません: {policy_id}'
            })
        
        # 処理履歴IDを生成（全ファイル共通）
        processing_history_id = str(uuid.uuid4())
        
        print(f"Processing History ID: {processing_history_id}")
        print(f"File count: {len(file_paths)}")
        
        # S3キーのリストを生成
        uploaded_file_keys = []
        for file_path in file_paths:
            file_name = Path(file_path).name
            s3_key = f"service/input/{customer_id}/{processing_history_id}/{sanitize_filename(file_name)}"
            uploaded_file_keys.append(s3_key)
        
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
            'uploadedFileKeys': uploaded_file_keys,
            'aiTrainingUsage': 'allow',
            'createdAt': now,
            'updatedAt': now
        }
        
        # DynamoDBに処理履歴を保存
        table.put_item(Item=processing_history)
        print(f"Processing history created: {processing_history_id}")
        
        # 各ファイルをS3にアップロード
        uploaded_files = []
        total_size = 0
        
        for i, file_path in enumerate(file_paths):
            file_name = Path(file_path).name
            
            # ファイルを読み込む
            try:
                with open(file_path, 'rb') as f:
                    file_data = f.read()
            except FileNotFoundError:
                return create_response(400, {
                    'error': 'Bad Request',
                    'message': f'ファイル"{file_path}"が見つかりません。'
                })
            except Exception as e:
                return create_response(400, {
                    'error': 'Bad Request',
                    'message': f'ファイル"{file_path}"の読み込みに失敗しました: {str(e)}'
                })
            
            file_size = len(file_data)
            total_size += file_size
            
            # ファイルサイズチェック（100MB制限）
            max_file_size = 100 * 1024 * 1024
            if file_size > max_file_size:
                return create_response(400, {
                    'error': 'Bad Request',
                    'message': f'ファイル"{file_name}"のサイズが大きすぎます。最大{max_file_size / 1024 / 1024}MBまでです。'
                })
            
            # Content-Typeを推測
            content_type, _ = mimetypes.guess_type(file_name)
            if not content_type:
                content_type = 'application/octet-stream'
            
            s3_key = uploaded_file_keys[i]
            
            # 通常ファイルはtriggerStepFunction='false'
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
            
            uploaded_files.append({
                'fileName': file_name,
                's3Key': s3_key,
                'fileSize': file_size,
                'contentType': content_type
            })
        
        # すべてのファイルアップロード完了後、トリガーファイルを作成
        print(f"All files uploaded: {len(uploaded_files)}/{len(file_paths)} files, total size: {total_size} bytes")
        
        # トリガーファイルの内容を作成（API版の仕様）
        trigger_content = {
            'processing-historyId': processing_history_id,
            'userId': api_key_id,
            'userName': api_key_info.get('apiName', 'API User'),
            'customerId': customer_id,
            'policyId': policy_id,
            'policyName': policy_info.get('policyName', 'Unknown Policy'),
            'uploadedFileKeys': uploaded_file_keys,
            'aiTrainingUsage': 'allow',  # デフォルト値
            'fileCount': len(uploaded_files),
            'usageAmountBytes': total_size,
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
            'message': f'{len(uploaded_files)}個のファイルが正常にアップロードされました。',
            'data': {
                'processingHistoryId': processing_history_id,
                's3Bucket': S3_BUCKET_NAME,
                'files': uploaded_files,
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
    """API Gatewayレスポンスを作成"""
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Methods': 'POST,OPTIONS'
        },
        'body': json.dumps(body, ensure_ascii=False, default=str)
    }


def sanitize_filename(filename: str) -> str:
    """ファイル名をサニタイズ"""
    import re
    sanitized = re.sub(r'[^\w\s\-\.]', '_', filename)
    sanitized = re.sub(r'_+', '_', sanitized)
    sanitized = sanitized.strip('_ ')
    return sanitized


def get_api_key_info(gateway_api_key_id: str) -> Dict[str, Any]:
    """
    API Gateway KeyIDからAPIキー情報を取得
    
    Args:
        gateway_api_key_id: API Gateway が発行したAPIキーID (DynamoDBのapi-keysIdと同値)
        
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

