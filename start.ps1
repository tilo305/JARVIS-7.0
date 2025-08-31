# JARVIS Chatbot - Auto Startup Script
# This script ensures the project works automatically every time you pull it up

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   JARVIS Chatbot - Auto Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if pnpm is installed
try {
    $pnpmVersion = pnpm --version
    Write-Host "✓ pnpm found (version: $pnpmVersion)" -ForegroundColor Green
} catch {
    Write-Host "✗ pnpm not found. Please install pnpm first:" -ForegroundColor Red
    Write-Host "  npm install -g pnpm" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if dependencies are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "Dependencies not found. Installing..." -ForegroundColor Yellow
    Write-Host ""
    
    try {
        pnpm install
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Dependencies installed successfully!" -ForegroundColor Green
        } else {
            throw "Installation failed with exit code $LASTEXITCODE"
        }
    } catch {
        Write-Host "✗ Failed to install dependencies: $_" -ForegroundColor Red
        Write-Host ""
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host ""
} else {
    Write-Host "✓ Dependencies found." -ForegroundColor Green
    Write-Host ""
}

# Start development server
Write-Host "Starting development server..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Your JARVIS chatbot will be available at:" -ForegroundColor White
Write-Host "http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

try {
    pnpm dev
} catch {
    Write-Host "✗ Failed to start development server: $_" -ForegroundColor Red
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}
