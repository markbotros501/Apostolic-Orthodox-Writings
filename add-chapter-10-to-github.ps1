# PowerShell script to add Chapter 10 to GitHub
Set-Location "c:\Users\markb\Downloads\Mark's Site\Mark's Site"

Write-Host "Current directory: $(Get-Location)" -ForegroundColor Green
Write-Host "`nChecking if Chapter 10.html exists..." -ForegroundColor Yellow
$chapter10Path = "pages/fathers/john-chrysostom/Commentary on Job/Chapter 10.html"
if (Test-Path $chapter10Path) {
    Write-Host "Chapter 10.html found!" -ForegroundColor Green
} else {
    Write-Host "ERROR: Chapter 10.html not found at: $chapter10Path" -ForegroundColor Red
    exit 1
}

Write-Host "`nAdding Chapter 10 files..." -ForegroundColor Yellow
git add "pages/fathers/john-chrysostom/Commentary on Job/Chapter 10.html"
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to add Chapter 10.html" -ForegroundColor Red
    exit 1
}

git add "pages/fathers/john-chrysostom/Commentary on Job/index.html"
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to add index.html" -ForegroundColor Red
    exit 1
}

Write-Host "`nFiles staged. Checking status..." -ForegroundColor Yellow
git status

Write-Host "`nCommitting changes..." -ForegroundColor Yellow
git commit -m "Add Chapter 10 of Commentary on Job and update index"

Write-Host "`nPushing to GitHub..." -ForegroundColor Yellow
git push

Write-Host "`nDone! Chapter 10 should be on GitHub now." -ForegroundColor Green
Write-Host "Vercel should automatically redeploy your site." -ForegroundColor Green
