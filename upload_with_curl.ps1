# SiftBeam API ファイルアップロードスクリプト (PowerShell)
# 使い方: .\upload_with_curl.ps1 -ApiKey "YOUR_API_KEY" -ApiUrl "https://xxx.execute-api.ap-northeast-1.amazonaws.com/prod/upload" -FilePath "icon.png"

param(
    [Parameter(Mandatory=$true)]
    [string]$ApiKey,
    
    [Parameter(Mandatory=$true)]
    [string]$ApiUrl,
    
    [Parameter(Mandatory=$true)]
    [string]$FilePath
)

# ファイルの存在確認
if (-not (Test-Path $FilePath)) {
    Write-Host "❌ エラー: ファイルが見つかりません: $FilePath" -ForegroundColor Red
    exit 1
}

# ファイル情報を取得
$fileInfo = Get-Item $FilePath
$fileName = $fileInfo.Name
$fileSize = $fileInfo.Length

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "SiftBeam API ファイルアップロード" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "ファイル: $fileName"
Write-Host "サイズ: $fileSize bytes ($([math]::Round($fileSize / 1MB, 2)) MB)"
Write-Host "API URL: $ApiUrl"
Write-Host ""

# Content-Type マッピング
$contentTypeMap = @{
    ".pdf" = "application/pdf"
    ".doc" = "application/msword"
    ".docx" = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ".xls" = "application/vnd.ms-excel"
    ".xlsx" = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ".ppt" = "application/vnd.ms-powerpoint"
    ".pptx" = "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ".txt" = "text/plain"
    ".csv" = "text/csv"
    ".jpg" = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".png" = "image/png"
    ".gif" = "image/gif"
    ".bmp" = "image/bmp"
    ".tiff" = "image/tiff"
    ".tif" = "image/tiff"
}

$fileExtension = $fileInfo.Extension.ToLower()
$contentType = $contentTypeMap[$fileExtension]

if (-not $contentType) {
    $contentType = "application/octet-stream"
}

Write-Host "Content-Type: $contentType"
Write-Host ""

# ステップ1: アップロードURL取得
Write-Host "============================================================" -ForegroundColor Yellow
Write-Host "ステップ1: アップロードURL取得" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Yellow

try {
    $headers = @{
        "Content-Type" = "application/json"
        "x-api-key" = $ApiKey
    }
    
    $body = @{
        document = $fileName
        fileSize = $fileSize
    } | ConvertTo-Json
    
    Write-Host "リクエスト送信中..."
    
    $response = Invoke-RestMethod -Uri $ApiUrl `
        -Method POST `
        -Headers $headers `
        -Body $body `
        -ErrorAction Stop
    
    Write-Host "✅ アップロードURL取得成功" -ForegroundColor Green
    Write-Host "プロセスID: $($response.processId)"
    Write-Host "S3キー: $($response.s3Key)"
    Write-Host ""
    
    # ステップ2: ファイルをアップロード
    Write-Host "============================================================" -ForegroundColor Yellow
    Write-Host "ステップ2: ファイルアップロード" -ForegroundColor Yellow
    Write-Host "============================================================" -ForegroundColor Yellow
    
    $uploadHeaders = @{
        "Content-Type" = $contentType
    }
    
    Write-Host "アップロード中..."
    
    $uploadResponse = Invoke-RestMethod -Uri $response.uploadUrl `
        -Method PUT `
        -Headers $uploadHeaders `
        -InFile $FilePath `
        -ErrorAction Stop
    
    Write-Host "✅ ファイルアップロード成功" -ForegroundColor Green
    Write-Host ""
    
    # 結果表示
    Write-Host "============================================================" -ForegroundColor Green
    Write-Host "✅ アップロード完了" -ForegroundColor Green
    Write-Host "============================================================" -ForegroundColor Green
    Write-Host "プロセスID: $($response.processId)"
    Write-Host "S3バケット: $($response.s3Bucket)"
    Write-Host "S3キー: $($response.s3Key)"
    Write-Host "ステータス: $($response.status)"
    Write-Host ""
    
    if ($response.usageInfo) {
        Write-Host "使用量情報:"
        Write-Host "  現在の使用量: $($response.usageInfo.currentUsageBytes) bytes"
        Write-Host "  現在のコスト: `$$($response.usageInfo.currentCost)"
        Write-Host "  チェックした制限数: $($response.usageInfo.checkedLimits)"
        Write-Host ""
    }
    
    if ($response.apiInfo) {
        Write-Host "API情報:"
        Write-Host "  APIキーID: $($response.apiInfo.apiKeyId)"
        Write-Host "  API名: $($response.apiInfo.apiName)"
        Write-Host "  顧客ID: $($response.apiInfo.customerId)"
        Write-Host "  ポリシーID: $($response.apiInfo.policyId)"
        Write-Host ""
    }
    
    Write-Host "完了時刻: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    
    exit 0
    
} catch {
    Write-Host ""
    Write-Host "❌ エラーが発生しました" -ForegroundColor Red
    Write-Host "エラーメッセージ: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "レスポンス: $responseBody" -ForegroundColor Red
    }
    
    exit 1
}

