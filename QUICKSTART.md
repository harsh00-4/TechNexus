# 🚀 Quick Start Guide - TechNexus

## The Problem: UI and Backend Not Working

If your UI and backend aren't connecting, follow these steps:

---

## ⚡ Quick Fix (5 minutes)

### Step 1: Ensure Environment Files Exist

```powershell
# Check if .env files exist
Test-Path server\.env
Test-Path client\.env
```

If either returns `False`, create them:

**Backend (.env):**
```powershell
# Copy the example file
Copy-Item server\.env.example server\.env

# Edit server\.env and set at minimum:
# MONGODB_URI=mongodb://localhost:27017/technexus
# JWT_SECRET=your_secret_key_here_change_this_to_something_random
```

**Frontend (.env):**
```powershell
# Copy the example file
Copy-Item client\.env.example client\.env
# Content should be: VITE_API_URL=http://localhost:5000
```

### Step 2: Install Dependencies (if not already done)

```powershell
# Backend
cd server
npm install

# Frontend
cd ../client
npm install

cd ..
```

### Step 3: Start the Application

**Option A - Automated (Recommended):**
```powershell
.\start-dev.ps1
```

**Option B - Manual:**

Terminal 1:
```powershell
cd server
npm run dev
```

Terminal 2:
```powershell
cd client
npm run dev
```

### Step 4: Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

---

## 🔍 Still Not Working?

### Check 1: Is MongoDB Running?

The backend needs MongoDB. You have two options:

**Option A: Use MongoDB Atlas (Free Cloud Database)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account and cluster
3. Get your connection string
4. Update `MONGODB_URI` in `server\.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/technexus
   ```

**Option B: Install MongoDB Locally**
1. Download from https://www.mongodb.com/try/download/community
2. Install and start MongoDB service
3. Use in `server\.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/technexus
   ```

### Check 2: Are the Servers Running?

```powershell
# Check if backend is running on port 5000
netstat -ano | findstr :5000

# Check if frontend is running on port 5173
netstat -ano | findstr :5173
```

If nothing shows up, the servers aren't running. Go back to Step 3.

### Check 3: Check Browser Console

1. Open your browser to http://localhost:5173
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Look for errors (especially network errors)

Common errors and fixes:
- **"Failed to fetch"** → Backend not running
- **"CORS error"** → Backend not configured properly (should be fixed)
- **"401 Unauthorized"** → Login/authentication issue (try logging in)

---

## ✅ What Fixed

I've made the following changes to fix your UI and backend connection:

### 1. Fixed Hardcoded API URLs in ChatBox.jsx
- **Before:** Used `http://localhost:5000` directly
- **After:** Uses `import.meta.env.VITE_API_URL` with fallback
- **Impact:** Chat feature now works in both dev and production

### 2. Created Startup Script (`start-dev.ps1`)
- Automatically starts both backend and frontend
- Opens separate terminal windows for each
- Easy one-command startup

### 3. Created Environment File Template (`client/.env.example`)
- Provides correct configuration for frontend
- Easy to copy and use

### 4. Created Troubleshooting Guide (`TROUBLESHOOTING.md`)
- Comprehensive guide for all common issues
- Step-by-step solutions
- Diagnostic checklist

### 5. Created Diagnostic Script (`diagnose.ps1`)
- Automatically checks your setup
- Identifies missing dependencies
- Verifies configuration

---

## 📋 Verification Checklist

After starting, verify these work:

- [ ] Frontend loads at http://localhost:5173
- [ ] Backend responds at http://localhost:5000
- [ ] Can create an account
- [ ] Can login
- [ ] News feed shows articles
- [ ] Hackathons page loads
- [ ] Problem Arena works
- [ ] Chat feature works (when logged in)

---

## 🆘 Emergency Reset

If nothing works, try this complete reset:

```powershell
# 1. Stop all servers (Ctrl+C in all terminals)

# 2. Clean backend
cd server
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue
npm install

# 3. Clean frontend
cd ../client
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue
npm install

# 4. Ensure .env files exist
cd ..
if (-not (Test-Path server\.env)) { Copy-Item server\.env.example server\.env }
if (-not (Test-Path client\.env)) { Copy-Item client\.env.example client\.env }

# 5. Edit server\.env with your MongoDB URI and JWT secret

# 6. Start everything
.\start-dev.ps1
```

---

## 📞 Need More Help?

1. **Read the full troubleshooting guide:** `TROUBLESHOOTING.md`
2. **Check backend logs:** Look at the terminal running the backend
3. **Check browser console:** Press F12 in your browser
4. **Verify MongoDB:** Make sure it's running and accessible

---

## 🎯 Expected Output

### Backend Terminal Should Show:
```
🚀 Starting TechNexus Server...
✓ MongoDB connected
✓ Server running on http://0.0.0.0:5000
✓ Security: Helmet, Manual XSS Protection, HPP, Rate Limiting
✓ FREE Auto-updates: Active (Dev.to + Unstop)
```

### Frontend Terminal Should Show:
```
VITE v7.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Browser Should Show:
- TechNexus homepage
- No console errors
- All features working

---

## 💡 Pro Tips

1. **Always start backend first** - Frontend needs backend API
2. **Keep terminals open** - You'll see errors immediately
3. **Check MongoDB first** - Most issues are database connection
4. **Clear browser cache** - If you see old/cached data
5. **Use the diagnostic script** - Run `.\diagnose.ps1` to check everything

---

**Last Updated:** 2025-11-26
**Version:** 1.0
