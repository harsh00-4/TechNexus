# TechNexus Development Startup Script
Write-Host "🚀 Starting TechNexus Development Environment..." -ForegroundColor Cyan

# Check if MongoDB is required
Write-Host "`n📦 Checking MongoDB connection..." -ForegroundColor Yellow
Write-Host "Make sure MongoDB is running (local or Atlas)" -ForegroundColor Gray

# Start Backend Server
Write-Host "`n🔧 Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location -LiteralPath '$PSScriptRoot\server'; Write-Host '🔧 Backend Server' -ForegroundColor Green; npm run dev"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start Frontend Client
Write-Host "🎨 Starting Frontend Client..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location -LiteralPath '$PSScriptRoot\client'; Write-Host '🎨 Frontend Client' -ForegroundColor Cyan; npm run dev"

Write-Host "`n✅ Development environment is starting!" -ForegroundColor Green
Write-Host "   - Backend: http://localhost:5000" -ForegroundColor Gray
Write-Host "   - Frontend: http://localhost:5173" -ForegroundColor Gray
Write-Host "`nPress any key to exit this window (servers will keep running)..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
