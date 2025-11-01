# SiftBeam API アップロードコマンド集

## 🚀 クイックスタート

### PowerShell ワンライナー（推奨）

```powershell
cd C:\Users\81903\react\siftbeam

# ファイル情報を自動取得してアップロード
$file = "icon.png"; $apiKey = "LQc3ybCI6zJtOPPlKcvA2HpQM4wWvlL7W6NOVrcd"; $apiUrl = "https://8xbh4xmrid.execute-api.ap-northeast-1.amazonaws.com/prod/upload"; $fileInfo = Get-Item $file; $response = Invoke-RestMethod -Uri $apiUrl -Method POST -Headers @{"Content-Type"="application/json";"x-api-key"=$apiKey} -Body (@{document=$fileInfo.Name;fileSize=$fileInfo.Length}|ConvertTo-Json); Write-Host "✅ URL取得成功: $($response.processId)"; Invoke-RestMethod -Uri $response.uploadUrl -Method PUT -Headers @{"Content-Type"="image/png"} -InFile $file; Write-Host "✅ アップロード完了!"
```

### PowerShell スクリプト（詳細表示）

```powershell
cd C:\Users\81903\react\siftbeam

.\upload_with_curl.ps1 `
  -ApiKey "LQc3ybCI6zJtOPPlKcvA2HpQM4wWvlL7W6NOVrcd" `
  -ApiUrl "https://8xbh4xmrid.execute-api.ap-northeast-1.amazonaws.com/prod/upload" `
  -FilePath "icon.png"
```

### Python スクリプト

```bash
cd C:\Users\81903\react\siftbeam

# 環境変数を設定
$env:SIFTBEAM_API_KEY="LQc3ybCI6zJtOPPlKcvA2HpQM4wWvlL7W6NOVrcd"
$env:SIFTBEAM_API_URL="https://8xbh4xmrid.execute-api.ap-northeast-1.amazonaws.com/prod/upload"

# アップロード実行
python test_api_upload.py --file icon.png

# または、環境変数を使わずに直接指定
python test_api_upload.py `
  --api-key "LQc3ybCI6zJtOPPlKcvA2HpQM4wWvlL7W6NOVrcd" `
  --api-url "https://8xbh4xmrid.execute-api.ap-northeast-1.amazonaws.com/prod/upload" `
  --file icon.png
```

---

## 📝 ステップバイステップ（PowerShell）

### ステップ1: ファイル情報を取得

```powershell
cd C:\Users\81903\react\siftbeam

# ファイル情報を取得
$file = "icon.png"
$fileInfo = Get-Item $file
$fileName = $fileInfo.Name
$fileSize = $fileInfo.Length

Write-Host "ファイル名: $fileName"
Write-Host "ファイルサイズ: $fileSize bytes"
```

### ステップ2: アップロードURL取得

```powershell
# API設定
$apiKey = "LQc3ybCI6zJtOPPlKcvA2HpQM4wWvlL7W6NOVrcd"
$apiUrl = "https://8xbh4xmrid.execute-api.ap-northeast-1.amazonaws.com/prod/upload"

# リクエスト送信
$response = Invoke-RestMethod -Uri $apiUrl `
  -Method POST `
  -Headers @{
    "Content-Type" = "application/json"
    "x-api-key" = $apiKey
  } `
  -Body (@{
    document = $fileName
    fileSize = $fileSize
  } | ConvertTo-Json)

# レスポンス表示
Write-Host "✅ アップロードURL取得成功"
Write-Host "プロセスID: $($response.processId)"
Write-Host "S3キー: $($response.s3Key)"
Write-Host "ポリシーID: $($response.policyId)"

# レスポンス全体を表示（詳細）
$response | ConvertTo-Json -Depth 10
```

### ステップ3: ファイルをアップロード

```powershell
# アップロードURL
$uploadUrl = $response.uploadUrl

# ファイルをアップロード
Invoke-RestMethod -Uri $uploadUrl `
  -Method PUT `
  -Headers @{
    "Content-Type" = "image/png"
  } `
  -InFile $file

Write-Host "✅ ファイルアップロード完了!"
```

---

## 🔍 レスポンス例

### アップロードURL取得のレスポンス

```json
{
  "processId": "550e8400-e29b-41d4-a716-446655440000",
  "uploadUrl": "https://siftbeam.s3.amazonaws.com/service/input/cus_xxx/550e8400-e29b-41d4-a716-446655440000/icon.png?...",
  "downloadUrl": "https://siftbeam.s3.amazonaws.com/service/input/cus_xxx/550e8400-e29b-41d4-a716-446655440000/icon.png?...",
  "s3Key": "service/input/cus_xxx/550e8400-e29b-41d4-a716-446655440000/icon.png",
  "s3Bucket": "siftbeam",
  "documentName": "icon.png",
  "policyId": "pol_abc123",
  "contentType": "image/png",
  "expiresIn": 3600,
  "status": "pending",
  "message": "Upload URL generated successfully",
  "timestamp": "2025-01-27T10:30:00.000000Z",
  "usageInfo": {
    "currentUsageBytes": 1024000,
    "currentCost": 0.01024,
    "checkedLimits": 2,
    "shouldNotify": false,
    "notifyEmails": []
  },
  "apiInfo": {
    "apiKeyId": "LQc3ybCI6zJtOPPlKcvA2HpQM4wWvlL7W6NOVrcd",
    "apiName": "テスト用API",
    "customerId": "cus_xxx",
    "policyId": "pol_abc123"
  }
}
```

---

## 🛠️ トラブルシューティング

### エラー: 401 Unauthorized

**原因**: APIキーが無効または期限切れ

**解決方法**:
```powershell
# APIキーの状態を確認
# ブラウザで https://your-domain.com/ja/account/api-management にアクセス
# APIキーが「有効」状態か確認
```

### エラー: 400 Bad Request - "File size is required"

**原因**: ファイルサイズが正しく取得できていない

**解決方法**:
```powershell
# ファイルサイズを確認
$fileInfo = Get-Item "icon.png"
Write-Host "ファイルサイズ: $($fileInfo.Length) bytes"

# ファイルが存在するか確認
Test-Path "icon.png"
```

### エラー: 429 Too Many Requests - "Usage limit exceeded"

**原因**: 使用量制限を超過

**解決方法**:
1. 使用量制限管理ページで現在の使用状況を確認
2. 制限を引き上げるか、次の請求サイクルまで待つ

---

## 📊 複数ファイルのアップロード

### 複数ファイルを順次アップロード

```powershell
cd C:\Users\81903\react\siftbeam

$apiKey = "LQc3ybCI6zJtOPPlKcvA2HpQM4wWvlL7W6NOVrcd"
$apiUrl = "https://8xbh4xmrid.execute-api.ap-northeast-1.amazonaws.com/prod/upload"

# アップロードするファイルのリスト
$files = @("icon.png", "document.pdf", "report.docx")

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "アップロード中: $file"
        
        .\upload_with_curl.ps1 `
          -ApiKey $apiKey `
          -ApiUrl $apiUrl `
          -FilePath $file
        
        Write-Host ""
    } else {
        Write-Host "⚠️ ファイルが見つかりません: $file" -ForegroundColor Yellow
    }
}

Write-Host "✅ すべてのファイルのアップロードが完了しました"
```

### フォルダ内のすべてのPDFをアップロード

```powershell
cd C:\Users\81903\react\siftbeam

$apiKey = "LQc3ybCI6zJtOPPlKcvA2HpQM4wWvlL7W6NOVrcd"
$apiUrl = "https://8xbh4xmrid.execute-api.ap-northeast-1.amazonaws.com/prod/upload"

# フォルダ内のすべてのPDFファイルを取得
$pdfFiles = Get-ChildItem -Path "." -Filter "*.pdf"

Write-Host "見つかったPDFファイル: $($pdfFiles.Count)件"

foreach ($file in $pdfFiles) {
    Write-Host "アップロード中: $($file.Name)"
    
    .\upload_with_curl.ps1 `
      -ApiKey $apiKey `
      -ApiUrl $apiUrl `
      -FilePath $file.FullName
    
    Write-Host ""
}

Write-Host "✅ すべてのPDFファイルのアップロードが完了しました"
```

---

## 🎯 注意事項

1. **ファイルサイズは自動取得**
   - リクエスト時に実際のファイルサイズを自動的に取得します
   - 手動でファイルサイズを指定する必要はありません

2. **ポリシーIDは自動適用**
   - APIキーに紐づいたポリシーIDが自動的に使用されます
   - リクエスト時にポリシーIDを指定する必要はありません

3. **アップロードURLの有効期限**
   - アップロードURLは1時間（3600秒）有効です
   - 有効期限内にファイルをアップロードしてください

4. **サポートされているファイル形式**
   - PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV
   - JPG, JPEG, PNG, GIF, BMP, TIFF, TIF

5. **最大ファイルサイズ**
   - 100MB

---

## 📞 サポート

問題が解決しない場合は、以下の情報を含めてサポートに連絡してください：

- エラーメッセージ
- 使用したAPIキーID（値ではなく）
- ファイル名とサイズ
- タイムスタンプ
- プロセスID（取得できた場合）

