# DynamoDBテーブル作成ガイド

## テーブル: siftbeam-storage-usage-daily

### AWS CLI コマンド

```bash
# テーブル作成
aws dynamodb create-table \
  --table-name siftbeam-storage-usage-daily \
  --attribute-definitions \
    AttributeName=customerId,AttributeType=S \
    AttributeName=date,AttributeType=S \
    AttributeName=billingMonth,AttributeType=S \
    AttributeName=billingStatus,AttributeType=S \
  --key-schema \
    AttributeName=customerId,KeyType=HASH \
    AttributeName=date,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --global-secondary-indexes \
    '[
      {
        "IndexName": "billingMonth-customerId-index",
        "KeySchema": [
          {"AttributeName": "billingMonth", "KeyType": "HASH"},
          {"AttributeName": "customerId", "KeyType": "RANGE"}
        ],
        "Projection": {"ProjectionType": "ALL"}
      },
      {
        "IndexName": "billingStatus-date-index",
        "KeySchema": [
          {"AttributeName": "billingStatus", "KeyType": "HASH"},
          {"AttributeName": "date", "KeyType": "RANGE"}
        ],
        "Projection": {"ProjectionType": "ALL"}
      }
    ]' \
  --tags \
    Key=Project,Value=siftbeam \
    Key=Environment,Value=Production \
  --region ap-northeast-1
```

### テーブル確認

```bash
# テーブル情報を確認
aws dynamodb describe-table \
  --table-name siftbeam-storage-usage-daily \
  --region ap-northeast-1
```

---

## テーブル: siftbeam-storage-usage-monthly

### AWS CLI コマンド

```bash
# テーブル作成
aws dynamodb create-table \
  --table-name siftbeam-storage-usage-monthly \
  --attribute-definitions \
    AttributeName=customerId,AttributeType=S \
    AttributeName=billingMonth,AttributeType=S \
    AttributeName=billingStatus,AttributeType=S \
  --key-schema \
    AttributeName=customerId,KeyType=HASH \
    AttributeName=billingMonth,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --global-secondary-indexes \
    '[
      {
        "IndexName": "billingStatus-month-index",
        "KeySchema": [
          {"AttributeName": "billingStatus", "KeyType": "HASH"},
          {"AttributeName": "billingMonth", "KeyType": "RANGE"}
        ],
        "Projection": {"ProjectionType": "ALL"}
      }
    ]' \
  --tags \
    Key=Project,Value=siftbeam \
    Key=Environment,Value=Production \
  --region ap-northeast-1
```

### テーブル確認

```bash
# テーブル情報を確認
aws dynamodb describe-table \
  --table-name siftbeam-storage-usage-monthly \
  --region ap-northeast-1
```

---

## TTL設定（オプション）

### daily テーブル（2年後に自動削除）

```bash
aws dynamodb update-time-to-live \
  --table-name siftbeam-storage-usage-daily \
  --time-to-live-specification \
    "Enabled=true, AttributeName=ttl" \
  --region ap-northeast-1
```

### monthly テーブル（5年後に自動削除）

```bash
aws dynamodb update-time-to-live \
  --table-name siftbeam-storage-usage-monthly \
  --time-to-live-specification \
    "Enabled=true, AttributeName=ttl" \
  --region ap-northeast-1
```

---

## テーブル設計まとめ

### siftbeam-storage-usage-daily

| 項目 | 値 |
|------|-----|
| **PK** | `customerId` (String) |
| **SK** | `date` (String, YYYY-MM-DD) |
| **GSI1 PK** | `billingMonth` (String, YYYY-MM) |
| **GSI1 SK** | `customerId` (String) |
| **GSI2 PK** | `billingStatus` (String) |
| **GSI2 SK** | `date` (String) |
| **Billing Mode** | PAY_PER_REQUEST |

### siftbeam-storage-usage-monthly

| 項目 | 値 |
|------|-----|
| **PK** | `customerId` (String) |
| **SK** | `billingMonth` (String, YYYY-MM) |
| **GSI1 PK** | `billingStatus` (String) |
| **GSI1 SK** | `billingMonth` (String) |
| **Billing Mode** | PAY_PER_REQUEST |

---

## サンプルデータ投入（テスト用）

### daily テーブル

```bash
aws dynamodb put-item \
  --table-name siftbeam-storage-usage-daily \
  --item '{
    "customerId": {"S": "cus_TEST123"},
    "date": {"S": "2025-10-18"},
    "totalStorageBytesInput": {"N": "1234567890"},
    "totalStorageBytesOutput": {"N": "9876543210"},
    "totalStorageBytes": {"N": "11111111100"},
    "fileCountInput": {"N": "150"},
    "fileCountOutput": {"N": "150"},
    "totalFileCount": {"N": "300"},
    "billingMonth": {"S": "2025-10"},
    "billingStatus": {"S": "pending"},
    "calculatedAt": {"S": "2025-10-18T01:05:00Z"}
  }' \
  --region ap-northeast-1
```

### monthly テーブル

```bash
aws dynamodb put-item \
  --table-name siftbeam-storage-usage-monthly \
  --item '{
    "customerId": {"S": "cus_TEST123"},
    "billingMonth": {"S": "2025-10"},
    "averageStorageBytes": {"N": "10000000000"},
    "peakStorageBytes": {"N": "15000000000"},
    "totalStorageDays": {"N": "31"},
    "dailyUsageSum": {"N": "310000000000"},
    "stripeMeterStatus": {"S": "success"},
    "stripeMeterAmount": {"N": "10000000000"},
    "calculatedAt": {"S": "2025-11-01T02:05:00Z"},
    "billingStatus": {"S": "billed"}
  }' \
  --region ap-northeast-1
```

---

## クエリ例

### 特定顧客の特定日データを取得

```bash
aws dynamodb query \
  --table-name siftbeam-storage-usage-daily \
  --key-condition-expression "customerId = :cid AND #d = :date" \
  --expression-attribute-names '{"#d": "date"}' \
  --expression-attribute-values '{
    ":cid": {"S": "cus_TEST123"},
    ":date": {"S": "2025-10-18"}
  }' \
  --region ap-northeast-1
```

### 特定月の全顧客データを取得（GSI1使用）

```bash
aws dynamodb query \
  --table-name siftbeam-storage-usage-daily \
  --index-name billingMonth-customerId-index \
  --key-condition-expression "billingMonth = :month" \
  --expression-attribute-values '{
    ":month": {"S": "2025-10"}
  }' \
  --region ap-northeast-1
```

### 未請求データを取得（GSI2使用）

```bash
aws dynamodb query \
  --table-name siftbeam-storage-usage-daily \
  --index-name billingStatus-date-index \
  --key-condition-expression "billingStatus = :status" \
  --expression-attribute-values '{
    ":status": {"S": "pending"}
  }' \
  --region ap-northeast-1
```

---

## テーブル削除（注意）

```bash
# daily テーブル削除
aws dynamodb delete-table \
  --table-name siftbeam-storage-usage-daily \
  --region ap-northeast-1

# monthly テーブル削除
aws dynamodb delete-table \
  --table-name siftbeam-storage-usage-monthly \
  --region ap-northeast-1
```

---

**最終更新**: 2025-10-18

