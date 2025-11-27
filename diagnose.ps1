# TechNexus Diagnostic Script
Write-Host "🔍 TechNexus System Diagnostic" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Check Node.js
Write-Host "📦 Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "   ✓ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Node.js not found! Please install Node.js" -ForegroundColor Red
}

# Check npm
Write-Host "`n📦 Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "   ✓ npm installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "   ✗ npm not found!" -ForegroundColor Red
}

# Check if backend dependencies are installed
Write-Host "`n📦 Checking Backend Dependencies..." -ForegroundColor Yellow
if (Test-Path "server\node_modules") {
    Write-Host "   ✓ Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "   ✗ Backend dependencies NOT installed" -ForegroundColor Red
    Write-Host "   → Run: cd server && npm install" -ForegroundColor Yellow
}

# Check if frontend dependencies are installed
Write-Host "`n📦 Checking Frontend Dependencies..." -ForegroundColor Yellow
if (Test-Path "client\node_modules") {
    Write-Host "   ✓ Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "   ✗ Frontend dependencies NOT installed" -ForegroundColor Red
    Write-Host "   → Run: cd client && npm install" -ForegroundColor Yellow
}

# Check environment files
Write-Host "`n🔧 Checking Environment Files..." -ForegroundColor Yellow
if (Test-Path "server\.env") {
    Write-Host "   ✓ Backend .env exists" -ForegroundColor Green
    
    # Check for critical variables
    $envContent = Get-Content "server\.env" -Raw
    if ($envContent -match "MONGODB_URI=.+") {
        Write-Host "   ✓ MONGODB_URI is set" -ForegroundColor Green
    } else {
        Write-Host "   ⚠ MONGODB_URI might not be set properly" -ForegroundColor Yellow
    }
    
    if ($envContent -match "JWT_SECRET=.+") {
        Write-Host "   ✓ JWT_SECRET is set" -ForegroundColor Green
    } else {
        Write-Host "   ⚠ JWT_SECRET might not be set properly" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ✗ Backend .env NOT found" -ForegroundColor Red
    Write-Host "   → Copy server\.env.example to server\.env" -ForegroundColor Yellow
}

if (Test-Path "client\.env") {
    Write-Host "   ✓ Frontend .env exists" -ForegroundColor Green
} else {
    Write-Host "   ✗ Frontend .env NOT found" -ForegroundColor Red
    Write-Host "   → Copy client\.env.example to client\.env" -ForegroundColor Yellow
}

# Check if ports are in use
Write-Host "`n🌐 Checking Ports..." -ForegroundColor Yellow
$port5000 = netstat -ano | Select-String ":5000" | Select-String "LISTENING"
$port5173 = netstat -ano | Select-String ":5173" | Select-String "LISTENING"

if ($port5000) {
    Write-Host "   ✓ Port 5000 (Backend) is in use" -ForegroundColor Green
} else {
    Write-Host "   ○ Port 5000 (Backend) is available" -ForegroundColor Gray
    Write-Host "   → Backend server is not running" -ForegroundColor Yellow
}

if ($port5173) {
    Write-Host "   ✓ Port 5173 (Frontend) is in use" -ForegroundColor Green
} else {
    Write-Host "   ○ Port 5173 (Frontend) is available" -ForegroundColor Gray
    Write-Host "   → Frontend server is not running" -ForegroundColor Yellow
}

# Check MongoDB connection (if backend is running)
Write-Host "`n💾 Checking MongoDB..." -ForegroundColor Yellow
if ($port5000) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/" -TimeoutSec 2 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Host "   ✓ Backend is responding" -ForegroundColor Green
        }
    } catch {
        Write-Host "   ⚠ Backend is running but not responding properly" -ForegroundColor Yellow
        Write-Host "   → Check backend terminal for errors" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ○ Cannot check - backend not running" -ForegroundColor Gray
}

# Summary
Write-Host "`n" -NoNewline
Write-Host "================================" -ForegroundColor Cyan
Write-Host "📋 Summary & Next Steps" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

$issues = @()
$actions = @()

if (-not (Test-Path "server\node_modules")) {
    $issues += "Backend dependencies missing"
    $actions += "cd server && npm install"
}

if (-not (Test-Path "client\node_modules")) {
    $issues += "Frontend dependencies missing"
    $actions += "cd client && npm install"
}

if (-not (Test-Path "server\.env")) {
    $issues += "Backend .env missing"
    $actions += "Copy server\.env.example to server\.env and configure"
}

if (-not (Test-Path "client\.env")) {
    $issues += "Frontend .env missing"
    $actions += "Copy client\.env.example to client\.env"
}

if (-not $port5000) {
    $issues += "Backend server not running"
    $actions += "Start backend: cd server && npm run dev"
}

if (-not $port5173) {
    $issues += "Frontend server not running"
    $actions += "Start frontend: cd client && npm run dev"
}

if ($issues.Count -eq 0) {
    Write-Host "✅ Everything looks good!" -ForegroundColor Green
    Write-Host "`nYour application should be running at:" -ForegroundColor White
    Write-Host "   Frontend: http://localhost:5173" -ForegroundColor Cyan
    Write-Host "   Backend:  http://localhost:5000" -ForegroundColor Cyan
} else {
    Write-Host "⚠ Issues found: $($issues.Count)" -ForegroundColor Yellow
    Write-Host "`nRequired actions:" -ForegroundColor White
    for ($i = 0; $i -lt $actions.Count; $i++) {
        Write-Host "   $($i + 1). $($actions[$i])" -ForegroundColor Yellow
    }
    
    Write-Host "`n💡 Quick Fix:" -ForegroundColor Cyan
    Write-Host "   Run: .\start-dev.ps1" -ForegroundColor White
    Write-Host "   (This will start both servers automatically)" -ForegroundColor Gray
}

Write-Host "`n📚 For detailed troubleshooting, see: TROUBLESHOOTING.md" -ForegroundColor Gray
Write-Host "`nPress any key to exit..." -ForegroundColor DarkGray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
