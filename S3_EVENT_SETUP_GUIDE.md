# S3イベントトリガーでファイルサイズを自動取得する設定ガイド

## 📋 概要

API Gatewayからファイルサイズを直接取得することはできませんが、**S3イベントトリガー**を使用してアップロード後にファイルサイズを自動取得できます。

## 🏗️ アーキテクチャ

### 現在の設計（ファイルサイズをクライアントから送信）

```
┌─────────────┐
│ クライアント │ ← ファイルサイズを取得
└──────┬──────┘
       │ POST /upload {document: "file.pdf", fileSize: 5000}
       ↓
┌─────────────┐
│ API Gateway │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   Lambda    │ ← ファイルサイズを受け取る
│  (upload)   │   使用量制限チェック
└──────┬──────┘
       │ プリサインドURL生成
       ↓
┌─────────────┐
│ クライアント │
└──────┬──────┘
       │ PUT プリサインドURL
       ↓
┌─────────────┐
│     S3      │
└─────────────┘
```

### 提案する設計（S3イベントでファイルサイズを自動取得）

```
┌─────────────┐
│ クライアント │
└──────┬──────┘
       │ POST /upload {document: "file.pdf"}
       │ ※ファイルサイズ不要
       ↓
┌─────────────┐
│ API Gateway │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   Lambda    │
│  (upload)   │ ← ファイルサイズなしでもOK
└──────┬──────┘   処理履歴作成（fileSize: 0）
       │ プリサインドURL生成
       ↓
┌─────────────┐
│ クライアント │
└──────┬──────┘
       │ PUT プリサインドURL
       ↓
┌─────────────┐
│     S3      │ ← ファイルアップロード完了
└──────┬──────┘
       │ S3イベント発火
       ↓
┌─────────────┐
│   Lambda    │ ← S3からファイルサイズを取得
│ (s3-event)  │   head_object() でメタデータ取得
└──────┬──────┘   処理履歴を更新
       │           使用量制限チェック
       ↓
┌─────────────┐
│  DynamoDB   │ ← fileSizeBytes更新
└─────────────┘
```

---

## 🚀 設定手順

### ステップ1: S3イベントトリガーLambda関数をデプロイ

1. **Lambda関数を作成**
   ```bash
   # AWS CLIでLambda関数を作成
   aws lambda create-function \
     --function-name siftbeam-s3-event-handler \
     --runtime python3.12 \
     --role arn:aws:iam::YOUR_ACCOUNT_ID:role/lambda-execution-role \
     --handler lambda_s3_event_handler.lambda_handler \
     --zip-file fileb://lambda_s3_event_handler.zip \
     --region ap-northeast-1
   ```

2. **環境変数を設定**
   ```bash
   aws lambda update-function-configuration \
     --function-name siftbeam-s3-event-handler \
     --environment Variables="{
       PROCESSING_HISTORY_TABLE_NAME=siftbeam-processing-history,
       USAGE_LIMITS_TABLE_NAME=siftbeam-usage-limits
     }" \
     --region ap-northeast-1
   ```

3. **IAMロールに必要な権限を追加**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:GetObject",
           "s3:HeadObject"
         ],
         "Resource": "arn:aws:s3:::siftbeam/*"
       },
       {
         "Effect": "Allow",
         "Action": [
           "dynamodb:GetItem",
           "dynamodb:UpdateItem",
           "dynamodb:Query"
         ],
         "Resource": [
           "arn:aws:dynamodb:ap-northeast-1:*:table/siftbeam-processing-history",
           "arn:aws:dynamodb:ap-northeast-1:*:table/siftbeam-processing-history/index/*",
           "arn:aws:dynamodb:ap-northeast-1:*:table/siftbeam-usage-limits",
           "arn:aws:dynamodb:ap-northeast-1:*:table/siftbeam-usage-limits/index/*"
         ]
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

### ステップ2: S3バケットにイベント通知を設定

1. **AWS コンソールでS3バケットを開く**
   - バケット名: `siftbeam`

2. **プロパティ → イベント通知 → イベント通知を作成**
   - **イベント名**: `siftbeam-file-uploaded`
   - **プレフィックス**: `service/input/`
   - **イベントタイプ**: 
     - ✅ すべてのオブジェクト作成イベント
     - または `s3:ObjectCreated:Put`
   - **送信先**: Lambda関数
   - **Lambda関数**: `siftbeam-s3-event-handler`

3. **AWS CLIで設定する場合**
   ```bash
   # Lambda関数にS3からの呼び出し権限を付与
   aws lambda add-permission \
     --function-name siftbeam-s3-event-handler \
     --statement-id s3-invoke-permission \
     --action lambda:InvokeFunction \
     --principal s3.amazonaws.com \
     --source-arn arn:aws:s3:::siftbeam \
     --region ap-northeast-1
   
   # S3バケット通知設定
   aws s3api put-bucket-notification-configuration \
     --bucket siftbeam \
     --notification-configuration file://s3-notification-config.json
   ```

   **s3-notification-config.json:**
   ```json
   {
     "LambdaFunctionConfigurations": [
       {
         "Id": "siftbeam-file-uploaded",
         "LambdaFunctionArn": "arn:aws:lambda:ap-northeast-1:YOUR_ACCOUNT_ID:function:siftbeam-s3-event-handler",
         "Events": ["s3:ObjectCreated:Put"],
         "Filter": {
           "Key": {
             "FilterRules": [
               {
                 "Name": "prefix",
                 "Value": "service/input/"
               }
             ]
           }
         }
       }
     ]
   }
   ```

### ステップ3: アップロードLambda関数を更新（オプション）

ファイルサイズをオプションにする場合：

```bash
# lambda_function_optional_filesize.py を lambda_function.py にリネーム
cp lambda_function_optional_filesize.py lambda_function.py

# Lambda関数を更新
zip -r function.zip lambda_function.py
aws lambda update-function-code \
  --function-name siftbeam-upload \
  --zip-file fileb://function.zip \
  --region ap-northeast-1
```

---

## 🧪 テスト

### 1. ファイルサイズなしでアップロード

```powershell
# PowerShell
$response = Invoke-RestMethod -Uri "https://8xbh4xmrid.execute-api.ap-northeast-1.amazonaws.com/prod/upload" `
  -Method POST `
  -Headers @{
    "Content-Type" = "application/json"
    "x-api-key" = "YOUR_API_KEY"
  } `
  -Body (@{
    document = "test.pdf"
    # fileSize は省略
  } | ConvertTo-Json)

# ファイルをアップロード
Invoke-RestMethod -Uri $response.uploadUrl `
  -Method PUT `
  -Headers @{"Content-Type" = "application/pdf"} `
  -InFile "test.pdf"
```

### 2. DynamoDBで処理履歴を確認

```bash
# 処理履歴を確認
aws dynamodb get-item \
  --table-name siftbeam-processing-history \
  --key '{"processing-historyId": {"S": "YOUR_PROCESS_ID"}}' \
  --region ap-northeast-1
```

**期待される結果:**
- アップロード直後: `fileSizeBytes: 0`
- S3イベント処理後: `fileSizeBytes: 実際のサイズ`

### 3. CloudWatch Logsで確認

```bash
# S3イベントLambda関数のログを確認
aws logs tail /aws/lambda/siftbeam-s3-event-handler --follow
```

---

## ⚖️ 比較：現在の方式 vs S3イベント方式

| 項目 | 現在の方式（クライアント送信） | S3イベント方式 |
|------|-------------------------------|----------------|
| **ファイルサイズ取得** | クライアント側で取得 | S3から自動取得 |
| **使用量制限チェック** | アップロード前 | アップロード後 |
| **クライアント実装** | ファイルサイズ送信必須 | ファイルサイズ不要 |
| **精度** | クライアント依存 | 100%正確 |
| **レイテンシー** | 即座 | 数秒の遅延 |
| **複雑さ** | シンプル | Lambda関数追加が必要 |
| **コスト** | Lambda 1回 | Lambda 2回 + S3イベント |

---

## 💡 推奨事項

### **現在の方式を維持することを推奨**

理由：

1. ✅ **即座の使用量制限チェック**
   - アップロード前に制限をチェックできる
   - 無駄なアップロードを防げる

2. ✅ **シンプルなアーキテクチャ**
   - Lambda関数1つで完結
   - デバッグが容易

3. ✅ **低コスト**
   - Lambda呼び出し回数が少ない
   - S3イベントコストなし

4. ✅ **クライアント側で自動取得済み**
   - `test_api_upload.py`: `os.path.getsize()`
   - `upload_with_curl.ps1`: `$fileInfo.Length`
   - ブラウザ: `file.size`

### S3イベント方式が有効なケース

- クライアントが信頼できない場合
- ファイルサイズの改ざんを防ぎたい場合
- アップロード後の検証が必要な場合

---

## 📝 まとめ

**質問への回答:**
> APIゲートウェイからファイルサイズを取得することはできないの?

**回答:**
- ❌ API Gatewayから直接取得することは**できません**
- ✅ S3イベントトリガーを使えば**アップロード後に取得可能**
- ✅ **現在の方式（クライアント送信）が最適**

**理由:**
1. プリサインドURL方式では、ファイルはAPI Gateway/Lambdaを経由しない
2. アップロード前に使用量制限をチェックできる
3. クライアント側で自動取得できる（手動入力不要）
4. シンプルで低コスト

**結論:**
現在の実装（クライアント側でファイルサイズを自動取得して送信）が最適です！


