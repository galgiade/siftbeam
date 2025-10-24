#!/bin/bash

# アカウント削除自動化（Lambda不要版）のデプロイスクリプト

set -e

echo "========================================="
echo "アカウント削除自動化 デプロイ（Lambda不要版）"
echo "========================================="

# 環境変数の確認
if [ -z "$AWS_ACCOUNT_ID" ]; then
    echo "エラー: AWS_ACCOUNT_ID環境変数が設定されていません"
    exit 1
fi

REGION="ap-northeast-1"
STATE_MACHINE_NAME="AccountDeletionStateMachine-Direct"
STEPFUNCTIONS_ROLE_ARN="arn:aws:iam::${AWS_ACCOUNT_ID}:role/stepfunctions-execution-role"
EVENTS_ROLE_ARN="arn:aws:iam::${AWS_ACCOUNT_ID}:role/events-stepfunctions-execution-role"
STATE_MACHINE_ARN="arn:aws:states:${REGION}:${AWS_ACCOUNT_ID}:stateMachine:${STATE_MACHINE_NAME}"

echo ""
echo "設定:"
echo "  AWS Account ID: ${AWS_ACCOUNT_ID}"
echo "  Region: ${REGION}"
echo "  State Machine: ${STATE_MACHINE_NAME}"
echo ""

echo "Step 1: Step Functionsのデプロイ"
echo "========================================="

# Step Functionが存在するか確認
if aws stepfunctions describe-state-machine --state-machine-arn $STATE_MACHINE_ARN --region $REGION > /dev/null 2>&1; then
    echo "既存のStep Functionを更新します"
    aws stepfunctions update-state-machine \
        --state-machine-arn $STATE_MACHINE_ARN \
        --definition file://AccountDeletionStateMachine-Direct.asl.json \
        --region $REGION > /dev/null
    echo "✓ Step Function更新完了"
else
    echo "新規にStep Functionを作成します"
    aws stepfunctions create-state-machine \
        --name $STATE_MACHINE_NAME \
        --definition file://AccountDeletionStateMachine-Direct.asl.json \
        --role-arn $STEPFUNCTIONS_ROLE_ARN \
        --region $REGION > /dev/null
    echo "✓ Step Function作成完了"
fi

echo ""
echo "Step 2: CloudWatch Events (EventBridge) の設定"
echo "========================================="

RULE_NAME="DailyAccountDeletionDirect"

# EventBridgeルールの作成/更新
if aws events describe-rule --name $RULE_NAME --region $REGION > /dev/null 2>&1; then
    echo "既存のルールを更新します"
    aws events put-rule \
        --name $RULE_NAME \
        --schedule-expression "cron(0 18 * * ? *)" \
        --state ENABLED \
        --region $REGION > /dev/null
else
    echo "新規にルールを作成します"
    aws events put-rule \
        --name $RULE_NAME \
        --schedule-expression "cron(0 18 * * ? *)" \
        --state ENABLED \
        --description "毎日午前3時(JST)にアカウント削除処理を実行（Lambda不要版）" \
        --region $REGION > /dev/null
fi

# ターゲットの設定
aws events put-targets \
    --rule $RULE_NAME \
    --targets "Id"="1","Arn"="${STATE_MACHINE_ARN}","RoleArn"="${EVENTS_ROLE_ARN}" \
    --region $REGION > /dev/null

echo "✓ CloudWatch Events 設定完了"

echo ""
echo "========================================="
echo "デプロイ完了！"
echo "========================================="
echo ""
echo "Lambda関数は不要です！"
echo ""
echo "次のステップ:"
echo "1. Step Function定義内の設定値を確認:"
echo "   - cognitoUserPoolId"
echo "   - s3Bucket"
echo "   - Stripe ConnectionArn"
echo ""
echo "2. IAM権限が正しく設定されているか確認"
echo "   詳細: docs/account-deletion-direct.md"
echo ""
echo "3. テスト実行:"
echo "   aws stepfunctions start-execution \\"
echo "     --state-machine-arn ${STATE_MACHINE_ARN} \\"
echo "     --input '{}' \\"
echo "     --region ${REGION}"
echo ""
echo "スケジュール: 毎日午前3時(JST) / 18:00(UTC)"
echo "State Machine ARN: ${STATE_MACHINE_ARN}"
echo ""
echo "コンソールで確認:"
echo "https://console.aws.amazon.com/states/home?region=${REGION}#/statemachines/view/${STATE_MACHINE_ARN}"
echo ""

