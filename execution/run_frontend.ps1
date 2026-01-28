# Script: run_frontend.ps1
# Deskripsi: Menjalankan frontend development server
# Usage: .\run_frontend.ps1

$ErrorActionPreference = "Stop"
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
$rootPath = Split-Path -Parent $scriptPath
$frontendPath = Join-Path $rootPath "frontend"

Write-Host "🚀 Starting Bebang Frontend Server..." -ForegroundColor Cyan

# Check if frontend folder exists
if (-not (Test-Path $frontendPath)) {
    Write-Host "❌ Frontend folder not found at: $frontendPath" -ForegroundColor Red
    exit 1
}

# Check if node_modules exists
$nodeModulesPath = Join-Path $frontendPath "node_modules"
if (-not (Test-Path $nodeModulesPath)) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    Set-Location $frontendPath
    npm install
}

# Start the frontend server
Set-Location $frontendPath
Write-Host "✅ Starting frontend on http://localhost:5173" -ForegroundColor Green
Write-Host "🔗 API proxy configured to http://localhost:3001" -ForegroundColor Gray
npm run dev
