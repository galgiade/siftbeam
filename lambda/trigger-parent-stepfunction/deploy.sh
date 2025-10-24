#!/bin/bash

# Lambda関数デプロイスクリプト
# 使い方: ./deploy.sh [function-name] [role-arn] [state-machine-arn]

set -e

# カラー定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# デフォルト値
FUNCTION_NAME=${1:-"TriggerParentStepFunction"}
ROLE_ARN=${2:-""}
STATE_MACHINE_ARN=${3:-""}
REGION=${AWS_REGION:-"ap-northeast-1"}
RUNTIME="python3.12"
HANDLER="handler.lambda_handler"
TIMEOUT=30
MEMORY_SIZE=256
TABLE_NAME="siftbeam-processing-history"

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}Lambda Function Deployment Script${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""

# 引数チェック
if [ -z "$ROLE_ARN" ]; then
    echo -e "${RED}Error: IAM Role ARN is required${NC}"
    echo "Usage: ./deploy.sh [function-name] [role-arn] [state-machine-arn]"
    echo "Example:"
    echo "  ./deploy.sh TriggerParentStepFunction \\"
    echo "    arn:aws:iam::123456789012:role/LambdaS3StepFunctionsRole \\"
    echo "    arn:aws:states:ap-northeast-1:123456789012:stateMachine:ServiceProcessingOrchestrator"
    exit 1
fi

if [ -z "$STATE_MACHINE_ARN" ]; then
    echo -e "${RED}Error: State Machine ARN is required${NC}"
    echo "Usage: ./deploy.sh [function-name] [role-arn] [state-machine-arn]"
    exit 1
fi

echo -e "${YELLOW}Configuration:${NC}"
echo "  Function Name: $FUNCTION_NAME"
echo "  Role ARN: $ROLE_ARN"
echo "  State Machine ARN: $STATE_MACHINE_ARN"
echo "  Region: $REGION"
echo "  Runtime: $RUNTIME"
echo "  Table Name: $TABLE_NAME"
echo ""

# ZIPファイルの作成
echo -e "${YELLOW}Step 1: Creating ZIP file...${NC}"
rm -f function.zip
zip -q function.zip handler.py requirements.txt
echo -e "${GREEN}✓ ZIP file created${NC}"
echo ""

# Lambda関数が存在するかチェック
echo -e "${YELLOW}Step 2: Checking if function exists...${NC}"
if aws lambda get-function --function-name "$FUNCTION_NAME" --region "$REGION" > /dev/null 2>&1; then
    echo -e "${YELLOW}Function exists. Updating...${NC}"
    
    # 関数コードの更新
    aws lambda update-function-code \
        --function-name "$FUNCTION_NAME" \
        --zip-file fileb://function.zip \
        --region "$REGION" \
        --no-cli-pager > /dev/null
    
    echo -e "${GREEN}✓ Function code updated${NC}"
    
    # 設定の更新
    aws lambda update-function-configuration \
        --function-name "$FUNCTION_NAME" \
        --runtime "$RUNTIME" \
        --handler "$HANDLER" \
        --timeout "$TIMEOUT" \
        --memory-size "$MEMORY_SIZE" \
        --environment "Variables={PROCESSING_HISTORY_TABLE=$TABLE_NAME,PARENT_STATE_MACHINE_ARN=$STATE_MACHINE_ARN}" \
        --region "$REGION" \
        --no-cli-pager > /dev/null
    
    echo -e "${GREEN}✓ Function configuration updated${NC}"
else
    echo -e "${YELLOW}Function does not exist. Creating...${NC}"
    
    # 新規作成
    aws lambda create-function \
        --function-name "$FUNCTION_NAME" \
        --runtime "$RUNTIME" \
        --role "$ROLE_ARN" \
        --handler "$HANDLER" \
        --zip-file fileb://function.zip \
        --timeout "$TIMEOUT" \
        --memory-size "$MEMORY_SIZE" \
        --environment "Variables={PROCESSING_HISTORY_TABLE=$TABLE_NAME,PARENT_STATE_MACHINE_ARN=$STATE_MACHINE_ARN}" \
        --region "$REGION" \
        --no-cli-pager > /dev/null
    
    echo -e "${GREEN}✓ Function created${NC}"
fi
echo ""

# S3からの呼び出し権限を追加
echo -e "${YELLOW}Step 3: Adding S3 invoke permission...${NC}"
aws lambda add-permission \
    --function-name "$FUNCTION_NAME" \
    --statement-id S3InvokeFunction \
    --action lambda:InvokeFunction \
    --principal s3.amazonaws.com \
    --source-arn arn:aws:s3:::siftbeam \
    --region "$REGION" \
    --no-cli-pager > /dev/null 2>&1 || echo -e "${YELLOW}  (Permission may already exist)${NC}"
echo -e "${GREEN}✓ Permission configured${NC}"
echo ""

# クリーンアップ
rm -f function.zip

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}Deployment Completed Successfully!${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Configure S3 event notification:"
echo "   - S3 Console → Bucket → Properties → Event notifications"
echo "   - Create event notification with:"
echo "     - Name: TriggerServiceProcessing"
echo "     - Event type: All object create events"
echo "     - Prefix: service/input/"
echo "     - Destination: Lambda function → $FUNCTION_NAME"
echo ""
echo "2. Test the function:"
echo "   - Upload a test file to s3://siftbeam/service/input/customer-test/processing-test/test.jpg"
echo "   - Check CloudWatch Logs for execution details"
echo ""
echo "3. Monitor the function:"
echo "   - CloudWatch Logs: /aws/lambda/$FUNCTION_NAME"
echo "   - CloudWatch Metrics: Lambda → $FUNCTION_NAME"

