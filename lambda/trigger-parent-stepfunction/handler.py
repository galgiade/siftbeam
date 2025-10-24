"""
Lambda関数: TriggerParentStepFunction

役割:
- S3イベント通知を受信
- S3パスからprocessingHistoryIdを抽出
- DynamoDBからprocessing-historyを取得
- メタデータを検証
- 親Step Function (ServiceProcessingOrchestrator) を起動
"""

import json
import boto3
import os
from datetime import datetime
from typing import Dict, Any, Optional
from decimal import Decimal

# AWSクライアント
s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
sfn = boto3.client('stepfunctions')


# DynamoDB DecimalをPythonのネイティブ型に変換するヘルパー関数
def decimal_to_native(obj):
    """
    DynamoDB Decimalをfloat/intに変換
    """
    if isinstance(obj, list):
        return [decimal_to_native(item) for item in obj]
    elif isinstance(obj, dict):
        return {key: decimal_to_native(value) for key, value in obj.items()}
    elif isinstance(obj, Decimal):
        # Decimalが整数の場合はintに、それ以外はfloatに変換
        if obj % 1 == 0:
            return int(obj)
        else:
            return float(obj)
    else:
        return obj

# 環境変数
PROCESSING_HISTORY_TABLE = os.environ.get('PROCESSING_HISTORY_TABLE', 'siftbeam-processing-history')
PARENT_STATE_MACHINE_ARN = os.environ.get('PARENT_STATE_MACHINE_ARN')


def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    S3イベントから親Step Functionsを起動するメインハンドラー
    
    Args:
        event: S3イベント通知
        context: Lambda context
        
    Returns:
        レスポンス（statusCodeとメッセージ）
    """
    try:
        print(f"Received event: {json.dumps(event)}")
        
        # 環境変数チェック
        if not PARENT_STATE_MACHINE_ARN:
            raise ValueError("PARENT_STATE_MACHINE_ARN environment variable is not set")
        
        processed_count = 0
        skipped_count = 0
        error_count = 0
        
        # S3イベントレコードを処理
        for record in event.get('Records', []):
            try:
                result = process_s3_record(record, context)
                
                if result['status'] == 'processed':
                    processed_count += 1
                elif result['status'] == 'skipped':
                    skipped_count += 1
                    
            except Exception as e:
                error_count += 1
                print(f"Error processing record: {repr(e)}")
                # エラーがあっても他のレコードの処理は継続
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Processing completed',
                'processed': processed_count,
                'skipped': skipped_count,
                'errors': error_count
            })
        }
    
    except Exception as e:
        print(f"Fatal error in lambda_handler: {repr(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': str(e)
            })
        }


def process_s3_record(record: Dict[str, Any], context: Any) -> Dict[str, str]:
    """
    個別のS3レコードを処理
    
    Args:
        record: S3イベントレコード
        context: Lambda context
        
    Returns:
        処理結果（status: processed/skipped）
    """
    # S3情報を取得
    bucket_name = record['s3']['bucket']['name']
    s3_key = record['s3']['object']['key']
    
    print(f"Processing S3 event: s3://{bucket_name}/{s3_key}")
    
    # S3パスを検証
    validation = validate_s3_key(s3_key)
    if not validation['valid']:
        print(f"Invalid S3 key: {validation['error']}")
        return {'status': 'skipped', 'reason': validation['error']}
    
    customer_id = validation['customerId']
    processing_history_id = validation['processingHistoryId']
    file_type = validation['fileType']
    
    # inputファイルのみ処理（outputやtempは無視）
    if file_type != 'input':
        print(f"Skipping non-input file: {file_type}")
        return {'status': 'skipped', 'reason': f'Non-input file type: {file_type}'}
    
    # S3メタデータを取得
    metadata = get_s3_metadata(bucket_name, s3_key)
    
    # triggerStepFunctionフラグを確認
    if metadata.get('triggerstepfunction') != 'true':
        print(f"Skipping: triggerStepFunction={metadata.get('triggerstepfunction')}")
        return {'status': 'skipped', 'reason': 'triggerStepFunction is not true'}
    
    # DynamoDBからprocessing-historyを取得
    history = get_processing_history(processing_history_id)
    if not history:
        print(f"Processing history not found: {processing_history_id}")
        return {'status': 'skipped', 'reason': f'Processing history not found: {processing_history_id}'}
    
    # customerIdの整合性チェック
    if history.get('customerId') != customer_id:
        print(f"CustomerID mismatch: path={customer_id}, db={history.get('customerId')}")
        return {'status': 'skipped', 'reason': 'CustomerID mismatch'}
    
    # Step Functionsを起動
    execution_arn = start_step_function(
        bucket_name=bucket_name,
        s3_key=s3_key,
        history=history,
        context=context
    )
    
    print(f"Successfully started Step Functions execution: {execution_arn}")
    
    return {
        'status': 'processed',
        'executionArn': execution_arn
    }


def validate_s3_key(s3_key: str) -> Dict[str, Any]:
    """
    S3キーを検証し、customerIdとprocessingHistoryIdを抽出
    
    Args:
        s3_key: S3オブジェクトキー
        
    Returns:
        検証結果とパース結果
    
    期待されるパス構造:
        service/input/{customerId}/{processingHistoryId}/{fileName}
        service/output/{customerId}/{processingHistoryId}/{fileName}
        service/temp/{customerId}/{processingHistoryId}/{stepName}/{fileName}
    
    注: タイムスタンプなし (processingHistoryIdで一意性が保証される)
    """
    parts = s3_key.split('/')
    
    # パス構造の検証
    # 最小でも5パート必要: service/type/customerId/processingHistoryId/fileName
    if len(parts) < 5:
        return {
            'valid': False,
            'error': f'Invalid path structure: expected at least 5 parts, got {len(parts)}'
        }
    
    if parts[0] != 'service':
        return {
            'valid': False,
            'error': f'Not a service path: expected "service", got "{parts[0]}"'
        }
    
    file_type = parts[1]
    if file_type not in ['input', 'output', 'temp']:
        return {
            'valid': False,
            'error': f'Invalid file type: expected input/output/temp, got "{file_type}"'
        }
    
    customer_id = parts[2]
    processing_history_id = parts[3]
    
    # ファイル名を取得（パスの最後の部分）
    file_name = parts[-1]
    
    return {
        'valid': True,
        'customerId': customer_id,
        'processingHistoryId': processing_history_id,
        'fileType': file_type,
        'fileName': file_name
    }


def get_s3_metadata(bucket_name: str, s3_key: str) -> Dict[str, str]:
    """
    S3オブジェクトのメタデータを取得
    
    Args:
        bucket_name: S3バケット名
        s3_key: S3オブジェクトキー
        
    Returns:
        メタデータ（辞書）
    """
    try:
        response = s3.head_object(Bucket=bucket_name, Key=s3_key)
        metadata = response.get('Metadata', {})
        
        print(f"S3 metadata: {json.dumps(metadata)}")
        
        return metadata
    
    except s3.exceptions.NoSuchKey:
        print(f"S3 object not found: s3://{bucket_name}/{s3_key}")
        return {}
    
    except Exception as e:
        print(f"Error getting S3 metadata: {repr(e)}")
        return {}


def get_processing_history(processing_history_id: str) -> Optional[Dict[str, Any]]:
    """
    DynamoDBからprocessing-historyを取得
    
    Args:
        processing_history_id: 処理履歴ID
        
    Returns:
        処理履歴データ、または None
    """
    try:
        table = dynamodb.Table(PROCESSING_HISTORY_TABLE)
        
        response = table.get_item(
            Key={'processing-historyId': processing_history_id}
        )
        
        item = response.get('Item')
        
        if item:
            print(f"Processing history found: {processing_history_id}")
            # 必須フィールドの確認
            required_fields = ['customerId', 'userId', 'userName', 'policyId', 'policyName', 'createdAt']
            missing_fields = [field for field in required_fields if field not in item]
            
            if missing_fields:
                print(f"Warning: Missing fields in processing history: {missing_fields}")
        else:
            print(f"Processing history not found: {processing_history_id}")
        
        return item
    
    except Exception as e:
        print(f"Error getting processing history from DynamoDB: {repr(e)}")
        return None


def start_step_function(
    bucket_name: str,
    s3_key: str,
    history: Dict[str, Any],
    context: Any
) -> str:
    """
    親Step Function (ServiceProcessingOrchestrator) を起動
    
    Args:
        bucket_name: S3バケット名
        s3_key: S3オブジェクトキー
        history: 処理履歴データ
        context: Lambda context
        
    Returns:
        Step Functions実行ARN
    """
    processing_history_id = history['processing-historyId']
    
    # DynamoDBのDecimal型をPythonのネイティブ型に変換
    history_native = decimal_to_native(history)
    
    # Step Functionsの入力データを構築
    # 注: uploadedFileKeys はDynamoDBのprocessing-historyから取得
    #     フルS3パスが含まれる（例: ["service/input/cus_123/abc-456/icon.png", ...]）
    #     downloadS3Keys も同様にDynamoDBから取得（通常は[]だが、リトライ時などに値がある可能性）
    execution_input = {
        'processingHistoryId': processing_history_id,
        'customerId': history_native['customerId'],
        'userId': history_native['userId'],
        'userName': history_native['userName'],
        'policyId': history_native['policyId'],
        'policyName': history_native['policyName'],
        'inputS3Bucket': bucket_name,
        'uploadedFileKeys': history_native.get('uploadedFileKeys', []),  # フルS3パスのリスト
        'downloadS3Keys': history_native.get('downloadS3Keys', []),  # DynamoDBから取得、デフォルトは空配列
        'aiTrainingUsage': history_native.get('aiTrainingUsage', 'allow'),
        'fileSizeBytes': history_native.get('fileSizeBytes', 0),
        'usageAmountBytes': history_native.get('usageAmountBytes', 0),
        'createdAt': history_native['createdAt']
    }
    
    # 実行名を生成（ユニークにするため、タイムスタンプを追加）
    timestamp = datetime.now().strftime('%Y%m%d-%H%M%S')
    remaining_time_ms = context.get_remaining_time_in_millis() if hasattr(context, 'get_remaining_time_in_millis') else 0
    execution_name = f"{processing_history_id}-{timestamp}-{remaining_time_ms}"
    
    # 実行名の長さ制限（80文字まで）
    if len(execution_name) > 80:
        execution_name = execution_name[:80]
    
    print(f"Starting Step Functions execution: {execution_name}")
    print(f"Execution input: {json.dumps(execution_input)}")
    
    try:
        response = sfn.start_execution(
            stateMachineArn=PARENT_STATE_MACHINE_ARN,
            name=execution_name,
            input=json.dumps(execution_input)
        )
        
        return response['executionArn']
    
    except sfn.exceptions.ExecutionAlreadyExists:
        print(f"Execution already exists: {execution_name}")
        # 既に存在する場合は、ミリ秒を追加して再試行
        execution_name = f"{execution_name}-{int(datetime.now().timestamp() * 1000) % 10000}"
        
        response = sfn.start_execution(
            stateMachineArn=PARENT_STATE_MACHINE_ARN,
            name=execution_name,
            input=json.dumps(execution_input)
        )
        
        return response['executionArn']
    
    except Exception as e:
        print(f"Error starting Step Functions: {repr(e)}")
        raise

