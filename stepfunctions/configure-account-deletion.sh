#!/bin/bash

# アカウント削除Step Functionの設定スクリプト

set -e

echo "========================================="
echo "アカウント削除Step Function 設定"
echo "========================================="

# 環境変数の確認
if [ -z "$COGNITO_USER_POOL_ID" ]; then
    echo "エラー: COGNITO_USER_POOL_ID環境変数が設定されていません"
    echo "例: export COGNITO_USER_POOL_ID=ap-northeast-1_xxxxxxxxx"
    exit 1
fi

if [ -z "$S3_BUCKET_NAME" ]; then
    echo "警告: S3_BUCKET_NAME環境変数が設定されていません。デフォルト値 'siftbeam' を使用します"
    S3_BUCKET_NAME="siftbeam"
fi

if [ -z "$STRIPE_CONNECTION_ARN" ]; then
    echo "エラー: STRIPE_CONNECTION_ARN環境変数が設定されていません"
    echo "例: export STRIPE_CONNECTION_ARN=arn:aws:events:ap-northeast-1:xxxxx:connection/..."
    exit 1
fi

echo ""
echo "設定値:"
echo "  Cognito User Pool ID: ${COGNITO_USER_POOL_ID}"
echo "  S3 Bucket Name: ${S3_BUCKET_NAME}"
echo "  Stripe Connection ARN: ${STRIPE_CONNECTION_ARN}"
echo ""

# バックアップを作成
if [ ! -f "AccountDeletionStateMachine-Direct.asl.json.backup" ]; then
    cp AccountDeletionStateMachine-Direct.asl.json AccountDeletionStateMachine-Direct.asl.json.backup
    echo "✓ バックアップを作成しました: AccountDeletionStateMachine-Direct.asl.json.backup"
fi

# 設定ファイルを作成
cat AccountDeletionStateMachine-Direct.asl.json.backup | \
  sed "s|ap-northeast-1_xxxxxxxxx|${COGNITO_USER_POOL_ID}|g" | \
  sed "s|\"s3Bucket\": \"siftbeam\"|\"s3Bucket\": \"${S3_BUCKET_NAME}\"|g" | \
  sed "s|arn:aws:events:ap-northeast-1:002689294103:connection/Stripe-Production-Connection/b711004d-52d7-4b35-8b29-9f33e9e3a054|${STRIPE_CONNECTION_ARN}|g" \
  > AccountDeletionStateMachine-Direct.asl.json

echo "✓ 設定を適用しました"

echo ""
echo "========================================="
echo "設定完了"
echo "========================================="
echo ""
echo "次のステップ:"
echo "1. 設定内容を確認:"
echo "   cat AccountDeletionStateMachine-Direct.asl.json | grep -E 'cognitoUserPoolId|s3Bucket|ConnectionArn'"
echo ""
echo "2. デプロイ:"
echo "   ./deploy-direct.sh"
echo ""

