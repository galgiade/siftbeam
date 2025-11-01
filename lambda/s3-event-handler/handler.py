"""
S3イベントトリガーでファイルアップロード後の処理を行うLambda関数

機能:
1. S3からメタデータを取得
2. processingHistoryIdを使って処理履歴を取得
3. ファイルサイズを取得
4. 処理履歴を更新（usageAmountBytesを累積加算）
5. triggerStepFunction='true'の場合、Step Functionsを起動

環境変数:
- DYNAMODB_TABLE_NAME: DynamoDBテーブル名
- STEP_FUNCTION_ARN: Step FunctionsのARN（オプション）
- AWS_REGION: AWSリージョン
"""

import json
import os
import boto3
from typing import Dict, Any, List
from decimal import Decimal

# 環境変数
DYNAMODB_TABLE_NAME = os.environ.get('DYNAMODB_TABLE_NAME', 'siftbeam-processing-history')
STEP_FUNCTION_ARN = os.environ.get('STEP_FUNCTION_ARN', '')
AWS_REGION = os.environ.get('AWS_REGION', 'ap-northeast-1')

# AWSクライアント
dynamodb = boto3.resource('dynamodb', region_name=AWS_REGION)
s3_client = boto3.client('s3', region_name=AWS_REGION)
sfn_client = boto3.client('stepfunctions', region_name=AWS_REGION)
table = dynamodb.Table(DYNAMODB_TABLE_NAME)


def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    S3イベントハンドラー
    
    Args:
        event: S3イベント
        context: Lambda実行コンテキスト
        
    Returns:
        処理結果
    """
    try:
        print(f"Event received: {json.dumps(event, default=str)}")
        
        # S3イベントレコードを処理
        records = event.get('Records', [])
        processed_count = 0
        triggered_step_functions = []
        
        for record in records:
            try:
                result = process_s3_record(record)
                if result:
                    processed_count += 1
                    if result.get('stepFunctionTriggered'):
                        triggered_step_functions.append(result['processingHistoryId'])
            except Exception as e:
                print(f"Error processing record: {str(e)}")
                import traceback
                traceback.print_exc()
                # 個別のレコード処理エラーは記録するが、全体の処理は継続
        
        print(f"Processed {processed_count}/{len(records)} records")
        if triggered_step_functions:
            print(f"Triggered Step Functions for: {triggered_step_functions}")
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'processedCount': processed_count,
                'totalRecords': len(records),
                'triggeredStepFunctions': triggered_step_functions
            })
        }
        
    except Exception as e:
        print(f"Error in lambda_handler: {str(e)}")
        import traceback
        traceback.print_exc()
        
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': str(e)
            })
        }


def process_s3_record(record: Dict[str, Any]) -> Dict[str, Any]:
    """
    個別のS3レコードを処理
    
    Args:
        record: S3イベントレコード
        
    Returns:
        処理結果
    """
    # S3情報を取得
    s3_info = record.get('s3', {})
    bucket_name = s3_info.get('bucket', {}).get('name')
    object_key = s3_info.get('object', {}).get('key')
    object_size = s3_info.get('object', {}).get('size', 0)
    
    if not bucket_name or not object_key:
        print(f"Invalid S3 record: bucket={bucket_name}, key={object_key}")
        return None
    
    # トリガーファイル（_trigger.json）かどうかを判定
    is_trigger_file = object_key.endswith('/_trigger.json')
    
    # S3イベント通知がトリガーファイルのみに設定されている場合、
    # このLambdaはトリガーファイルでのみ起動される
    if not is_trigger_file:
        print(f"Warning: Non-trigger file detected: {object_key}")
        print(f"S3イベント通知の設定を確認してください。suffix='_trigger.json'に設定されているべきです。")
        return None
    
    print(f"Processing trigger file: s3://{bucket_name}/{object_key}")
    
    # S3キーのパス構造から情報を抽出
    # パス形式: service/input/{customerId}/{processingHistoryId}/_trigger.json
    try:
        path_parts = object_key.split('/')
        if len(path_parts) >= 5:
            customer_id = path_parts[2]
            processing_history_id = path_parts[3]
            print(f"Extracted from S3 key - Customer ID: {customer_id}, Processing History ID: {processing_history_id}")
        else:
            print(f"Warning: Invalid S3 key format: {object_key}")
            return None
    except Exception as e:
        print(f"Error extracting info from S3 key: {str(e)}")
        return None
    
    if not processing_history_id:
        print(f"Warning: processingHistoryId not found in S3 key: {object_key}")
        return None
    
    # 処理履歴を取得
    try:
        response = table.get_item(Key={'processing-historyId': processing_history_id})
        processing_history = response.get('Item')
        
        if not processing_history:
            print(f"Warning: Processing history not found: {processing_history_id}")
            return None
        
        print(f"Current processing history: {json.dumps(processing_history, default=str)}")
        
    except Exception as e:
        print(f"Error getting processing history: {str(e)}")
        return None
    
    # トリガーファイルの内容を読み取る
    try:
        trigger_obj = s3_client.get_object(Bucket=bucket_name, Key=object_key)
        trigger_data = json.loads(trigger_obj['Body'].read().decode('utf-8'))
        
        print(f"Trigger file content: {json.dumps(trigger_data, ensure_ascii=False, default=str)}")
        
    except Exception as e:
        print(f"Error reading trigger file: {str(e)}")
        return None
    
    # トリガーファイルから値を取得
    expected_file_count = trigger_data.get('fileCount', 0)
    uploaded_file_keys = trigger_data.get('uploadedFileKeys', [])
    
    # 実際のファイルサイズを計算（S3から取得）
    usageAmountBytes = 0
    for file_key in uploaded_file_keys:
        try:
            head_response = s3_client.head_object(Bucket=bucket_name, Key=file_key)
            file_size = head_response.get('ContentLength', 0)
            usageAmountBytes += file_size
            print(f"File: {file_key}, Size: {file_size} bytes")
        except Exception as e:
            print(f"Warning: Could not get size for {file_key}: {str(e)}")
            # ファイルが見つからない場合でも処理を継続
    
    print(f"Total calculated size: {usageAmountBytes} bytes")
    
    # ProcessingHistoryを更新（実際のファイルサイズを使用）
    try:
        from datetime import datetime
        now = datetime.utcnow().isoformat() + 'Z'
        
        # usageAmountBytes、createdAt、updatedAt、statusを更新
        # createdAtを現在時刻に更新することで、時差の問題を解決
        update_expression = "SET usageAmountBytes = :usageAmountBytes, createdAt = :createdAt, updatedAt = :updatedAt, #status = :status"
        expression_values = {
            ':usageAmountBytes': usageAmountBytes,
            ':createdAt': now,  # 実際のアップロード完了時刻
            ':updatedAt': now,
            ':status': 'in_progress'  # Step Functions起動前に in_progress に変更
        }
        expression_names = {
            '#status': 'status'
        }
        
        table.update_item(
            Key={'processing-historyId': processing_history_id},
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expression_values,
            ExpressionAttributeNames=expression_names
        )
        
        print(f"Processing history updated: usageAmountBytes = {usageAmountBytes} bytes, createdAt = {now}, status = in_progress")
        
        # 検証: ファイル数の整合性チェック
        actual_file_count = len(processing_history.get('uploadedFileKeys', []))
        
        print(f"Validation: expected {expected_file_count} files, got {actual_file_count} files")
        
        if expected_file_count != actual_file_count:
            print(f"Warning: File count mismatch! Expected {expected_file_count}, got {actual_file_count}")
        
    except Exception as e:
        print(f"Error updating processing history: {str(e)}")
        import traceback
        traceback.print_exc()
        return None
    
    # Step Functionsを起動
    step_function_triggered = False
    if STEP_FUNCTION_ARN:
        try:
            execution_name = f"{processing_history_id}-{int(datetime.utcnow().timestamp())}"
            
            # トリガーファイルの内容をそのままStep Functionsに渡す
            sfn_input = trigger_data
            
            print(f"Starting Step Functions execution: {execution_name}")
            print(f"Input: {json.dumps(sfn_input, ensure_ascii=False, default=str)}")
            
            response = sfn_client.start_execution(
                stateMachineArn=STEP_FUNCTION_ARN,
                name=execution_name,
                input=json.dumps(sfn_input, ensure_ascii=False, default=str)
            )
            
            print(f"Step Functions execution started: {response['executionArn']}")
            step_function_triggered = True
            
        except Exception as e:
            print(f"Error starting Step Functions: {str(e)}")
            import traceback
            traceback.print_exc()
            # Step Functions起動エラーは記録するが、処理は継続
    
    return {
        'processingHistoryId': processing_history_id,
        'usageAmountBytes': usageAmountBytes,
        'stepFunctionTriggered': step_function_triggered
    }


# Decimal型をJSONシリアライズ可能にするヘルパー
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)
