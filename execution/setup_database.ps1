# Script: setup_database.ps1
# Deskripsi: Setup PostgreSQL database untuk Bebang Sistem Informasi
# Usage: .\setup_database.ps1 [-Reset]

param(
    [switch]$Reset
)

$ErrorActionPreference = "Stop"
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
$rootPath = Split-Path -Parent $scriptPath
$backendPath = Join-Path $rootPath "backend"

Write-Host "🗄️ Setting up Bebang Database..." -ForegroundColor Cyan

# Check if backend folder exists
if (-not (Test-Path $backendPath)) {
    Write-Host "❌ Backend folder not found at: $backendPath" -ForegroundColor Red
    exit 1
}

Set-Location $backendPath

# Check if .env exists
$envPath = Join-Path $backendPath ".env"
if (-not (Test-Path $envPath)) {
    Write-Host "⚠️ .env file not found. Copying from .env.example..." -ForegroundColor Yellow
    $envExamplePath = Join-Path $backendPath ".env.example"
    if (Test-Path $envExamplePath) {
        Copy-Item $envExamplePath $envPath
        Write-Host "✅ Created .env file" -ForegroundColor Green
    } else {
        Write-Host "❌ .env.example not found!" -ForegroundColor Red
        exit 1
    }
}

# Reset database if requested
if ($Reset) {
    Write-Host "🔄 Resetting database..." -ForegroundColor Yellow
    npx prisma migrate reset --force
} else {
    # Run migrations
    Write-Host "📦 Running Prisma migrations..." -ForegroundColor Yellow
    npx prisma migrate dev --name init
}

# Generate Prisma client
Write-Host "⚙️ Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate

# Seed database
Write-Host "🌱 Seeding database..." -ForegroundColor Yellow
npx prisma db seed

Write-Host ""
Write-Host "✅ Database setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Default users:" -ForegroundColor Cyan
Write-Host "  Admin: NIK=ADMIN001, Password=admin123" -ForegroundColor Gray
Write-Host "  User:  NIK=USER001, Password=user123" -ForegroundColor Gray
Write-Host ""
Write-Host "🔍 Open Prisma Studio: npx prisma studio" -ForegroundColor Cyan
