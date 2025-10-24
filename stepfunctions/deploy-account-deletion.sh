#!/bin/bash

# アカウント削除自動化システムのデプロイスクリプト

set -e

echo "========================================="
echo "アカウント削除自動化システム デプロイ"
echo "========================================="

# 環境変数の確認
if [ -z "$AWS_ACCOUNT_ID" ]; then
    echo "エラー: AWS_ACCOUNT_ID環境変数が設定されていません"
    exit 1
fi

if [ -z "$COGNITO_USER_POOL_ID" ]; then
    echo "エラー: COGNITO_USER_POOL_ID環境変数が設定されていません"
    exit 1
fi

REGION="ap-northeast-1"
LAMBDA_ROLE_ARN="arn:aws:iam::${AWS_ACCOUNT_ID}:role/lambda-execution-role"
STEPFUNCTIONS_ROLE_ARN="arn:aws:iam::${AWS_ACCOUNT_ID}:role/stepfunctions-execution-role"
EVENTS_ROLE_ARN="arn:aws:iam::${AWS_ACCOUNT_ID}:role/events-stepfunctions-execution-role"

echo ""
echo "Step 1: Lambda関数のデプロイ"
echo "========================================="

# 1. delete-cognito-users
echo "1.1 delete-cognito-users をデプロイ中..."
cd ../lambda/delete-cognito-users
zip -q -r function.zip handler.py

# Lambda関数が存在するか確認
if aws lambda get-function --function-name siftbeam-delete-cognito-users --region $REGION > /dev/null 2>&1; then
    echo "既存の関数を更新します"
    aws lambda update-function-code \
        --function-name siftbeam-delete-cognito-users \
        --zip-file fileb://function.zip \
        --region $REGION > /dev/null
else
    echo "新規に関数を作成します"
    aws lambda create-function \
        --function-name siftbeam-delete-cognito-users \
        --runtime python3.11 \
        --role $LAMBDA_ROLE_ARN \
        --handler handler.lambda_handler \
        --zip-file fileb://function.zip \
        --timeout 900 \
        --memory-size 512 \
        --environment Variables="{COGNITO_USER_POOL_ID=${COGNITO_USER_POOL_ID}}" \
        --region $REGION > /dev/null
fi

rm function.zip
echo "✓ delete-cognito-users デプロイ完了"

# 2. delete-dynamodb-records
echo "1.2 delete-dynamodb-records をデプロイ中..."
cd ../delete-dynamodb-records
zip -q -r function.zip handler.py

if aws lambda get-function --function-name siftbeam-delete-dynamodb-records --region $REGION > /dev/null 2>&1; then
    echo "既存の関数を更新します"
    aws lambda update-function-code \
        --function-name siftbeam-delete-dynamodb-records \
        --zip-file fileb://function.zip \
        --region $REGION > /dev/null
else
    echo "新規に関数を作成します"
    aws lambda create-function \
        --function-name siftbeam-delete-dynamodb-records \
        --runtime python3.11 \
        --role $LAMBDA_ROLE_ARN \
        --handler handler.lambda_handler \
        --zip-file fileb://function.zip \
        --timeout 900 \
        --memory-size 1024 \
        --region $REGION > /dev/null
fi

rm function.zip
echo "✓ delete-dynamodb-records デプロイ完了"

# 3. delete-s3-objects
echo "1.3 delete-s3-objects をデプロイ中..."
cd ../delete-s3-objects
zip -q -r function.zip handler.py

if aws lambda get-function --function-name siftbeam-delete-s3-objects --region $REGION > /dev/null 2>&1; then
    echo "既存の関数を更新します"
    aws lambda update-function-code \
        --function-name siftbeam-delete-s3-objects \
        --zip-file fileb://function.zip \
        --region $REGION > /dev/null
else
    echo "新規に関数を作成します"
    aws lambda create-function \
        --function-name siftbeam-delete-s3-objects \
        --runtime python3.11 \
        --role $LAMBDA_ROLE_ARN \
        --handler handler.lambda_handler \
        --zip-file fileb://function.zip \
        --timeout 900 \
        --memory-size 512 \
        --environment Variables="{S3_BUCKET_NAME=siftbeam}" \
        --region $REGION > /dev/null
fi

rm function.zip
echo "✓ delete-s3-objects デプロイ完了"

echo ""
echo "Step 2: Step Functionsのデプロイ"
echo "========================================="

cd ../../stepfunctions

# Step Functionが存在するか確認
STATE_MACHINE_ARN="arn:aws:states:${REGION}:${AWS_ACCOUNT_ID}:stateMachine:AccountDeletionStateMachine"

if aws stepfunctions describe-state-machine --state-machine-arn $STATE_MACHINE_ARN --region $REGION > /dev/null 2>&1; then
    echo "既存のStep Functionを更新します"
    aws stepfunctions update-state-machine \
        --state-machine-arn $STATE_MACHINE_ARN \
        --definition file://AccountDeletionStateMachine.asl.json \
        --region $REGION > /dev/null
else
    echo "新規にStep Functionを作成します"
    aws stepfunctions create-state-machine \
        --name AccountDeletionStateMachine \
        --definition file://AccountDeletionStateMachine.asl.json \
        --role-arn $STEPFUNCTIONS_ROLE_ARN \
        --region $REGION > /dev/null
fi

echo "✓ Step Functions デプロイ完了"

echo ""
echo "Step 3: CloudWatch Events (EventBridge) の設定"
echo "========================================="

# EventBridgeルールの作成/更新
if aws events describe-rule --name DailyAccountDeletion --region $REGION > /dev/null 2>&1; then
    echo "既存のルールを更新します"
    aws events put-rule \
        --name DailyAccountDeletion \
        --schedule-expression "cron(0 18 * * ? *)" \
        --state ENABLED \
        --region $REGION > /dev/null
else
    echo "新規にルールを作成します"
    aws events put-rule \
        --name DailyAccountDeletion \
        --schedule-expression "cron(0 18 * * ? *)" \
        --state ENABLED \
        --description "毎日午前3時(JST)にアカウント削除処理を実行" \
        --region $REGION > /dev/null
fi

# ターゲットの設定
aws events put-targets \
    --rule DailyAccountDeletion \
    --targets "Id"="1","Arn"="${STATE_MACHINE_ARN}","RoleArn"="${EVENTS_ROLE_ARN}" \
    --region $REGION > /dev/null

echo "✓ CloudWatch Events 設定完了"

echo ""
echo "========================================="
echo "デプロイ完了！"
echo "========================================="
echo ""
echo "次のステップ:"
echo "1. IAM権限が正しく設定されているか確認"
echo "2. Stripe API接続が設定されているか確認"
echo "3. テスト実行: ./test-account-deletion.sh"
echo ""
echo "スケジュール: 毎日午前3時(JST) / 18:00(UTC)"
echo "State Machine ARN: ${STATE_MACHINE_ARN}"
echo ""

