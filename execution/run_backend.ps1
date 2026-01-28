# Script: run_backend.ps1
# Deskripsi: Menjalankan backend development server
# Usage: .\run_backend.ps1

$ErrorActionPreference = "Stop"
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
$rootPath = Split-Path -Parent $scriptPath
$backendPath = Join-Path $rootPath "backend"

Write-Host "🚀 Starting Bebang Backend Server..." -ForegroundColor Cyan

# Check if backend folder exists
if (-not (Test-Path $backendPath)) {
    Write-Host "❌ Backend folder not found at: $backendPath" -ForegroundColor Red
    exit 1
}

# Check if node_modules exists
$nodeModulesPath = Join-Path $backendPath "node_modules"
if (-not (Test-Path $nodeModulesPath)) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    Set-Location $backendPath
    npm install
}

# Check if Prisma client is generated
$prismaClientPath = Join-Path $nodeModulesPath ".prisma\client"
if (-not (Test-Path $prismaClientPath)) {
    Write-Host "⚙️ Generating Prisma client..." -ForegroundColor Yellow
    Set-Location $backendPath
    npx prisma generate
}

# Start the backend server
Set-Location $backendPath
Write-Host "✅ Starting backend on http://localhost:3001" -ForegroundColor Green
Write-Host "📋 Health check: http://localhost:3001/health" -ForegroundColor Gray
npm run dev
