# ifoto Docker Quick Start Script
# This script helps you set up and run the ifoto platform

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  ifoto Platform - Docker Setup  " -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "Checking Docker..." -ForegroundColor Yellow
try {
    docker info | Out-Null
    Write-Host "✓ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Navigate to docker directory
Set-Location -Path $PSScriptRoot

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host ""
    Write-Host "Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✓ .env file created" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: Edit the .env file and set secure passwords!" -ForegroundColor Red
    Write-Host "   Required changes:" -ForegroundColor Yellow
    Write-Host "   - POSTGRES_PASSWORD" -ForegroundColor Yellow
    Write-Host "   - JWT_SECRET (minimum 64 characters)" -ForegroundColor Yellow
    Write-Host "   - MINIO_ROOT_PASSWORD" -ForegroundColor Yellow
    Write-Host ""
    
    $continue = Read-Host "Have you updated the .env file? (yes/no)"
    if ($continue -ne "yes") {
        Write-Host "Please update .env file and run this script again." -ForegroundColor Yellow
        exit 0
    }
}

# Start services
Write-Host ""
Write-Host "Starting ifoto services..." -ForegroundColor Yellow
Write-Host "This may take 5-10 minutes on first run (downloading images and AI models)..." -ForegroundColor Cyan
Write-Host ""

docker compose up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ Services started successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Access the application at:" -ForegroundColor Cyan
    Write-Host "  Frontend:      http://localhost" -ForegroundColor White
    Write-Host "  Backend API:   http://localhost:8080/api" -ForegroundColor White
    Write-Host "  MinIO Console: http://localhost:9001" -ForegroundColor White
    Write-Host ""
    Write-Host "To view logs:" -ForegroundColor Cyan
    Write-Host "  docker compose logs -f" -ForegroundColor White
    Write-Host ""
    Write-Host "To stop services:" -ForegroundColor Cyan
    Write-Host "  docker compose down" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "✗ Failed to start services. Check the output above for errors." -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "  - .env file not configured correctly" -ForegroundColor White
    Write-Host "  - Ports already in use (80, 8080, 5000, 5432, 6333, 9000)" -ForegroundColor White
    Write-Host "  - Not enough Docker resources allocated" -ForegroundColor White
    Write-Host ""
}
