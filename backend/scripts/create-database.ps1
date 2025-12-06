# Create SyncFlow Database Script
# This script creates the syncflow database if it doesn't exist

$psqlPath = "C:\Program Files\PostgreSQL\18\bin\psql.exe"

Write-Host "Creating SyncFlow database..." -ForegroundColor Cyan
Write-Host "You will be prompted for the PostgreSQL password (postgres user)" -ForegroundColor Yellow
Write-Host ""

# Check if database already exists
$dbExists = & $psqlPath -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname='syncflow'"

if ($dbExists -eq "1") {
    Write-Host "Database 'syncflow' already exists!" -ForegroundColor Green
    Write-Host "Skipping creation..." -ForegroundColor Yellow
} else {
    Write-Host "Creating database 'syncflow'..." -ForegroundColor Cyan
    & $psqlPath -U postgres -c "CREATE DATABASE syncflow;"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Database 'syncflow' created successfully!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "❌ Failed to create database. Please check your password." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Update backend/.env with your PostgreSQL password" -ForegroundColor White
Write-Host "2. Run: cd backend && npm run migrate" -ForegroundColor White

