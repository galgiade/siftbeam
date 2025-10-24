#!/bin/bash

# Lambda関数名
FUNCTION_NAME="siftbeam-delete-s3-objects"

# ZIPファイルを作成
zip -r function.zip handler.py

# Lambda関数を更新（初回はcreate-functionを使用）
aws lambda update-function-code \
  --function-name $FUNCTION_NAME \
  --zip-file fileb://function.zip \
  --region ap-northeast-1

# ZIPファイルを削除
rm function.zip

echo "Lambda function $FUNCTION_NAME deployed successfully!"

