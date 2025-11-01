# API データフロー図

## APIキーからポリシーIDを自動取得する仕組み

### データベース構造

```
┌─────────────────────────────────────┐
│ API Gateway                         │
│ - APIキー発行                        │
│ - gatewayApiKeyId生成               │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ APIキーテーブル (DynamoDB)           │
│ PK: id (APIキーID)                  │
│ - apiName                           │
│ - gatewayApiKeyId (GSI)             │
│ - policyId                          │
│ - customerId                        │
│ - description                       │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ ポリシーテーブル (DynamoDB)          │
│ PK: id (ポリシーID)                 │
│ - policyName                        │
│ - description                       │
│ - acceptedFileTypes                 │
└─────────────────────────────────────┘
```

---

## リクエストフロー

### 1. クライアント → API Gateway

```
POST /batch-upload
Headers:
  x-api-key: J8UAUZmtqJ5RzilDq441N1v0KR55jUqvaTQFgiI7
  Content-Type: application/json

Body:
{
  "filePaths": [
    "/path/to/icon.png",
    "/path/to/icon2.png"
  ]
}
```

**ポイント:**
- ✅ ポリシーIDの指定不要
- ✅ カスタマーIDの指定不要
- ✅ ファイルパスのみ

---

### 2. API Gateway → Lambda

```json
{
  "requestContext": {
    "identity": {
      "apiKeyId": "abc123xyz"  ← API Gatewayが自動付与
    }
  },
  "headers": {
    "x-api-key": "J8UAUZmtqJ5RzilDq441N1v0KR55jUqvaTQFgiI7"
  },
  "body": "{\"filePaths\":[...]}"
}
```

**ポイント:**
- API Gatewayが`apiKeyId`を自動付与
- これが`gatewayApiKeyId`として使用される

---

### 3. Lambda → DynamoDB (APIキーテーブル)

**クエリ:**
```python
api_key_table.query(
    IndexName='gatewayApiKeyId-index',  # GSI使用
    KeyConditionExpression='gatewayApiKeyId = :keyId',
    ExpressionAttributeValues={
        ':keyId': 'abc123xyz'
    }
)
```

**取得データ:**
```json
{
  "id": "apikey-001",
  "apiName": "本番環境API",
  "gatewayApiKeyId": "abc123xyz",
  "policyId": "policy-456",
  "customerId": "cus_TB7TNGpqOEFcst",
  "description": "本番環境用のAPIキー"
}
```

**ポイント:**
- ✅ `gatewayApiKeyId`でクエリ（GSI使用）
- ✅ `policyId`を自動取得
- ✅ `customerId`を自動取得

---

### 4. Lambda → DynamoDB (ポリシーテーブル)

**クエリ:**
```python
policy_table.get_item(
    Key={'id': 'policy-456'}
)
```

**取得データ:**
```json
{
  "id": "policy-456",
  "policyName": "画像処理ポリシー",
  "description": "画像のリサイズと最適化",
  "acceptedFileTypes": ["image/png", "image/jpeg"]
}
```

**ポイント:**
- ✅ `policyId`でポリシー情報を取得
- ✅ `policyName`を取得
- ✅ `acceptedFileTypes`で検証可能

---

### 5. Lambda → DynamoDB (処理履歴作成)

```json
{
  "processing-historyId": "f5b182ac-6150-4006-a3ea-d75128bd057c",
  "userId": "abc123xyz",
  "userName": "本番環境API",
  "customerId": "cus_TB7TNGpqOEFcst",
  "policyId": "policy-456",
  "policyName": "画像処理ポリシー",
  "usageAmountBytes": 0,
  "status": "in_progress",
  "uploadedFileKeys": [
    "service/input/cus_TB7TNGpqOEFcst/f5b182ac-6150-4006-a3ea-d75128bd057c/icon.png",
    "service/input/cus_TB7TNGpqOEFcst/f5b182ac-6150-4006-a3ea-d75128bd057c/icon2.png"
  ],
  "aiTrainingUsage": "allow",
  "createdAt": "2025-01-27T10:30:00.000Z",
  "updatedAt": "2025-01-27T10:30:00.000Z"
}
```

---

### 6. Lambda → S3 (ファイルアップロード)

```
各ファイル:
  s3://siftbeam/service/input/cus_TB7TNGpqOEFcst/f5b182ac-6150-4006-a3ea-d75128bd057c/icon.png
  メタデータ: triggerStepFunction='false'

トリガーファイル:
  s3://siftbeam/service/input/cus_TB7TNGpqOEFcst/f5b182ac-6150-4006-a3ea-d75128bd057c/_trigger.json
  メタデータ: triggerStepFunction='true'
```

---

## 完全なデータフロー図

```
┌──────────────┐
│  クライアント  │
│              │
│ x-api-key:   │
│ J8UAU...     │
└──────┬───────┘
       │ POST /batch-upload
       │ {"filePaths": [...]}
       ↓
┌──────────────────────────────────────┐
│ API Gateway                          │
│                                      │
│ APIキー検証                           │
│ apiKeyId付与: abc123xyz              │
└──────┬───────────────────────────────┘
       │ event.requestContext.identity.apiKeyId
       ↓
┌──────────────────────────────────────┐
│ Lambda (api-batch-upload-simple)     │
│                                      │
│ 1. APIキーID取得: abc123xyz          │
└──────┬───────────────────────────────┘
       │ Query: gatewayApiKeyId = abc123xyz
       ↓
┌──────────────────────────────────────┐
│ DynamoDB (APIキーテーブル)            │
│                                      │
│ GSI: gatewayApiKeyId-index           │
│                                      │
│ 返却:                                 │
│ - policyId: policy-456               │
│ - customerId: cus_TB7TNGpqOEFcst     │
│ - apiName: 本番環境API                │
└──────┬───────────────────────────────┘
       │ policyId: policy-456
       ↓
┌──────────────────────────────────────┐
│ DynamoDB (ポリシーテーブル)           │
│                                      │
│ PK: id = policy-456                  │
│                                      │
│ 返却:                                 │
│ - policyName: 画像処理ポリシー         │
│ - acceptedFileTypes: [...]           │
└──────┬───────────────────────────────┘
       │ すべての情報が揃った
       ↓
┌──────────────────────────────────────┐
│ Lambda (続き)                        │
│                                      │
│ 2. 処理履歴作成                       │
│ 3. ファイル読み込み                   │
│ 4. S3アップロード                     │
│ 5. トリガーファイル作成               │
└──────┬───────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────┐
│ S3                                   │
│                                      │
│ - icon.png (trigger=false)           │
│ - icon2.png (trigger=false)          │
│ - _trigger.json (trigger=true)       │
└──────┬───────────────────────────────┘
       │ S3イベント (trigger=true)
       ↓
┌──────────────────────────────────────┐
│ S3イベントLambda                      │
│                                      │
│ 1. トリガーファイル検証               │
│ 2. Step Functions起動                │
└──────┬───────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────┐
│ Step Functions                       │
│                                      │
│ 全ファイルを処理                      │
└──────────────────────────────────────┘
```

---

## GSI (Global Secondary Index) の重要性

### なぜGSIが必要か？

**問題:**
- API Gatewayが付与する`apiKeyId`は、DynamoDBのPK（`id`）とは異なる
- PKでクエリできない

**解決:**
- `gatewayApiKeyId`にGSIを作成
- GSIでクエリ可能にする

### GSI定義

```typescript
// APIキーテーブルのGSI
{
  IndexName: 'gatewayApiKeyId-index',
  KeySchema: [
    {
      AttributeName: 'gatewayApiKeyId',
      KeyType: 'HASH'
    }
  ],
  Projection: {
    ProjectionType: 'ALL'  // すべての属性を含める
  }
}
```

---

## 環境変数

Lambda関数に必要な環境変数:

```bash
# 処理履歴テーブル
DYNAMODB_TABLE_NAME=siftbeam-processing-history

# APIキーテーブル
APIKEY_TABLE_NAME=siftbeam-api-keys

# ポリシーテーブル
POLICY_TABLE_NAME=siftbeam-policies

# S3バケット
S3_BUCKET_NAME=siftbeam

# リージョン
AWS_REGION=ap-northeast-1
```

---

## IAMポリシー

Lambda関数に必要な権限:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:Query",
        "dynamodb:GetItem",
        "dynamodb:PutItem"
      ],
      "Resource": [
        "arn:aws:dynamodb:*:*:table/siftbeam-api-keys",
        "arn:aws:dynamodb:*:*:table/siftbeam-api-keys/index/gatewayApiKeyId-index",
        "arn:aws:dynamodb:*:*:table/siftbeam-policies",
        "arn:aws:dynamodb:*:*:table/siftbeam-processing-history"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::siftbeam/service/input/*"
    }
  ]
}
```

---

## まとめ

### クライアント側

```python
# 超シンプル!
response = requests.post(
    api_url,
    headers={"x-api-key": "YOUR_API_KEY"},
    json={"filePaths": ["/path/to/file.png"]}
)
```

### Lambda側

```python
# すべて自動取得
api_key_id = event['requestContext']['identity']['apiKeyId']
api_key_info = get_api_key_info(api_key_id)  # → policyId, customerId
policy_info = get_policy_info(api_key_info['policyId'])  # → policyName
```

### 利点

- ✅ クライアント側が超シンプル
- ✅ ポリシーIDの指定不要
- ✅ カスタマーIDの指定不要
- ✅ 情報の一元管理（DynamoDB）
- ✅ セキュリティ向上（APIキーに情報を紐付け）

