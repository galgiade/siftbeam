# ============================================
# API Batch Upload Test Script (PowerShell)
# ============================================

# 設定
$API_URL = "https://YOUR_API_GATEWAY_URL/prod/batch-upload"
$API_KEY = "YOUR_API_KEY"
$TEST_FILES = @(
    "C:\path\to\file1.png",
    "C:\path\to\file2.jpg"
)

# ============================================
# 関数定義
# ============================================

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
Write-Host "API Batch Upload Test" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "API URL: $API_URL"
Write-Host "ファイル数: $($TEST_FILES.Count)"
Write-Host ""

# ファイルの存在確認
$allFilesExist = $true
$totalSize = 0

foreach ($file in $TEST_FILES) {
    if (Test-Path $file) {
        $fileInfo = Get-Item $file
        $fileSize = $fileInfo.Length
        $totalSize += $fileSize
        Write-Host "✓ $($fileInfo.Name) - $(Format-FileSize $fileSize)" -ForegroundColor Green
    } else {
        Write-Host "✗ ファイルが見つかりません: $file" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if (-not $allFilesExist) {
    Write-Host ""
    Write-Host "❌ エラー: 一部のファイルが見つかりません" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "合計サイズ: $(Format-FileSize $totalSize)"
Write-Host ""

# ファイル数チェック（最大10ファイル）
if ($TEST_FILES.Count -gt 10) {
    Write-Host "❌ エラー: ファイル数が多すぎます（最大10ファイル）" -ForegroundColor Red
    exit 1
}

# 各ファイルのサイズチェック（100MB制限）
$maxSize = 100 * 1024 * 1024
foreach ($file in $TEST_FILES) {
    $fileInfo = Get-Item $file
    if ($fileInfo.Length -gt $maxSize) {
        Write-Host "❌ エラー: $($fileInfo.Name) のサイズが大きすぎます（最大100MB）" -ForegroundColor Red
        exit 1
    }
}

# リクエストボディを作成
$body = @{
    filePaths = $TEST_FILES
} | ConvertTo-Json

# ヘッダーを設定
$headers = @{
    "x-api-key" = $API_KEY
    "Content-Type" = "application/json"
}

# APIリクエストを送信
Write-Host "アップロード中..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri $API_URL -Method Post -Headers $headers -Body $body -TimeoutSec 300
    
    # 成功時の処理
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Green
    Write-Host "✅ アップロード成功!" -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Message: $($response.message)" -ForegroundColor Cyan
    Write-Host "Processing History ID: $($response.data.processingHistoryId)" -ForegroundColor Cyan
    Write-Host "S3 Bucket: $($response.data.s3Bucket)" -ForegroundColor Cyan
    Write-Host "Status: $($response.data.status)" -ForegroundColor Cyan
    Write-Host ""
    
    # アップロードされたファイルの詳細
    Write-Host "アップロードされたファイル:" -ForegroundColor Yellow
    foreach ($file in $response.data.files) {
        Write-Host "  - $($file.fileName)" -ForegroundColor White
        Write-Host "    S3 Key: $($file.s3Key)" -ForegroundColor Gray
        Write-Host "    Size: $(Format-FileSize $file.fileSize)" -ForegroundColor Gray
        Write-Host "    Content-Type: $($file.contentType)" -ForegroundColor Gray
        Write-Host ""
    }
    
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

