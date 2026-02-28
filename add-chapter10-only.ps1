# Add only Chapter 10.html to GitHub
Set-Location "c:\Users\markb\Downloads\Mark's Site\Mark's Site"

Write-Host "Checking git status for Chapter 10..." -ForegroundColor Yellow
git status "pages/fathers/john-chrysostom/Commentary on Job/Chapter 10.html"

Write-Host "`nAdding Chapter 10.html..." -ForegroundColor Yellow
git add "pages/fathers/john-chrysostom/Commentary on Job/Chapter 10.html"

Write-Host "`nChecking status again..." -ForegroundColor Yellow
git status

Write-Host "`nCommitting..." -ForegroundColor Yellow
git commit -m "Add Chapter 10 of Commentary on Job"

Write-Host "`nPushing to GitHub..." -ForegroundColor Yellow
git push

Write-Host "`nDone!" -ForegroundColor Green
