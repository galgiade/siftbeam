#!/bin/bash

# Lambda関数の個別テストスクリプト

set -e

echo "========================================="
echo "Lambda関数 個別テスト"
echo "========================================="

REGION="ap-northeast-1"
TEST_CUSTOMER_ID="${1:-cus_test123}"

echo ""
echo "テスト対象 Customer ID: ${TEST_CUSTOMER_ID}"
echo ""
echo "警告: このスクリプトは実際にリソースを削除します！"
echo "テスト用のCustomer IDを使用してください。"
echo ""
read -p "続行しますか? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "テストをキャンセルしました"
    exit 0
fi

echo ""
echo "========================================="
echo "1. delete-cognito-users のテスト"
echo "========================================="

aws lambda invoke \
    --function-name siftbeam-delete-cognito-users \
    --payload "{\"customerId\":\"${TEST_CUSTOMER_ID}\",\"executionId\":\"test\"}" \
    --region $REGION \
    response-cognito.json > /dev/null

echo "結果:"
cat response-cognito.json | jq '.'
echo ""

echo "========================================="
echo "2. delete-dynamodb-records のテスト"
echo "========================================="

aws lambda invoke \
    --function-name siftbeam-delete-dynamodb-records \
    --payload "{\"customerId\":\"${TEST_CUSTOMER_ID}\",\"executionId\":\"test\"}" \
    --region $REGION \
    response-dynamodb.json > /dev/null

echo "結果:"
cat response-dynamodb.json | jq '.'
echo ""

echo "========================================="
echo "3. delete-s3-objects のテスト"
echo "========================================="

aws lambda invoke \
    --function-name siftbeam-delete-s3-objects \
    --payload "{\"customerId\":\"${TEST_CUSTOMER_ID}\",\"executionId\":\"test\"}" \
    --region $REGION \
    response-s3.json > /dev/null

echo "結果:"
cat response-s3.json | jq '.'
echo ""

echo "========================================="
echo "テスト完了"
echo "========================================="

# レスポンスファイルを削除
rm -f response-cognito.json response-dynamodb.json response-s3.json

echo ""
echo "全てのLambda関数が正常に実行されました"
echo ""

