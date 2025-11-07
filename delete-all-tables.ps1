# 全てのsiftbeamテーブルを削除するスクリプト (PowerShell)
# 使用方法: .\delete-all-tables.ps1

$Region = "ap-northeast-1"

# 削除するテーブルのリスト
$Tables = @(
    "siftbeam-announcements",
    "siftbeam-api-keys",
    "siftbeam-audit-logs",
    "siftbeam-data-usage",
    "siftbeam-group",
    "siftbeam-neworder-reply",
    "siftbeam-neworder-request",
    "siftbeam-policy",
    "siftbeam-policy-analysis",
    "siftbeam-policy-group",
    "siftbeam-policy-stepfunction-mapping",
    "siftbeam-processing-history",
    "siftbeam-support-reply",
    "siftbeam-support-request",
    "siftbeam-usage-limits",
    "siftbeam-user-group",
    "siftbeam-users",
    "siftbeam-verification-codes"
)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "全てのsiftbeamテーブルを削除します" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "削除対象: $($Tables.Count)個のテーブル" -ForegroundColor Yellow
Write-Host ""

# 確認
$Confirm = Read-Host "本当に削除しますか? (yes/no)"

if ($Confirm -ne "yes") {
    Write-Host "キャンセルしました。" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "削除を開始します..." -ForegroundColor Green
Write-Host ""

# 各テーブルを削除
foreach ($Table in $Tables) {
    Write-Host "削除中: $Table" -ForegroundColor Yellow
    
    try {
        aws dynamodb delete-table `
            --table-name $Table `
            --region $Region `
            --output text 2>&1 | Out-Null
        
        Write-Host "✓ $Table を削除しました" -ForegroundColor Green
    }
    catch {
        Write-Host "✗ $Table の削除に失敗しました（存在しない可能性があります）" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "削除処理が完了しました" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "全てのテーブルが削除されるまで数分かかる場合があります。" -ForegroundColor Yellow
Write-Host ""
Write-Host "確認コマンド:" -ForegroundColor Cyan
Write-Host "aws dynamodb list-tables --region $Region --query `"TableNames[?starts_with(@, 'siftbeam')]`"" -ForegroundColor White

