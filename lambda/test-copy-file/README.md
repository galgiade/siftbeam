# TestCopyFile Lambda Function

テスト用のLambda関数。S3の入力ファイルを出力パスにコピーします。

## 📋 概要

この関数は、子Step Function (`TestCopyStateMachine`) から呼び出され、以下の処理を実行します:

1. 入力S3パスからファイルを取得
2. 出力S3パスにコピー
3. メタデータを付与
4. 結果を返す

## 🎯 用途

- 子Step Functionのテスト
- 親Step Functionとの連携テスト
- DynamoDBマッピングテーブルのテスト

## 📂 ファイル構成

```
lambda/test-copy-file/
├── handler.py           # メイン処理
├── requirements.txt     # Python依存関係
├── iam-policy.json      # IAMポリシー
├── deploy.sh            # デプロイスクリプト
└── README.md            # このファイル
```

## 🚀 デプロイ方法

### 1. デプロイスクリプトを実行

```bash
cd lambda/test-copy-file
chmod +x deploy.sh
./deploy.sh
```

### 2. デプロイ内容

- Lambda関数名: `TestCopyFile`
- ランタイム: `python3.13`
- タイムアウト: `60秒`
- メモリ: `256MB`
- IAMロール: `TestCopyFileRole`

## 🔧 環境変数

| 変数名 | デフォルト値 | 説明 |
|--------|-------------|------|
| `S3_BUCKET` | `siftbeam` | S3バケット名 |

## 📥 入力形式

```json
{
  "inputS3Bucket": "siftbeam",
  "inputS3Key": "service/input/cus_TEST123/test-history-123/test.png",
  "outputS3Key": "service/output/cus_TEST123/test-history-123/test.png",
  "processingHistoryId": "test-history-123",
  "customerId": "cus_TEST123",
  "userId": "user-456",
  "policyId": "policy-789"
}
```

## 📤 出力形式

### 成功時

```json
{
  "statusCode": 200,
  "outputS3Key": "service/output/cus_TEST123/test-history-123/test.png",
  "fileSizeBytes": 1024,
  "inputS3Key": "service/input/cus_TEST123/test-history-123/test.png",
  "processingHistoryId": "test-history-123",
  "message": "ファイルコピー完了"
}
```

### エラー時

```json
{
  "errorMessage": "Input file not found: s3://siftbeam/service/input/...",
  "errorType": "FileNotFoundError"
}
```

## 🔒 IAM権限

### 必要な権限

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:GetObjectVersion",
        "s3:HeadObject"
      ],
      "Resource": "arn:aws:s3:::siftbeam/service/input/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:CopyObject"
      ],
      "Resource": "arn:aws:s3:::siftbeam/service/output/*"
    },
    {
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

## 🧪 テスト方法

### AWS CLIでテスト

```bash
aws lambda invoke \
  --function-name TestCopyFile \
  --payload '{
    "inputS3Bucket": "siftbeam",
    "inputS3Key": "service/input/cus_TEST123/test-history-123/test.png",
    "outputS3Key": "service/output/cus_TEST123/test-history-123/test.png",
    "processingHistoryId": "test-history-123",
    "customerId": "cus_TEST123",
    "userId": "user-456",
    "policyId": "policy-789"
  }' \
  --region ap-northeast-1 \
  response.json

cat response.json
```

### Lambda コンソールでテスト

1. AWS Lambda コンソールを開く
2. `TestCopyFile` 関数を選択
3. 「テスト」タブを選択
4. 上記の入力形式でテストイベントを作成
5. 「テスト」ボタンをクリック

## 📊 処理フロー

```
1. 入力パラメータ取得
   ↓
2. 入力ファイルの存在確認 (HeadObject)
   ↓
3. ファイルサイズ取得
   ↓
4. S3コピー実行 (CopyObject)
   ↓
5. 出力メタデータ付与
   ↓
6. 成功レスポンス返却
```

## 🔍 メタデータ

出力ファイルに以下のメタデータが付与されます:

| キー | 説明 | 例 |
|-----|------|-----|
| `customerId` | 顧客ID | `cus_TEST123` |
| `userId` | ユーザーID | `user-456` |
| `policyId` | ポリシーID | `policy-789` |
| `processingHistoryId` | 処理履歴ID | `test-history-123` |
| `fileType` | ファイルタイプ | `output` |
| `processedAt` | 処理日時 (ISO8601) | `2025-10-16T12:00:00.000Z` |
| `sourceKey` | 元のS3キー | `service/input/...` |

## ⚠️ エラーハンドリング

### FileNotFoundError

入力ファイルが存在しない場合:

```python
raise FileNotFoundError(f"Input file not found: s3://{bucket}/{key}")
```

### その他のエラー

予期しないエラーの場合:

```python
raise Exception(f"Unexpected error: {error}")
```

## 📝 ログ

CloudWatch Logsで以下の情報を確認できます:

- 入力パラメータ
- 入力ファイルサイズ
- コピー元/先のS3パス
- 処理結果
- エラー詳細

## 🔄 更新履歴

### v1.0.0 (2025-10-16)

- 初回リリース
- 基本的なファイルコピー機能
- メタデータ付与機能
- エラーハンドリング

## 🔗 関連リソース

- [TestCopyStateMachine (子Step Function)](../../stepfunctions/child/TestCopyStateMachine.asl.json)
- [ServiceProcessingOrchestrator (親Step Function)](../../docs/PARENT_STEPFUNCTION_DESIGN.md)
- [Policy Mapping Table](../../docs/POLICY_STEPFUNCTION_MAPPING_TABLE_DESIGN.md)

## 📞 サポート

問題が発生した場合は、以下を確認してください:

1. CloudWatch Logsでエラーログを確認
2. IAM権限が正しく設定されているか確認
3. S3バケット名とリージョンが正しいか確認
4. 入力ファイルが存在するか確認

