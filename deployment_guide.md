# 🚀 Deployment Guide: Launching TechNexus

This guide will help you publish your app to the internet for **FREE**.

## 1. Backend Deployment (Render)
We will host the Node.js/Express server on Render.

1.  **Push Code to GitHub:**
    - Create a new repository on GitHub.
    - Push your `technexus` code to it.

2.  **Create Web Service on Render:**
    - Go to [dashboard.render.com](https://dashboard.render.com).
    - Click **New +** -> **Web Service**.
    - Connect your GitHub repository.

3.  **Configure Settings:**
    - **Name:** `technexus-api` (or similar)
    - **Root Directory:** `server`
    - **Runtime:** `Node`
    - **Build Command:** `npm install`
    - **Start Command:** `node index.js`

4.  **Environment Variables (Important!):**
    Add these in the "Environment" tab:
    - `MONGODB_URI`: Your MongoDB Atlas connection string.
    - `GROQ_API_KEY`: Your Groq API Key.
    - `JWT_SECRET`: A long random string.
    - `EMAIL_USER` / `EMAIL_PASS`: Your email credentials.

5.  **Deploy:** Click "Create Web Service". Wait for it to go live. Copy the URL (e.g., `https://technexus-api.onrender.com`).

---

## 2. Frontend Deployment (Vercel)
We will host the React/Vite app on Vercel.

1.  **Import Project to Vercel:**
    - Go to [vercel.com](https://vercel.com).
    - Click **Add New** -> **Project**.
    - Import the same GitHub repository.

2.  **Configure Settings:**
    - **Framework Preset:** Vite
    - **Root Directory:** `client` (Click "Edit" to change this!)

3.  **Environment Variables:**
    - **Name:** `VITE_API_URL`
    - **Value:** The Render Backend URL you just copied (e.g., `https://technexus-api.onrender.com`).
    - *Note: Do NOT add a trailing slash `/` at the end of the URL.*

4.  **Deploy:** Click "Deploy".

## 3. Final Check
- Open your Vercel URL.
- Check if News/Hackathons load (connects to backend).
- Check if Chat works.

🎉 **Congratulations! Your app is live!**
