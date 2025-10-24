# アカウント削除自動化: Lambda版 vs 直接実行版

## 概要

アカウント削除自動化システムには2つの実装方法があります:

1. **Lambda版**: Lambda関数を使用してリソースを削除
2. **直接実行版**: Step FunctionsのAWS SDK統合で直接削除（推奨）

## 詳細比較

| 項目 | Lambda版 | 直接実行版 ⭐ |
|------|---------|-------------|
| **Lambda関数** | 3つ必要 | 不要 |
| **ファイル数** | 17ファイル | 1ファイル |
| **デプロイ** | Lambda 3つ + Step Functions | Step Functionsのみ |
| **保守性** | Lambda関数のコード管理が必要 | Step Function定義のみ |
| **コスト/月** | $0.225 | $0.025 |
| **実行時間制限** | Lambda: 15分 | Step Functions: 1年 |
| **可視性** | CloudWatch Logs | Step Functions実行履歴（視覚的） |
| **デバッグ** | ログを読む必要あり | グラフィカルに確認可能 |
| **エラーハンドリング** | Lambda内で実装 | 宣言的に定義 |
| **並列処理** | Lambda内で実装 | Map機能で簡単 |
| **リトライ** | Lambda内で実装 | 宣言的に定義 |

## ファイル構成

### Lambda版

```
lambda/
├── delete-cognito-users/
│   ├── handler.py (150行)
│   ├── requirements.txt
│   ├── iam-policy.json
│   ├── deploy.sh
│   └── README.md
├── delete-dynamodb-records/
│   ├── handler.py (280行)
│   ├── requirements.txt
│   ├── iam-policy.json
│   ├── deploy.sh
│   └── README.md
└── delete-s3-objects/
    ├── handler.py (180行)
    ├── requirements.txt
    ├── iam-policy.json
    ├── deploy.sh
    └── README.md

stepfunctions/
├── AccountDeletionStateMachine.asl.json (295行)
├── deploy-account-deletion.sh
└── test-account-deletion.sh

合計: 17ファイル、約1000行のコード
```

### 直接実行版 ⭐

```
stepfunctions/
├── AccountDeletionStateMachine-Direct.asl.json (600行)
└── deploy-direct.sh

合計: 2ファイル、約650行の定義
```

## コスト比較（月額）

### Lambda版

```
Lambda実行料金:
- 削除対象: 1日1アカウント
- 実行時間: 平均30秒/アカウント
- メモリ: 512MB-1024MB
- 月額: 約$0.20

Step Functions:
- 実行回数: 30回/月
- 月額: 約$0.025

合計: 約$0.225/月
```

### 直接実行版 ⭐

```
Step Functions:
- 実行回数: 30回/月
- 月額: 約$0.025

合計: 約$0.025/月
```

**コスト削減: 約89%**

## デプロイの複雑さ

### Lambda版

```bash
# 1. Lambda関数3つをデプロイ
cd lambda/delete-cognito-users && ./deploy.sh
cd lambda/delete-dynamodb-records && ./deploy.sh
cd lambda/delete-s3-objects && ./deploy.sh

# 2. 環境変数を設定（各Lambda関数）
aws lambda update-function-configuration ...

# 3. Step Functionをデプロイ
aws stepfunctions create-state-machine ...

# 4. CloudWatch Eventsを設定
aws events put-rule ...

所要時間: 約15分
```

### 直接実行版 ⭐

```bash
# 1. Step Functionをデプロイ
cd stepfunctions && ./deploy-direct.sh

所要時間: 約2分
```

## 保守性

### Lambda版

**更新が必要な場合:**
1. Lambda関数のコードを修正
2. ZIPファイルを作成
3. Lambda関数を更新
4. テスト実行
5. 必要に応じてStep Function定義も更新

**依存関係:**
- Python 3.11
- boto3
- Lambda実行環境

### 直接実行版 ⭐

**更新が必要な場合:**
1. Step Function定義を修正
2. デプロイ
3. テスト実行

**依存関係:**
- なし（AWS SDK統合のみ）

## 可視性・デバッグ

### Lambda版

**エラー発生時:**
1. CloudWatch Logsを開く
2. 該当のログストリームを探す
3. ログを読んでエラー箇所を特定
4. コードを修正
5. 再デプロイ

### 直接実行版 ⭐

**エラー発生時:**
1. Step Functionsコンソールを開く
2. 実行履歴を確認（グラフィカル）
3. エラーが発生したステップを視覚的に確認
4. 入力/出力を確認
5. 定義を修正
6. 再デプロイ

## パフォーマンス

### Lambda版

- **Cognito削除**: Lambda内でループ処理
- **DynamoDB削除**: Lambda内でバッチ処理
- **S3削除**: Lambda内でバッチ処理
- **並列度**: Lambda関数の並列実行数に依存

### 直接実行版 ⭐

- **Cognito削除**: Map機能で最大10並列
- **DynamoDB削除**: Parallel + Map で複数テーブルを並列処理
- **S3削除**: Map機能で最大100並列
- **並列度**: Step Functionsの並列度設定で柔軟に調整可能

## IAM権限

### Lambda版

**必要なロール:**
1. Lambda実行ロール（3つ）
2. Step Functions実行ロール
3. EventBridge実行ロール

**合計: 5つのロール**

### 直接実行版 ⭐

**必要なロール:**
1. Step Functions実行ロール（全権限を含む）
2. EventBridge実行ロール

**合計: 2つのロール**

## エラーハンドリング

### Lambda版

```python
try:
    # 処理
    cognito_client.admin_delete_user(...)
except Exception as e:
    print(f"Error: {str(e)}")
    # エラーハンドリング
```

### 直接実行版 ⭐

```json
{
  "Type": "Task",
  "Resource": "arn:aws:states:::aws-sdk:cognitoidentityprovider:adminDeleteUser",
  "Retry": [
    {
      "ErrorEquals": ["States.TaskFailed"],
      "IntervalSeconds": 2,
      "MaxAttempts": 3,
      "BackoffRate": 2.0
    }
  ],
  "Catch": [
    {
      "ErrorEquals": ["States.ALL"],
      "Next": "ErrorHandler"
    }
  ]
}
```

## テスト

### Lambda版

```bash
# 各Lambda関数を個別にテスト
./test-lambda-functions.sh cus_test123

# Step Function全体をテスト
./test-account-deletion.sh
```

### 直接実行版 ⭐

```bash
# Step Functionを実行するだけ
aws stepfunctions start-execution \
  --state-machine-arn arn:aws:states:...:stateMachine:AccountDeletionStateMachine-Direct \
  --input '{}'
```

## 推奨: 直接実行版 ⭐

### 推奨する理由

1. ✅ **89%のコスト削減**
2. ✅ **保守が圧倒的に簡単**
3. ✅ **デプロイが簡単**
4. ✅ **可視性が高い**
5. ✅ **Lambda関数の管理不要**
6. ✅ **依存関係なし**
7. ✅ **IAM権限がシンプル**
8. ✅ **エラーハンドリングが宣言的**

### Lambda版が適している場合

以下のような特殊な要件がある場合のみ:

- 複雑なビジネスロジックが必要
- 外部APIとの複雑な連携
- カスタムエラーハンドリング
- Step Functionsで表現できない処理
- 既存のLambda関数を再利用したい

## 実装ファイル

### Lambda版

- **Step Function**: `stepfunctions/AccountDeletionStateMachine.asl.json`
- **Lambda関数**: `lambda/delete-*/`
- **デプロイ**: `stepfunctions/deploy-account-deletion.sh`
- **ドキュメント**: `docs/account-deletion-automation.md`

### 直接実行版 ⭐

- **Step Function**: `stepfunctions/AccountDeletionStateMachine-Direct.asl.json`
- **デプロイ**: `stepfunctions/deploy-direct.sh`
- **ドキュメント**: `docs/account-deletion-direct.md`

## まとめ

| 評価項目 | Lambda版 | 直接実行版 ⭐ |
|---------|---------|-------------|
| **コスト** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **シンプルさ** | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **保守性** | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **可視性** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **デプロイ** | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **柔軟性** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **パフォーマンス** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

**総合評価: 直接実行版を強く推奨 ⭐⭐⭐⭐⭐**

## 次のステップ

### 推奨: 直接実行版を採用

```bash
# 1. デプロイ
cd stepfunctions
chmod +x deploy-direct.sh
export AWS_ACCOUNT_ID=your-account-id
./deploy-direct.sh

# 2. テスト
aws stepfunctions start-execution \
  --state-machine-arn arn:aws:states:ap-northeast-1:${AWS_ACCOUNT_ID}:stateMachine:AccountDeletionStateMachine-Direct \
  --input '{}'

# 3. 実行状況を確認
# AWSコンソール → Step Functions → 実行履歴
```

詳細は `docs/account-deletion-direct.md` を参照してください。

