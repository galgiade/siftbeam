#!/bin/bash

# アカウント削除自動化システムのテストスクリプト

set -e

echo "========================================="
echo "アカウント削除自動化システム テスト"
echo "========================================="

# 環境変数の確認
if [ -z "$AWS_ACCOUNT_ID" ]; then
    echo "エラー: AWS_ACCOUNT_ID環境変数が設定されていません"
    exit 1
fi

REGION="ap-northeast-1"
STATE_MACHINE_ARN="arn:aws:states:${REGION}:${AWS_ACCOUNT_ID}:stateMachine:AccountDeletionStateMachine"

echo ""
echo "Step Function を手動実行します..."
echo "State Machine ARN: ${STATE_MACHINE_ARN}"
echo ""

# Step Functionを実行
EXECUTION_ARN=$(aws stepfunctions start-execution \
    --state-machine-arn $STATE_MACHINE_ARN \
    --input '{}' \
    --region $REGION \
    --query 'executionArn' \
    --output text)

echo "実行開始: ${EXECUTION_ARN}"
echo ""
echo "実行状態を監視中..."

# 実行完了まで待機
while true; do
    STATUS=$(aws stepfunctions describe-execution \
        --execution-arn $EXECUTION_ARN \
        --region $REGION \
        --query 'status' \
        --output text)
    
    echo "現在のステータス: ${STATUS}"
    
    if [ "$STATUS" = "SUCCEEDED" ]; then
        echo ""
        echo "✓ 実行成功！"
        break
    elif [ "$STATUS" = "FAILED" ] || [ "$STATUS" = "TIMED_OUT" ] || [ "$STATUS" = "ABORTED" ]; then
        echo ""
        echo "✗ 実行失敗: ${STATUS}"
        
        # エラー詳細を取得
        echo ""
        echo "エラー詳細:"
        aws stepfunctions describe-execution \
            --execution-arn $EXECUTION_ARN \
            --region $REGION \
            --query 'output' \
            --output text
        
        exit 1
    fi
    
    sleep 5
done

echo ""
echo "実行結果を取得中..."
echo ""

# 実行結果を表示
aws stepfunctions describe-execution \
    --execution-arn $EXECUTION_ARN \
    --region $REGION \
    --query 'output' \
    --output text | jq '.'

echo ""
echo "========================================="
echo "テスト完了"
echo "========================================="
echo ""
echo "詳細を確認:"
echo "aws stepfunctions describe-execution --execution-arn ${EXECUTION_ARN} --region ${REGION}"
echo ""
echo "CloudWatch Logsを確認:"
echo "- /aws/lambda/siftbeam-delete-cognito-users"
echo "- /aws/lambda/siftbeam-delete-dynamodb-records"
echo "- /aws/lambda/siftbeam-delete-s3-objects"
echo ""

