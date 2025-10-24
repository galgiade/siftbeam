# IAMポリシー設定ガイド: TriggerParentStepFunction

## 問題の説明

IAMポリシーで`s3:HeadObject`を指定すると、以下のエラーが発生します:

```
認識されないアクション
アクション: HeadObject
```

## 原因

**`HeadObject`は独立したIAMアクションではありません。**

S3の`HeadObject` APIは、IAMポリシーでは`s3:GetObject`権限でカバーされます。

### S3のIAMアクションについて

| S3 API | IAMアクション | 説明 |
|--------|-------------|------|
| `GetObject` | `s3:GetObject` | オブジェクトの取得 |
| `HeadObject` | `s3:GetObject` | オブジェクトのメタデータのみ取得 |
| `PutObject` | `s3:PutObject` | オブジェクトのアップロード |
| `DeleteObject` | `s3:DeleteObject` | オブジェクトの削除 |
| `ListBucket` | `s3:ListBucket` | バケット内のオブジェクト一覧 |

**重要**: `HeadObject` APIを使用する場合でも、IAMポリシーには`s3:GetObject`を指定します。

---

## 正しいIAMポリシー

### Lambda実行ロール用ポリシー

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "S3ReadAccess",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:GetObjectVersion"
      ],
      "Resource": "arn:aws:s3:::siftbeam/service/input/*"
    },
    {
      "Sid": "DynamoDBReadAccess",
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem"
      ],
      "Resource": "arn:aws:dynamodb:*:*:table/siftbeam-processing-history"
    },
    {
      "Sid": "StepFunctionsStartExecution",
      "Effect": "Allow",
      "Action": [
        "states:StartExecution"
      ],
      "Resource": "arn:aws:states:*:*:stateMachine:ServiceProcessingOrchestrator"
    },
    {
      "Sid": "CloudWatchLogsAccess",
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    }
  ]
}
```

---

## 設定手順

### 方法1: AWS CLIで設定

#### ステップ1: IAMロールの作成

```bash
# 信頼ポリシーを作成
cat > trust-policy.json << 'EOF'
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

# IAMロールを作成
aws iam create-role \
  --role-name LambdaS3StepFunctionsRole \
  --assume-role-policy-document file://trust-policy.json \
  --description "Lambda execution role for TriggerParentStepFunction"
```

#### ステップ2: ポリシーをアタッチ

```bash
# インラインポリシーとしてアタッチ
aws iam put-role-policy \
  --role-name LambdaS3StepFunctionsRole \
  --policy-name LambdaS3StepFunctionsPolicy \
  --policy-document file://lambda/trigger-parent-stepfunction/iam-policy.json
```

または

```bash
# マネージドポリシーとして作成してアタッチ
aws iam create-policy \
  --policy-name LambdaS3StepFunctionsPolicy \
  --policy-document file://lambda/trigger-parent-stepfunction/iam-policy.json

# ポリシーをロールにアタッチ
aws iam attach-role-policy \
  --role-name LambdaS3StepFunctionsRole \
  --policy-arn arn:aws:iam::YOUR_ACCOUNT_ID:policy/LambdaS3StepFunctionsPolicy
```

#### ステップ3: 確認

```bash
# ロールのポリシーを確認
aws iam get-role-policy \
  --role-name LambdaS3StepFunctionsRole \
  --policy-name LambdaS3StepFunctionsPolicy
```

---

### 方法2: AWSコンソールで設定

#### ステップ1: IAMロールの作成

1. IAMコンソールを開く
2. **「ロール」** → **「ロールを作成」**
3. 信頼されたエンティティタイプ: **「AWSのサービス」**
4. ユースケース: **「Lambda」**
5. **「次へ」** をクリック

#### ステップ2: ポリシーの作成

1. **「ポリシーを作成」** をクリック（新しいタブが開く）
2. **「JSON」** タブを選択
3. 以下のJSONを貼り付け:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "S3ReadAccess",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:GetObjectVersion"
      ],
      "Resource": "arn:aws:s3:::siftbeam/service/input/*"
    },
    {
      "Sid": "DynamoDBReadAccess",
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem"
      ],
      "Resource": "arn:aws:dynamodb:*:*:table/siftbeam-processing-history"
    },
    {
      "Sid": "StepFunctionsStartExecution",
      "Effect": "Allow",
      "Action": [
        "states:StartExecution"
      ],
      "Resource": "arn:aws:states:*:*:stateMachine:ServiceProcessingOrchestrator"
    },
    {
      "Sid": "CloudWatchLogsAccess",
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    }
  ]
}
```

4. **「次へ」** をクリック
5. ポリシー名: `LambdaS3StepFunctionsPolicy`
6. 説明: `Policy for TriggerParentStepFunction Lambda`
7. **「ポリシーを作成」** をクリック

#### ステップ3: ポリシーをロールにアタッチ

1. ロール作成画面に戻る
2. 検索ボックスで `LambdaS3StepFunctionsPolicy` を検索
3. チェックボックスを選択
4. **「次へ」** をクリック
5. ロール名: `LambdaS3StepFunctionsRole`
6. 説明: `Lambda execution role for TriggerParentStepFunction`
7. **「ロールを作成」** をクリック

---

### 方法3: ビジュアルエディタで設定

#### ステップ1: S3アクセス

1. **「サービスを選択」**: `S3`
2. **「アクション」**: 
   - **「読み取り」** を展開
   - ✅ `GetObject`
   - ✅ `GetObjectVersion`
3. **「リソース」**: 
   - **「特定」** を選択
   - **「ARNを追加」**: `arn:aws:s3:::siftbeam/service/input/*`

#### ステップ2: DynamoDBアクセス

1. **「別のステートメントを追加」**
2. **「サービスを選択」**: `DynamoDB`
3. **「アクション」**:
   - **「読み取り」** を展開
   - ✅ `GetItem`
4. **「リソース」**:
   - **「特定」** を選択
   - **「ARNを追加」**: `arn:aws:dynamodb:*:*:table/siftbeam-processing-history`

#### ステップ3: Step Functionsアクセス

1. **「別のステートメントを追加」**
2. **「サービスを選択」**: `Step Functions`
3. **「アクション」**:
   - **「書き込み」** を展開
   - ✅ `StartExecution`
4. **「リソース」**:
   - **「特定」** を選択
   - **「ARNを追加」**: `arn:aws:states:*:*:stateMachine:ServiceProcessingOrchestrator`

#### ステップ4: CloudWatch Logsアクセス

1. **「別のステートメントを追加」**
2. **「サービスを選択」**: `CloudWatch Logs`
3. **「アクション」**:
   - **「書き込み」** を展開
   - ✅ `CreateLogGroup`
   - ✅ `CreateLogStream`
   - ✅ `PutLogEvents`
4. **「リソース」**:
   - **「すべてのリソース」** を選択

---

## よくある間違いと修正

### ❌ 間違い1: `s3:HeadObject`を指定

```json
{
  "Action": [
    "s3:GetObject",
    "s3:HeadObject"  ← これはエラーになる
  ]
}
```

**エラー**: "認識されないアクション: HeadObject"

### ✅ 正しい方法

```json
{
  "Action": [
    "s3:GetObject",
    "s3:GetObjectVersion"
  ]
}
```

**説明**: `s3:GetObject`だけで`HeadObject` APIも使用可能

---

### ❌ 間違い2: リソースARNが不正確

```json
{
  "Resource": "arn:aws:s3:::siftbeam"  ← バケット自体を指定
}
```

**問題**: オブジェクトにアクセスできない

### ✅ 正しい方法

```json
{
  "Resource": "arn:aws:s3:::siftbeam/service/input/*"  ← オブジェクトパスを指定
}
```

---

### ❌ 間違い3: DynamoDBのリージョンを固定

```json
{
  "Resource": "arn:aws:dynamodb:ap-northeast-1:123456789012:table/siftbeam-processing-history"
}
```

**問題**: リージョンを変更すると動作しない

### ✅ 推奨方法（開発環境）

```json
{
  "Resource": "arn:aws:dynamodb:*:*:table/siftbeam-processing-history"
}
```

### ✅ 推奨方法（本番環境）

```json
{
  "Resource": "arn:aws:dynamodb:ap-northeast-1:123456789012:table/siftbeam-processing-history"
}
```

**説明**: 本番環境では具体的なARNを指定する方がセキュア

---

## 最小権限の原則

### 開発環境用（柔軟）

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:GetObjectVersion"],
      "Resource": "arn:aws:s3:::siftbeam/service/input/*"
    },
    {
      "Effect": "Allow",
      "Action": ["dynamodb:GetItem"],
      "Resource": "arn:aws:dynamodb:*:*:table/siftbeam-processing-history"
    },
    {
      "Effect": "Allow",
      "Action": ["states:StartExecution"],
      "Resource": "arn:aws:states:*:*:stateMachine:ServiceProcessingOrchestrator"
    },
    {
      "Effect": "Allow",
      "Action": ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"],
      "Resource": "arn:aws:logs:*:*:*"
    }
  ]
}
```

### 本番環境用（厳密）

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject"],
      "Resource": "arn:aws:s3:::siftbeam/service/input/*",
      "Condition": {
        "StringEquals": {
          "aws:RequestedRegion": "ap-northeast-1"
        }
      }
    },
    {
      "Effect": "Allow",
      "Action": ["dynamodb:GetItem"],
      "Resource": "arn:aws:dynamodb:ap-northeast-1:123456789012:table/siftbeam-processing-history"
    },
    {
      "Effect": "Allow",
      "Action": ["states:StartExecution"],
      "Resource": "arn:aws:states:ap-northeast-1:123456789012:stateMachine:ServiceProcessingOrchestrator"
    },
    {
      "Effect": "Allow",
      "Action": ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"],
      "Resource": [
        "arn:aws:logs:ap-northeast-1:123456789012:log-group:/aws/lambda/TriggerParentStepFunction",
        "arn:aws:logs:ap-northeast-1:123456789012:log-group:/aws/lambda/TriggerParentStepFunction:*"
      ]
    }
  ]
}
```

---

## テスト

### IAMポリシーシミュレーター

1. IAMコンソール → **「ポリシーシミュレーター」**
2. ロール: `LambdaS3StepFunctionsRole`
3. テストするアクション:
   - `s3:GetObject`
   - `dynamodb:GetItem`
   - `states:StartExecution`
   - `logs:PutLogEvents`
4. リソースARNを入力
5. **「シミュレーションを実行」**

### AWS CLIでテスト

```bash
# S3アクセステスト
aws s3api head-object \
  --bucket siftbeam \
  --key service/input/test/test/test.jpg \
  --profile lambda-role

# DynamoDBアクセステスト
aws dynamodb get-item \
  --table-name siftbeam-processing-history \
  --key '{"processing-historyId": {"S": "test-id"}}' \
  --profile lambda-role

# Step Functionsテスト
aws stepfunctions start-execution \
  --state-machine-arn arn:aws:states:ap-northeast-1:123456789012:stateMachine:ServiceProcessingOrchestrator \
  --input '{}' \
  --profile lambda-role
```

---

## トラブルシューティング

### エラー: "認識されないアクション"

**原因**: 存在しないIAMアクションを指定

**解決策**: 正しいアクションを確認
- [S3のアクション一覧](https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazons3.html)
- [DynamoDBのアクション一覧](https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazondynamodb.html)
- [Step Functionsのアクション一覧](https://docs.aws.amazon.com/service-authorization/latest/reference/list_awsstepfunctions.html)

### エラー: "Access Denied"

**原因**: 権限が不足している

**デバッグ方法**:
1. CloudTrailでイベントを確認
2. どのAPIコールが失敗したか確認
3. 必要な権限を追加

```bash
# CloudTrailでイベントを検索
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=EventName,AttributeValue=GetObject \
  --max-results 10
```

---

## まとめ

### 重要なポイント

1. ✅ **`s3:HeadObject`は存在しない** → `s3:GetObject`を使用
2. ✅ **リソースARNは正確に** → `arn:aws:s3:::bucket/path/*`
3. ✅ **最小権限の原則** → 必要な権限のみ付与
4. ✅ **本番環境では厳密に** → リージョン、アカウントIDを明示

### 推奨ファイル

`lambda/trigger-parent-stepfunction/iam-policy.json` を使用してください。

```bash
# ポリシーをアタッチ
aws iam put-role-policy \
  --role-name LambdaS3StepFunctionsRole \
  --policy-name LambdaS3StepFunctionsPolicy \
  --policy-document file://lambda/trigger-parent-stepfunction/iam-policy.json
```

これで正しく動作します!🎉

