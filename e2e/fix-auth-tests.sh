#!/bin/bash

# 認証が必要なテストファイルのリスト
AUTH_REQUIRED_TESTS=(
  "user-management.spec.ts"
  "group-management.spec.ts"
  "policy-management.spec.ts"
  "payment.spec.ts"
  "api-keys.spec.ts"
  "usage-limit.spec.ts"
  "audit-log.spec.ts"
  "company-info.spec.ts"
  "account-deletion.spec.ts"
  "support.spec.ts"
  "announcement.spec.ts"
  "new-order.spec.ts"
  "group.spec.ts"
)

echo "認証が必要なテストファイルを修正中..."

for file in "${AUTH_REQUIRED_TESTS[@]}"; do
  filepath="e2e/$file"
  
  if [ -f "$filepath" ]; then
    echo "処理中: $file"
    
    # 既に test.use が含まれている場合はスキップ
    if grep -q "test.use({ storageState:" "$filepath"; then
      echo "  → スキップ（既に修正済み）"
      continue
    fi
    
    # サインイン処理を削除して認証状態を使用するように修正
    # この処理は複雑なので、個別に修正する必要があります
    echo "  → 手動で修正が必要"
  else
    echo "スキップ: $file (ファイルが存在しません)"
  fi
done

echo "完了！"

