# 🔧 TechNexus - Troubleshooting Guide

## Common Issues and Solutions

### Issue: UI and Backend Not Working

This guide will help you diagnose and fix connection issues between the frontend and backend.

---

## ✅ Pre-Flight Checklist

### 1. **Environment Variables Setup**

#### Backend (.env file in `/server` directory)
```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/technexus
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/technexus
JWT_SECRET=your_super_secret_jwt_key_change_this
GROQ_API_KEY=your_groq_api_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

**Action Required:**
- Copy `server/.env.example` to `server/.env`
- Fill in your actual values
- **Minimum required:** `MONGODB_URI` and `JWT_SECRET`

#### Frontend (.env file in `/client` directory)
```bash
VITE_API_URL=http://localhost:5000
```

**Action Required:**
- Copy `client/.env.example` to `client/.env`
- Or create the file with the above content

---

### 2. **MongoDB Connection**

The backend requires MongoDB to be running. You have two options:

#### Option A: Local MongoDB
```powershell
# Check if MongoDB is running
Get-Process mongod

# If not running, start it (if installed)
mongod --dbpath C:\data\db
```

#### Option B: MongoDB Atlas (Cloud - Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Update `MONGODB_URI` in `server/.env`

---

### 3. **Install Dependencies**

```powershell
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

---

## 🚀 Starting the Application

### Method 1: Automated Startup (Recommended)
```powershell
# From the root directory
.\start-dev.ps1
```

This will open two terminal windows:
- Backend server on http://localhost:5000
- Frontend client on http://localhost:5173

### Method 2: Manual Startup

**Terminal 1 - Backend:**
```powershell
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd client
npm run dev
```

---

## 🔍 Troubleshooting Specific Issues

### Issue 1: "Cannot connect to backend"

**Symptoms:**
- Frontend loads but shows no data
- Console errors about failed fetch requests
- Chat/features not working

**Solutions:**

1. **Check if backend is running:**
   ```powershell
   netstat -ano | findstr :5000
   ```
   If nothing appears, backend is not running.

2. **Check backend logs:**
   Look for these success messages:
   ```
   ✓ MongoDB connected
   ✓ Server running on http://0.0.0.0:5000
   ```

3. **Verify .env files exist:**
   ```powershell
   # Check backend .env
   Test-Path server\.env
   
   # Check frontend .env
   Test-Path client\.env
   ```

4. **Check MongoDB connection:**
   - If using local MongoDB, ensure it's running
   - If using Atlas, verify connection string is correct
   - Test connection string format: `mongodb://...` or `mongodb+srv://...`

### Issue 2: "CORS errors in browser console"

**Symptoms:**
- Error: "Access to fetch at 'http://localhost:5000' from origin 'http://localhost:5173' has been blocked by CORS policy"

**Solution:**
The backend already has CORS configured for localhost:5173. If you see this error:

1. Ensure backend is running
2. Check that frontend is accessing the correct URL
3. Verify `VITE_API_URL` in `client/.env` is set to `http://localhost:5000`

### Issue 3: "Authentication not working"

**Symptoms:**
- Cannot login/signup
- "Invalid token" errors
- Features requiring auth don't work

**Solutions:**

1. **Check JWT_SECRET is set:**
   ```powershell
   # In server directory
   node -e "require('dotenv').config(); console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET')"
   ```

2. **Clear browser storage:**
   - Open DevTools (F12)
   - Go to Application > Local Storage
   - Clear all items
   - Refresh page

3. **Re-register/login:**
   - Try creating a new account
   - Check backend logs for errors

### Issue 4: "Chat not working"

**Symptoms:**
- Chat box shows "Please login"
- Messages don't send
- Messages don't load

**Solutions:**

1. **Verify you're logged in:**
   - Check if user info appears in navbar
   - Check localStorage for 'token'

2. **Check auth middleware:**
   - Backend logs should show authenticated requests
   - Look for "Authorization" header in network tab

3. **Database check:**
   - Ensure Message model exists in database
   - Check MongoDB connection

### Issue 5: "Hackathons/News not loading"

**Symptoms:**
- Shows "Loading..." indefinitely
- Empty lists

**Solutions:**

1. **Check API endpoints:**
   ```powershell
   # Test backend directly
   curl http://localhost:5000/api/hackathons
   curl http://localhost:5000/api/news
   ```

2. **Check auto-updater:**
   - Backend logs should show data fetching
   - May take a few minutes on first start

3. **Manual refresh:**
   ```powershell
   curl http://localhost:5000/api/refresh
   ```

---

## 🧪 Testing Checklist

After starting the application, verify:

- [ ] Backend responds at http://localhost:5000
- [ ] Frontend loads at http://localhost:5173
- [ ] Can create an account (signup)
- [ ] Can login with created account
- [ ] News feed shows articles
- [ ] Hackathons page shows events
- [ ] Problem Arena loads
- [ ] Can post a problem (when logged in)
- [ ] Chat feature works (when logged in)
- [ ] Feedback form submits successfully

---

## 📊 Health Check Endpoint

Check backend status:
```powershell
curl http://localhost:5000/api/monitoring/dashboard
```

This returns:
- System uptime
- Memory usage
- Error statistics
- Database status
- Update status

---

## 🐛 Debug Mode

### Enable Verbose Logging

**Backend:**
Add to `server/.env`:
```
NODE_ENV=development
DEBUG=*
```

**Frontend:**
Check browser console (F12) for detailed error messages.

---

## 📝 Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `ECONNREFUSED` | Backend not running | Start backend server |
| `MongoNetworkError` | MongoDB not accessible | Check MongoDB connection |
| `Invalid token` | JWT issue | Clear localStorage, re-login |
| `404 Not Found` | Wrong API URL | Check VITE_API_URL |
| `CORS error` | Cross-origin issue | Ensure backend CORS is configured |

---

## 🔄 Reset Everything

If all else fails, complete reset:

```powershell
# Stop all running servers (Ctrl+C in terminals)

# Clean install backend
cd server
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install

# Clean install frontend
cd ../client
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install

# Verify .env files
# server/.env - must have MONGODB_URI and JWT_SECRET
# client/.env - must have VITE_API_URL

# Restart
cd ..
.\start-dev.ps1
```

---

## 📞 Still Having Issues?

1. Check the browser console (F12) for errors
2. Check backend terminal for error logs
3. Verify all environment variables are set correctly
4. Ensure MongoDB is running and accessible
5. Try accessing backend directly: http://localhost:5000

---

## 🎯 Quick Start (TL;DR)

```powershell
# 1. Setup environment files
cp server/.env.example server/.env
cp client/.env.example client/.env

# 2. Edit server/.env with your MongoDB URI and JWT secret

# 3. Install dependencies
cd server && npm install && cd ../client && npm install && cd ..

# 4. Start everything
.\start-dev.ps1

# 5. Open browser to http://localhost:5173
```

---

## ✨ Success Indicators

You'll know everything is working when:

1. **Backend terminal shows:**
   ```
   ✓ MongoDB connected
   ✓ Server running on http://0.0.0.0:5000
   ✓ Security: Helmet, Manual XSS Protection, HPP, Rate Limiting
   ```

2. **Frontend terminal shows:**
   ```
   VITE v7.x.x ready in xxx ms
   ➜ Local: http://localhost:5173/
   ```

3. **Browser shows:**
   - TechNexus homepage loads
   - No console errors
   - Can navigate between pages
   - Features work as expected
