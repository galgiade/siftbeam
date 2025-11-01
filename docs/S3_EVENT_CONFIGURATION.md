# S3イベント通知の設定

## 概要

S3イベントLambdaは**トリガーファイル(`_trigger.json`)のみ**で起動するように設定します。これにより、Lambda起動回数を大幅に削減できます。

## 問題点（設定前）

```
1. icon.png アップロード → S3イベント → Lambda起動 (1回目) ❌
2. icon2.png アップロード → S3イベント → Lambda起動 (2回目) ❌
3. _trigger.json アップロード → S3イベント → Lambda起動 (3回目) ✅
```

**問題**: ファイル数に比例してLambda起動回数が増加

## 解決策（設定後）

```
1. icon.png アップロード → (Lambda起動なし)
2. icon2.png アップロード → (Lambda起動なし)
3. _trigger.json アップロード → S3イベント → Lambda起動 (1回だけ!) ✅
```

**メリット**: ファイル数に関係なく、Lambda起動は常に1回

---

## AWS Management Consoleでの設定

### 1. S3バケットを開く

1. AWS Management Consoleにログイン
2. S3サービスを開く
3. `siftbeam`バケットを選択

### 2. イベント通知を設定

1. **プロパティ**タブを選択
2. **イベント通知**セクションまでスクロール
3. **イベント通知を作成**をクリック

### 3. イベント通知の詳細を入力

#### 一般設定
- **イベント名**: `TriggerFileProcessing`
- **プレフィックス**: `service/input/` (オプション)
- **サフィックス**: `_trigger.json` ⭐ **重要**

#### イベントタイプ
- ✅ **すべてのオブジェクト作成イベント**
  - または、より具体的に:
    - ✅ `s3:ObjectCreated:Put`
    - ✅ `s3:ObjectCreated:Post`
    - ✅ `s3:ObjectCreated:CompleteMultipartUpload`

#### 送信先
- **送信先タイプ**: Lambda関数
- **Lambda関数**: `s3-event-handler`

### 4. 保存

**イベント通知を作成**をクリック

---

## AWS CLIでの設定

### 設定ファイルを作成

```bash
cat > s3-notification.json << 'EOF'
{
  "LambdaFunctionConfigurations": [
    {
      "Id": "ProcessTriggerFilesOnly",
      "LambdaFunctionArn": "arn:aws:lambda:ap-northeast-1:YOUR_ACCOUNT_ID:function:s3-event-handler",
      "Events": ["s3:ObjectCreated:*"],
      "Filter": {
        "Key": {
          "FilterRules": [
            {
              "Name": "prefix",
              "Value": "service/input/"
            },
            {
              "Name": "suffix",
              "Value": "_trigger.json"
            }
          ]
        }
      }
    }
  ]
}
EOF
```

### Lambda関数に権限を付与

```bash
aws lambda add-permission \
  --function-name s3-event-handler \
  --statement-id AllowS3Invoke \
  --action lambda:InvokeFunction \
  --principal s3.amazonaws.com \
  --source-arn arn:aws:s3:::siftbeam \
  --source-account YOUR_ACCOUNT_ID
```

### S3バケットに通知設定を適用

```bash
aws s3api put-bucket-notification-configuration \
  --bucket siftbeam \
  --notification-configuration file://s3-notification.json
```

### 設定を確認

```bash
aws s3api get-bucket-notification-configuration \
  --bucket siftbeam
```

---

## Terraformでの設定

```hcl
# Lambda関数の定義
resource "aws_lambda_function" "s3_event_handler" {
  function_name = "s3-event-handler"
  # ... その他の設定 ...
}

# Lambda実行権限
resource "aws_lambda_permission" "allow_s3" {
  statement_id  = "AllowS3Invoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.s3_event_handler.function_name
  principal     = "s3.amazonaws.com"
  source_arn    = aws_s3_bucket.siftbeam.arn
}

# S3バケット通知設定
resource "aws_s3_bucket_notification" "trigger_files" {
  bucket = aws_s3_bucket.siftbeam.id

  lambda_function {
    id                  = "ProcessTriggerFilesOnly"
    lambda_function_arn = aws_lambda_function.s3_event_handler.arn
    events              = ["s3:ObjectCreated:*"]
    
    filter_prefix = "service/input/"
    filter_suffix = "_trigger.json"
  }

  depends_on = [aws_lambda_permission.allow_s3]
}
```

---

## 設定の検証

### テスト方法

1. **通常ファイルをアップロード**
   ```bash
   aws s3 cp test.txt s3://siftbeam/service/input/test-customer/test-id/test.txt
   ```
   → Lambda起動なし（CloudWatch Logsに記録なし）

2. **トリガーファイルをアップロード**
   ```bash
   aws s3 cp _trigger.json s3://siftbeam/service/input/test-customer/test-id/_trigger.json
   ```
   → Lambda起動あり（CloudWatch Logsに記録あり）

### CloudWatch Logsで確認

```bash
aws logs tail /aws/lambda/s3-event-handler --follow
```

期待される出力:
```
Processing trigger file: s3://siftbeam/service/input/.../trigger.json
Trigger file content: {...}
Processing history updated: usageAmountBytes = 2048000 bytes
Step Functions execution started: arn:aws:states:...
```

---

## トラブルシューティング

### 問題1: 通常ファイルでもLambdaが起動する

**原因**: S3イベント通知の`suffix`フィルターが設定されていない

**解決策**: 
```bash
# 現在の設定を確認
aws s3api get-bucket-notification-configuration --bucket siftbeam

# suffix="_trigger.json"が設定されているか確認
```

### 問題2: トリガーファイルでLambdaが起動しない

**原因**: Lambda実行権限が不足

**解決策**:
```bash
# Lambda権限を再度付与
aws lambda add-permission \
  --function-name s3-event-handler \
  --statement-id AllowS3Invoke \
  --action lambda:InvokeFunction \
  --principal s3.amazonaws.com \
  --source-arn arn:aws:s3:::siftbeam
```

### 問題3: Lambda内でエラーが発生

**原因**: トリガーファイル以外のファイルが処理された

**確認方法**:
```python
# Lambda内のログを確認
if not is_trigger_file:
    print(f"Warning: Non-trigger file detected: {object_key}")
    # このログが出力されている場合、S3イベント設定を確認
```

---

## パフォーマンス比較

### 設定前（すべてのファイルで起動）

| ファイル数 | Lambda起動回数 | DynamoDB書き込み | コスト |
|-----------|---------------|-----------------|--------|
| 1 | 2回 (ファイル + トリガー) | 2回 | 💰 |
| 5 | 6回 (5ファイル + トリガー) | 6回 | 💰💰 |
| 10 | 11回 (10ファイル + トリガー) | 11回 | 💰💰💰 |

### 設定後（トリガーファイルのみで起動）

| ファイル数 | Lambda起動回数 | DynamoDB書き込み | コスト |
|-----------|---------------|-----------------|--------|
| 1 | 1回 (トリガーのみ) | 1回 | 💰 |
| 5 | 1回 (トリガーのみ) | 1回 | 💰 |
| 10 | 1回 (トリガーのみ) | 1回 | 💰 |

**削減率**: 
- 5ファイルの場合: **83%削減** (6回 → 1回)
- 10ファイルの場合: **91%削減** (11回 → 1回)

---

## まとめ

✅ **S3イベント通知を`suffix="_trigger.json"`に設定する**
✅ **Lambda起動回数が大幅に削減される**
✅ **コストとDynamoDB書き込みが削減される**
✅ **シンプルで効率的な設計**

設定後は、トリガーファイルのアップロードのみでLambdaが起動し、Step Functionsが開始されます。

