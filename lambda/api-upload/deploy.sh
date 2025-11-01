#!/bin/bash

# デプロイスクリプト
# Lambda関数をデプロイします

set -e

FUNCTION_NAME="siftbeam-api-upload"
REGION="ap-northeast-1"
RUNTIME="python3.12"
HANDLER="handler.lambda_handler"
ROLE_NAME="siftbeam-api-upload-role"

echo "========================================="
echo "Lambda関数デプロイ: ${FUNCTION_NAME}"
echo "========================================="

# 1. 依存関係をインストール
echo "1. 依存関係をインストール中..."
if [ -f requirements.txt ]; then
    pip install -r requirements.txt -t ./package
fi

# 2. デプロイパッケージを作成
echo "2. デプロイパッケージを作成中..."
cd package
zip -r ../deployment-package.zip .
cd ..
zip -g deployment-package.zip handler.py

# 3. Lambda関数が存在するか確認
echo "3. Lambda関数の存在確認..."
if aws lambda get-function --function-name ${FUNCTION_NAME} --region ${REGION} 2>/dev/null; then
    echo "   Lambda関数が存在します。更新します..."
    aws lambda update-function-code \
        --function-name ${FUNCTION_NAME} \
        --zip-file fileb://deployment-package.zip \
        --region ${REGION}
else
    echo "   Lambda関数が存在しません。作成します..."
    
    # IAMロールのARNを取得
    ROLE_ARN=$(aws iam get-role --role-name ${ROLE_NAME} --query 'Role.Arn' --output text 2>/dev/null || echo "")
    
    if [ -z "$ROLE_ARN" ]; then
        echo "   エラー: IAMロール '${ROLE_NAME}' が見つかりません。"
        echo "   先にIAMロールを作成してください。"
        exit 1
    fi
    
    aws lambda create-function \
        --function-name ${FUNCTION_NAME} \
        --runtime ${RUNTIME} \
        --role ${ROLE_ARN} \
        --handler ${HANDLER} \
        --zip-file fileb://deployment-package.zip \
        --timeout 30 \
        --memory-size 512 \
        --region ${REGION} \
        --environment Variables="{DYNAMODB_TABLE_NAME=siftbeam-processing-history,S3_BUCKET_NAME=siftbeam,AWS_REGION=${REGION}}"
fi

# 4. クリーンアップ
echo "4. クリーンアップ中..."
rm -rf package
rm deployment-package.zip

echo "========================================="
echo "デプロイ完了!"
echo "========================================="
echo "関数名: ${FUNCTION_NAME}"
echo "リージョン: ${REGION}"
echo ""
echo "次のステップ:"
echo "1. API Gatewayと統合"
echo "2. 環境変数を確認・更新"
echo "3. テストを実行"

