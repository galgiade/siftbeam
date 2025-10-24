#!/bin/bash

################################################################################
# TestCopyFile Lambda デプロイスクリプト
# 
# 使用方法:
#   ./deploy.sh
#
# 前提条件:
#   - AWS CLI がインストールされている
#   - AWS認証情報が設定されている
#   - 適切なIAM権限がある
################################################################################

set -e

# 変数設定
FUNCTION_NAME="TestCopyFile"
RUNTIME="python3.13"
HANDLER="handler.lambda_handler"
ROLE_NAME="${FUNCTION_NAME}Role"
POLICY_NAME="${FUNCTION_NAME}Policy"
REGION="ap-northeast-1"
S3_BUCKET="siftbeam"

# 色付きログ
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# AWSアカウントID取得
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
log_info "AWS Account ID: ${AWS_ACCOUNT_ID}"

# デプロイパッケージ作成
log_info "Creating deployment package..."
rm -f function.zip
zip -r function.zip handler.py

log_info "Deployment package created: function.zip"

# IAMロール存在確認
log_info "Checking if IAM role exists..."
if aws iam get-role --role-name ${ROLE_NAME} 2>/dev/null; then
    log_info "IAM role ${ROLE_NAME} already exists"
else
    log_info "Creating IAM role ${ROLE_NAME}..."
    
    # Trust Policy作成
    cat > trust-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

    aws iam create-role \
        --role-name ${ROLE_NAME} \
        --assume-role-policy-document file://trust-policy.json
    
    log_info "IAM role created successfully"
    rm trust-policy.json
fi

# IAMポリシーアタッチ
log_info "Attaching IAM policy..."

POLICY_ARN="arn:aws:iam::${AWS_ACCOUNT_ID}:policy/${POLICY_NAME}"

if aws iam get-policy --policy-arn ${POLICY_ARN} 2>/dev/null; then
    log_info "Policy ${POLICY_NAME} already exists, updating..."
    
    # 新しいバージョンを作成
    aws iam create-policy-version \
        --policy-arn ${POLICY_ARN} \
        --policy-document file://iam-policy.json \
        --set-as-default
else
    log_info "Creating policy ${POLICY_NAME}..."
    
    aws iam create-policy \
        --policy-name ${POLICY_NAME} \
        --policy-document file://iam-policy.json
fi

# ポリシーをロールにアタッチ
aws iam attach-role-policy \
    --role-name ${ROLE_NAME} \
    --policy-arn ${POLICY_ARN} 2>/dev/null || log_warn "Policy already attached"

log_info "IAM policy attached successfully"

# Lambda関数存在確認
log_info "Checking if Lambda function exists..."
if aws lambda get-function --function-name ${FUNCTION_NAME} 2>/dev/null; then
    log_info "Lambda function ${FUNCTION_NAME} already exists, updating..."
    
    aws lambda update-function-code \
        --function-name ${FUNCTION_NAME} \
        --zip-file fileb://function.zip \
        --region ${REGION}
    
    log_info "Waiting for function update to complete..."
    aws lambda wait function-updated --function-name ${FUNCTION_NAME} --region ${REGION}
    
    # 環境変数更新
    aws lambda update-function-configuration \
        --function-name ${FUNCTION_NAME} \
        --environment "Variables={S3_BUCKET=${S3_BUCKET}}" \
        --region ${REGION}
    
    log_info "Lambda function updated successfully"
else
    log_info "Creating Lambda function ${FUNCTION_NAME}..."
    
    # IAMロールの準備完了まで待機
    log_info "Waiting for IAM role to be ready..."
    sleep 10
    
    aws lambda create-function \
        --function-name ${FUNCTION_NAME} \
        --runtime ${RUNTIME} \
        --role arn:aws:iam::${AWS_ACCOUNT_ID}:role/${ROLE_NAME} \
        --handler ${HANDLER} \
        --zip-file fileb://function.zip \
        --timeout 60 \
        --memory-size 256 \
        --environment "Variables={S3_BUCKET=${S3_BUCKET}}" \
        --region ${REGION}
    
    log_info "Lambda function created successfully"
fi

# クリーンアップ
log_info "Cleaning up..."
rm -f function.zip

log_info "=========================================="
log_info "Deployment completed successfully!"
log_info "=========================================="
log_info "Function Name: ${FUNCTION_NAME}"
log_info "Region: ${REGION}"
log_info "Role: ${ROLE_NAME}"
log_info ""
log_info "Next steps:"
log_info "1. Test the Lambda function"
log_info "2. Create TestCopyStateMachine Step Function"
log_info "3. Add mapping to siftbeam-policy-stepfunction-mapping table"

