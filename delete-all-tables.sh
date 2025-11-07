#!/bin/bash

# 全てのsiftbeamテーブルを削除するスクリプト
# 使用方法: bash delete-all-tables.sh

REGION="ap-northeast-1"

# 削除するテーブルのリスト
TABLES=(
  "siftbeam-announcements"
  "siftbeam-api-keys"
  "siftbeam-audit-logs"
  "siftbeam-data-usage"
  "siftbeam-group"
  "siftbeam-neworder-reply"
  "siftbeam-neworder-request"
  "siftbeam-policy"
  "siftbeam-policy-analysis"
  "siftbeam-policy-group"
  "siftbeam-policy-stepfunction-mapping"
  "siftbeam-processing-history"
  "siftbeam-support-reply"
  "siftbeam-support-request"
  "siftbeam-usage-limits"
  "siftbeam-user-group"
  "siftbeam-users"
  "siftbeam-verification-codes"
)

echo "=========================================="
echo "全てのsiftbeamテーブルを削除します"
echo "=========================================="
echo ""
echo "削除対象: ${#TABLES[@]}個のテーブル"
echo ""

# 確認
read -p "本当に削除しますか? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
  echo "キャンセルしました。"
  exit 0
fi

echo ""
echo "削除を開始します..."
echo ""

# 各テーブルを削除
for TABLE in "${TABLES[@]}"; do
  echo "削除中: $TABLE"
  aws dynamodb delete-table \
    --table-name "$TABLE" \
    --region "$REGION" \
    --output text > /dev/null 2>&1
  
  if [ $? -eq 0 ]; then
    echo "✓ $TABLE を削除しました"
  else
    echo "✗ $TABLE の削除に失敗しました（存在しない可能性があります）"
  fi
done

echo ""
echo "=========================================="
echo "削除処理が完了しました"
echo "=========================================="
echo ""
echo "全てのテーブルが削除されるまで数分かかる場合があります。"
echo ""
echo "確認コマンド:"
echo "aws dynamodb list-tables --region $REGION --query \"TableNames[?starts_with(@, 'siftbeam')]\""

