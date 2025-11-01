# ============================================
# API Upload Test Script (PowerShell)
# ============================================

# 設定
$API_URL = "https://YOUR_API_GATEWAY_URL/prod/upload"
$API_KEY = "YOUR_API_KEY"
$TEST_FILE = "C:\path\to\test.png"

# ============================================
# 関数定義
# ============================================

function Get-ContentType {
    param([string]$FilePath)
    
    $extension = [System.IO.Path]::GetExtension($FilePath).ToLower()
    
    switch ($extension) {
        ".png"  { return "image/png" }
        ".jpg"  { return "image/jpeg" }
        ".jpeg" { return "image/jpeg" }
        ".gif"  { return "image/gif" }
        ".bmp"  { return "image/bmp" }
        ".webp" { return "image/webp" }
        ".pdf"  { return "application/pdf" }
        ".txt"  { return "text/plain" }
        ".json" { return "application/json" }
        ".xml"  { return "application/xml" }
        ".zip"  { return "application/zip" }
        ".csv"  { return "text/csv" }
        default { return "application/octet-stream" }
    }
}

function Format-FileSize {
    param([long]$Size)
    
    if ($Size -gt 1GB) {
        return "{0:N2} GB" -f ($Size / 1GB)
    } elseif ($Size -gt 1MB) {
        return "{0:N2} MB" -f ($Size / 1MB)
    } elseif ($Size -gt 1KB) {
        return "{0:N2} KB" -f ($Size / 1KB)
    } else {
        return "$Size bytes"
    }
}

# ============================================
# メイン処理
# ============================================

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "API Upload Test" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "API URL: $API_URL"
Write-Host "Test File: $TEST_FILE"
Write-Host ""

# ファイルの存在確認
if (-not (Test-Path $TEST_FILE)) {
    Write-Host "❌ エラー: ファイルが見つかりません: $TEST_FILE" -ForegroundColor Red
    exit 1
}

# ファイル情報を取得
$fileInfo = Get-Item $TEST_FILE
$fileName = $fileInfo.Name
$fileSize = $fileInfo.Length
$contentType = Get-ContentType -FilePath $TEST_FILE

Write-Host "ファイル名: $fileName"
Write-Host "ファイルサイズ: $(Format-FileSize $fileSize)"
Write-Host "Content-Type: $contentType"
Write-Host ""

# ファイルサイズチェック（100MB制限）
$maxSize = 100 * 1024 * 1024
if ($fileSize -gt $maxSize) {
    Write-Host "❌ エラー: ファイルサイズが大きすぎます（最大100MB）" -ForegroundColor Red
    exit 1
}

# ファイルを読み込む
Write-Host "ファイルを読み込み中..." -ForegroundColor Yellow
try {
    $fileBytes = [System.IO.File]::ReadAllBytes($TEST_FILE)
    Write-Host "✓ ファイル読み込み完了" -ForegroundColor Green
} catch {
    Write-Host "❌ ファイル読み込みエラー: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# ヘッダーを設定
$headers = @{
    "x-api-key" = $API_KEY
    "Content-Type" = $contentType
}

# URLにファイル名を追加
$uploadUrl = "$API_URL`?fileName=$fileName"

# APIリクエストを送信
Write-Host ""
Write-Host "アップロード中..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri $uploadUrl -Method Post -Headers $headers -Body $fileBytes -TimeoutSec 300
    
    # 成功時の処理
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Green
    Write-Host "✅ アップロード成功!" -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Processing History ID: $($response.data.processingHistoryId)" -ForegroundColor Cyan
    Write-Host "S3 Bucket: $($response.data.s3Bucket)" -ForegroundColor Cyan
    Write-Host "S3 Key: $($response.data.s3Key)" -ForegroundColor Cyan
    Write-Host "Status: $($response.data.status)" -ForegroundColor Cyan
    Write-Host "Uploaded At: $($response.data.uploadedAt)" -ForegroundColor Cyan
    Write-Host ""
    
    # レスポンス全体を表示
    Write-Host "レスポンス詳細:" -ForegroundColor Yellow
    $response | ConvertTo-Json -Depth 10
    
} catch {
    # エラー時の処理
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Red
    Write-Host "❌ アップロード失敗!" -ForegroundColor Red
    Write-Host "============================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "エラーメッセージ: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    
    # HTTPステータスコードを取得
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "HTTPステータスコード: $statusCode" -ForegroundColor Red
    }
    
    # エラーレスポンスを表示
    if ($_.ErrorDetails.Message) {
        Write-Host "エラー詳細:" -ForegroundColor Yellow
        try {
            $errorResponse = $_.ErrorDetails.Message | ConvertFrom-Json
            $errorResponse | ConvertTo-Json -Depth 10
        } catch {
            Write-Host $_.ErrorDetails.Message
        }
    }
    
    exit 1
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "テスト完了" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

