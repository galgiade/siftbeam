"""
S3 Presigned URL生成Lambda関数

機能:
1. APIキーを検証
2. 処理履歴IDを生成
3. 各ファイル用の署名付きURLを生成
4. 処理履歴をDynamoDBに作成
5. 署名付きURLをクライアントに返却

環境変数:
- PROCESSING_HISTORY_TABLE_NAME: 処理履歴テーブル名
- API_KEY_TABLE_NAME: APIキーテーブル名
- POLICY_TABLE_NAME: ポリシーテーブル名
- S3_BUCKET_NAME: S3バケット名
- AWS_REGION: AWSリージョン
- PRESIGNED_URL_EXPIRATION: 署名付きURLの有効期限(秒) デフォルト: 3600
"""

import json
import os
import uuid
import boto3
from datetime import datetime
from typing import Dict, Any, List

# 環境変数
DYNAMODB_TABLE_NAME = os.environ.get('PROCESSING_HISTORY_TABLE_NAME', 'siftbeam-processing-history')
S3_BUCKET_NAME = os.environ.get('S3_BUCKET_NAME', 'siftbeam')
AWS_REGION = os.environ.get('AWS_REGION', 'ap-northeast-1')
PRESIGNED_URL_EXPIRATION = int(os.environ.get('PRESIGNED_URL_EXPIRATION', '3600'))  # 1時間

# AWSクライアント
dynamodb = boto3.resource('dynamodb', region_name=AWS_REGION)
s3_client = boto3.client('s3', region_name=AWS_REGION)
table = dynamodb.Table(DYNAMODB_TABLE_NAME)


def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    署名付きURL生成ハンドラー
    
    リクエスト形式:
    POST /generate-upload-urls
    Content-Type: application/json
    x-api-key: YOUR_API_KEY
    
    Body:
    {
        "files": [
            {"fileName": "file1.pdf"},
            {"fileName": "file2.pdf"}
        ]
    }
    
    注意:
    - fileSize: 不要（クライアント側で取得できないため）
    - contentType: 不要（ポリシーのacceptedFileTypesから自動判定）
    
    レスポンス:
    {
        "success": true,
        "data": {
            "processingHistoryId": "xxx-xxx-xxx",
            "uploadUrls": [
                {
                    "fileName": "file1.pdf",
                    "uploadUrl": "https://s3.amazonaws.com/...",
                    "s3Key": "service/input/.../file1.pdf",
                    "contentType": "application/pdf",
                    "expiresIn": 3600
                }
            ],
            "triggerUrl": "https://s3.amazonaws.com/..._trigger.json"
        }
    }
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
        
        # ファイル情報を取得
        files = request_data.get('files', [])
        if not files or len(files) == 0:
            return create_response(400, {
                'error': 'Bad Request',
                'message': 'ファイル情報が指定されていません。'
            })
        
        # ファイル数制限
        if len(files) > 10:
            return create_response(400, {
                'error': 'Bad Request',
                'message': 'ファイル数が多すぎます。最大10ファイルまでです。'
            })
        
        # APIキー情報を取得
        api_key_info = get_api_key_info(api_key_id)
        if not api_key_info:
            return create_response(404, {
                'error': 'Not Found',
                'message': f'APIキーが見つかりません: {api_key_id}'
            })
        
        policy_id = api_key_info.get('policyId')
        customer_id = api_key_info.get('customerId')
        
        if not policy_id or not customer_id:
            return create_response(400, {
                'error': 'Bad Request',
                'message': 'APIキーにポリシーIDまたはカスタマーIDが紐づいていません。'
            })
        
        print(f"API Key Info: apiName={api_key_info.get('apiName')}, policyId={policy_id}, customerId={customer_id}")
        
        # ポリシー情報を取得
        policy_info = get_policy_info(policy_id)
        if not policy_info:
            return create_response(404, {
                'error': 'Not Found',
                'message': f'ポリシーが見つかりません: {policy_id}'
            })
        
        # 処理履歴IDを生成
        processing_history_id = str(uuid.uuid4())
        
        print(f"Processing History ID: {processing_history_id}")
        print(f"File count: {len(files)}")
        
        # ポリシーから許可されたファイルタイプを取得
        accepted_file_types = policy_info.get('acceptedFileTypes', [])
        
        # 各ファイルの署名付きURLを生成
        upload_urls = []
        uploaded_file_keys = []
        
        for file_info in files:
            file_name = file_info.get('fileName')
            
            if not file_name:
                return create_response(400, {
                    'error': 'Bad Request',
                    'message': 'ファイル名が指定されていません。'
                })
            
            # Content-Typeを自動判定
            content_type = get_content_type_from_filename(file_name, accepted_file_types)
            
            print(f"File: {file_name}, Content-Type: {content_type}")
            
            # S3キーを生成
            s3_key = f"service/input/{customer_id}/{processing_history_id}/{sanitize_filename(file_name)}"
            uploaded_file_keys.append(s3_key)
            
            # 署名付きURLを生成
            presigned_url = s3_client.generate_presigned_url(
                'put_object',
                Params={
                    'Bucket': S3_BUCKET_NAME,
                    'Key': s3_key,
                    'ContentType': content_type,
                    'Metadata': {
                        'customerId': customer_id,
                        'userId': api_key_id,
                        'policyId': policy_id,
                        'processingHistoryId': processing_history_id,
                        'fileType': 'input',
                        'triggerStepFunction': 'false'
                    }
                },
                ExpiresIn=PRESIGNED_URL_EXPIRATION
            )
            
            upload_urls.append({
                'fileName': file_name,
                'uploadUrl': presigned_url,
                's3Key': s3_key,
                'contentType': content_type,
                'expiresIn': PRESIGNED_URL_EXPIRATION
            })
            
            print(f"Generated presigned URL for: {file_name}")
        
        # トリガーファイル用の署名付きURLを生成
        trigger_key = f"service/input/{customer_id}/{processing_history_id}/_trigger.json"
        trigger_presigned_url = s3_client.generate_presigned_url(
            'put_object',
            Params={
                'Bucket': S3_BUCKET_NAME,
                'Key': trigger_key,
                'ContentType': 'application/json',
                'Metadata': {
                    'customerId': customer_id,
                    'userId': api_key_id,
                    'policyId': policy_id,
                    'processingHistoryId': processing_history_id,
                    'fileType': 'input',
                    'triggerStepFunction': 'true'
                }
            },
            ExpiresIn=PRESIGNED_URL_EXPIRATION
        )
        
        # 処理履歴を作成
        now = datetime.utcnow().isoformat() + 'Z'
        processing_history = {
            'processing-historyId': processing_history_id,
            'userId': api_key_id,
            'userName': api_key_info['apiName'],
            'customerId': customer_id,
            'policyId': policy_id,
            'policyName': policy_info['policyName'],
            'usageAmountBytes': 0,  # S3イベントLambdaで更新
            'status': 'pending',  # アップロード待ち
            'downloadS3Keys': [],
            'uploadedFileKeys': uploaded_file_keys,
            'aiTrainingUsage': 'allow',
            'createdAt': now,  # 仮の値（S3イベントLambdaで実際のアップロード完了時刻に更新）
            'updatedAt': now
        }
        
        table.put_item(Item=processing_history)
        print(f"Processing history created: {processing_history_id}")
        
        # トリガーファイルの内容を生成
        trigger_content = {
            'processing-historyId': processing_history_id,
            'userId': api_key_id,
            'userName': api_key_info.get('apiName', 'API User'),
            'customerId': customer_id,
            'policyId': policy_id,
            'policyName': policy_info.get('policyName', 'Unknown Policy'),
            'uploadedFileKeys': uploaded_file_keys,
            'aiTrainingUsage': 'allow',
            'fileCount': len(files),
            'usageAmountBytes': 0,  # S3イベントLambdaで実際のサイズを計算
            'createdAt': datetime.utcnow().isoformat() + 'Z',
            'metadata': {
                'source': 'api',
                'apiVersion': '2025-10-30'
            }
        }
        
        # 成功レスポンスを返す
        return create_response(200, {
            'success': True,
            'message': f'{len(files)}個のファイルのアップロードURLを生成しました。',
            'data': {
                'processingHistoryId': processing_history_id,
                'uploadUrls': upload_urls,
                'triggerUrl': trigger_presigned_url,
                'triggerContent': trigger_content,
                'expiresIn': PRESIGNED_URL_EXPIRATION,
                'instructions': {
                    'step1': '各ファイルをuploadUrlにPUTリクエストで送信してください。',
                    'step2': '全ファイルのアップロード完了後、triggerContentをtriggerUrlにPUTリクエストで送信してください。',
                    'step3': 'Step Functionsが自動的に起動し、処理が開始されます。'
                }
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


def get_content_type_from_filename(filename: str, accepted_file_types: List[str]) -> str:
    """
    ファイル名と許可されたファイルタイプからContent-Typeを判定
    
    Args:
        filename: ファイル名
        accepted_file_types: ポリシーで許可されたMIMEタイプのリスト
        
    Returns:
        Content-Type文字列
    """
    import mimetypes
    
    # ファイル拡張子からMIMEタイプを推測
    guessed_type, _ = mimetypes.guess_type(filename)
    
    # 推測されたタイプが許可リストにあるか確認
    if guessed_type and guessed_type in accepted_file_types:
        return guessed_type
    
    # 許可リストの最初のタイプを使用（フォールバック）
    if accepted_file_types and len(accepted_file_types) > 0:
        return accepted_file_types[0]
    
    # デフォルト
    return 'application/octet-stream'


def get_api_key_info(gateway_api_key_id: str) -> Dict[str, Any]:
    """APIキー情報を取得"""
    try:
        api_key_table_name = os.environ.get('API_KEY_TABLE_NAME', 'siftbeam-api-keys')
        api_key_table = dynamodb.Table(api_key_table_name)
        
        response = api_key_table.get_item(
            Key={'api-keysId': gateway_api_key_id}
        )
        
        api_key_item = response.get('Item')
        if not api_key_item:
            print(f"API key not found: {gateway_api_key_id}")
            return None
        
        return {
            'apiKeyId': api_key_item.get('api-keysId'),
            'apiName': api_key_item.get('apiName'),
            'policyId': api_key_item.get('policyId'),
            'customerId': api_key_item.get('customerId'),
            'description': api_key_item.get('description')
        }
        
    except Exception as e:
        print(f"Error getting API key info: {str(e)}")
        return None


def get_policy_info(policy_id: str) -> Dict[str, Any]:
    """ポリシー情報を取得"""
    try:
        policy_table_name = os.environ.get('POLICY_TABLE_NAME', 'siftbeam-policy')
        policy_table = dynamodb.Table(policy_table_name)
        
        response = policy_table.get_item(
            Key={'policyId': policy_id}
        )
        
        policy_item = response.get('Item')
        if not policy_item:
            print(f"Policy not found: {policy_id}")
            return None
        
        return {
            'policyId': policy_item.get('policyId'),
            'policyName': policy_item.get('policyName'),
            'description': policy_item.get('description'),
            'acceptedFileTypes': policy_item.get('acceptedFileTypes', [])
        }
        
    except Exception as e:
        print(f"Error getting policy info: {str(e)}")
        return None

