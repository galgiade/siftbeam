# S3イベント無限ループ防止ガイド

## ⚠️ 無限ループのリスク

### 危険なパターン

```
S3イベント → Lambda
  ↓
Lambda が S3 にファイルをアップロード
  ↓
S3イベント → Lambda  ← 無限ループ! ❌
  ↓
Lambda が S3 にファイルをアップロード
  ↓
...
```

---

## 🛡️ 防止策

### 1️⃣ **S3イベント通知のフィルター設定** (推奨)

#### 設定方法

AWS S3コンソール → バケット → プロパティ → イベント通知

```json
{
  "LambdaFunctionConfigurations": [
    {
      "Id": "trigger-parent-stepfunction",
      "LambdaFunctionArn": "arn:aws:lambda:ap-northeast-1:xxx:function:s3-event-handler",
      "Events": ["s3:ObjectCreated:*"],
      "Filter": {
        "Key": {
          "FilterRules": [
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
```

#### 効果

```
✅ _trigger.json がアップロードされた時のみLambda起動
❌ 通常のファイル (file.pdf) ではLambda起動しない
❌ Step Functionsが作成するファイルでもLambda起動しない
```

---

### 2️⃣ **プレフィックスによる分離**

#### ディレクトリ構造

```
s3://siftbeam/
├── service/
│   ├── input/          ← アップロード先 (S3イベント有効)
│   │   ├── customer1/
│   │   │   ├── history1/
│   │   │   │   ├── file.pdf
│   │   │   │   └── _trigger.json  ← これでLambda起動
│   │   │   └── history2/
│   │   └── customer2/
│   └── output/         ← 処理結果 (S3イベント無効)
│       ├── customer1/
│       │   ├── history1/
│       │   │   └── processed_file.pdf  ← Lambda起動しない
│       │   └── history2/
│       └── customer2/
└── temp/               ← 一時ファイル (S3イベント無効)
```

#### S3イベント通知設定

```json
{
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
```

#### 効果

```
✅ service/input/**/_trigger.json → Lambda起動
❌ service/output/**/*.pdf → Lambda起動しない
❌ temp/**/* → Lambda起動しない
```

---

### 3️⃣ **メタデータによる判定**

#### Lambda関数内でチェック

```python
def process_s3_record(record):
    # S3オブジェクトのメタデータを取得
    head_response = s3_client.head_object(Bucket=bucket_name, Key=object_key)
    metadata = head_response.get('Metadata', {})
    
    # triggerStepFunction メタデータをチェック
    trigger_step_function = metadata.get('triggerstepfunction', 'false')
    
    if trigger_step_function != 'true':
        print(f"Skipping: triggerStepFunction={trigger_step_function}")
        return None
    
    # 処理を続行...
```

#### 効果

```
✅ triggerStepFunction='true' → 処理
❌ triggerStepFunction='false' → スキップ
❌ メタデータなし → スキップ
```

---

## 🔍 現在の実装

### SiftBeamの防止策

#### 1. **S3イベント通知フィルター**

```
イベント: s3:ObjectCreated:*
プレフィックス: service/input/
サフィックス: _trigger.json
```

**結果**:
- ✅ `service/input/.../_ trigger.json` のみLambda起動
- ❌ 通常ファイル (`file.pdf`) では起動しない
- ❌ 出力ファイル (`service/output/...`) では起動しない

#### 2. **Lambda関数内でのチェック**

```python
# トリガーファイル（_trigger.json）かどうかを判定
is_trigger_file = object_key.endswith('/_trigger.json')

if not is_trigger_file:
    print(f"Warning: Non-trigger file detected: {object_key}")
    return None
```

**結果**:
- ✅ 二重チェックで安全性向上
- ✅ 設定ミスがあっても無限ループを防止

#### 3. **ディレクトリ分離**

```
service/input/   → アップロード先 (S3イベント有効)
service/output/  → 処理結果 (S3イベント無効)
```

**結果**:
- ✅ Step Functionsが作成するファイルはoutputディレクトリ
- ✅ outputディレクトリではS3イベントが発火しない

---

## 📊 処理フロー（無限ループなし）

### 正常なフロー

```
1. クライアント
   ↓ PUT service/input/.../file.pdf
   ↓ (S3イベント発火しない - サフィックスが _trigger.json でない)
   
2. クライアント
   ↓ PUT service/input/.../_trigger.json
   ↓ (S3イベント発火 ✅)
   
3. S3イベントLambda
   ↓ トリガーファイル読み取り
   ↓ ファイルサイズ計算
   ↓ DynamoDB更新
   ↓ Step Functions起動
   ↓ (S3への書き込みなし)
   
4. Step Functions
   ↓ ファイルコピー: input/ → output/
   ↓ PUT service/output/.../processed_file.pdf
   ↓ (S3イベント発火しない - プレフィックスが service/input/ でない)
   
5. Step Functions
   ↓ DynamoDB更新 (downloadS3Keys)
   ↓ (S3への書き込みなし)
   
✅ 処理完了 (無限ループなし)
```

---

## 🧪 テストケース

### ケース1: 通常ファイルのアップロード

```bash
aws s3 cp file.pdf s3://siftbeam/service/input/customer1/history1/file.pdf
```

**期待される動作**:
- ❌ S3イベント発火しない
- ❌ Lambda起動しない

**実際の動作**:
```
CloudWatch Logs: (ログなし)
```

### ケース2: トリガーファイルのアップロード

```bash
aws s3 cp _trigger.json s3://siftbeam/service/input/customer1/history1/_trigger.json
```

**期待される動作**:
- ✅ S3イベント発火
- ✅ Lambda起動
- ✅ Step Functions起動

**実際の動作**:
```
CloudWatch Logs:
  Processing trigger file: s3://siftbeam/service/input/customer1/history1/_trigger.json
  Total calculated size: 1048576 bytes
  Processing history updated: usageAmountBytes = 1048576 bytes
  Step Functions execution started: arn:aws:states:...
```

### ケース3: 出力ファイルの作成

```bash
# Step Functions内で実行
aws s3 cp input_file.pdf s3://siftbeam/service/output/customer1/history1/output_file.pdf
```

**期待される動作**:
- ❌ S3イベント発火しない (プレフィックスが service/input/ でない)
- ❌ Lambda起動しない

**実際の動作**:
```
CloudWatch Logs: (ログなし)
```

---

## 🔧 設定確認方法

### AWS CLIで確認

```bash
# S3イベント通知設定を確認
aws s3api get-bucket-notification-configuration --bucket siftbeam

# 期待される出力
{
  "LambdaFunctionConfigurations": [
    {
      "Id": "trigger-parent-stepfunction",
      "LambdaFunctionArn": "arn:aws:lambda:ap-northeast-1:xxx:function:s3-event-handler",
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
```

### AWSコンソールで確認

1. S3 → バケット `siftbeam` → プロパティ
2. イベント通知セクション
3. `trigger-parent-stepfunction` を確認

**確認項目**:
- ✅ イベントタイプ: `s3:ObjectCreated:*`
- ✅ プレフィックス: `service/input/`
- ✅ サフィックス: `_trigger.json`
- ✅ 送信先: Lambda関数 `s3-event-handler`

---

## 🆘 トラブルシューティング

### 問題1: 通常ファイルでもLambdaが起動する

**原因**: S3イベント通知のサフィックスフィルターが設定されていない

**解決方法**:
```bash
aws s3api put-bucket-notification-configuration \
  --bucket siftbeam \
  --notification-configuration file://notification.json
```

### 問題2: トリガーファイルでLambdaが起動しない

**原因**: S3イベント通知が設定されていない、またはLambda権限不足

**解決方法**:
1. S3イベント通知設定を確認
2. Lambda関数のリソースベースポリシーを確認
   ```bash
   aws lambda get-policy --function-name s3-event-handler
   ```

### 問題3: 無限ループが発生している

**原因**: Lambda関数がS3に書き込みを行っている

**解決方法**:
1. Lambda関数のコードを確認
2. S3への書き込みを削除
3. Step Functionsに処理を移行

---

## 📚 ベストプラクティス

### 1. **S3イベント通知は最小限に**

```
❌ すべてのファイルでイベント発火
✅ トリガーファイルのみイベント発火
```

### 2. **ディレクトリを明確に分離**

```
input/   → アップロード (イベント有効)
output/  → 処理結果 (イベント無効)
temp/    → 一時ファイル (イベント無効)
```

### 3. **Lambda関数内で二重チェック**

```python
# S3イベント通知フィルターに加えて、Lambda内でもチェック
if not object_key.endswith('/_trigger.json'):
    return None
```

### 4. **CloudWatch Logsで監視**

```
定期的に以下を確認:
- Lambda起動回数
- 処理時間
- エラー率

異常な増加 → 無限ループの可能性
```

---

## 🎯 まとめ

### SiftBeamの無限ループ防止策

1. ✅ **S3イベント通知フィルター**: `_trigger.json` のみ
2. ✅ **プレフィックス分離**: `service/input/` のみ
3. ✅ **Lambda内チェック**: ファイル名の二重確認
4. ✅ **ディレクトリ分離**: input と output を分離
5. ✅ **Step Functionsに処理を委譲**: Lambda は S3 に書き込まない

### 安全性

- ✅ 複数の防止策により、無限ループのリスクは **ほぼゼロ**
- ✅ 設定ミスがあっても、Lambda内チェックで防止
- ✅ CloudWatch Logsで異常を検知可能

---

作成日: 2025-10-30  
最終更新: 2025-10-30  
バージョン: 1.0

