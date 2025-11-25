# TechNexus Maintenance Guide 🛠️

This guide will help you maintain and update TechNexus in the future (e.g., 5 months from now).

## 1. Automatic Updates (Hackathons & News) 🔄
**Good News:** You don't need to do anything!
The system is built to **automatically fetch new data every 24 hours**.
- **Hackathons:** Fetched from Unstop, Devfolio, HackerEarth.
- **News:** Fetched from Dev.to.

As long as your server is running, the data will stay fresh.

## 2. What if Data Stops Updating? ⚠️
If you see old data or no data after a few months, it usually means an **External API has changed**.

### How to Fix:
1.  Open `server/autoUpdater.js`.
2.  Check the API URLs (e.g., `https://unstop.com/api/...`).
3.  If a website changed their URL structure, you need to update it here.
4.  **Debug:** Run `npm run dev` in the server folder and watch the terminal logs for errors like "Failed to fetch".

## 3. Updating Text & Images 📝
If you want to change the "About Us" text or images:

- **About Page:** Edit `client/src/components/About.jsx`.
- **Taglines/Titles:** Edit `client/src/components/WelcomeDashboard.jsx`.
- **Images:** Replace images in `client/public/` or update the URLs in the code.

## 4. Updating API Keys 🔑
If your Google Login (Feedback) or AI Chat stops working:

1.  Open `server/.env`.
2.  **Feedback:** Generate a new Google App Password if the old one expired.
    - Update `EMAIL_PASS`.
3.  **AI Chat:** If the Groq API key expires, get a new one from [console.groq.com](https://console.groq.com).
    - Update `GROQ_API_KEY`.

## 5. Restarting the Server 🚀
If the app feels slow or stuck:
1.  Open your terminal.
2.  Press `Ctrl + C` to stop the server.
3.  Run `npm run dev` again.

## 6. Adding New Features ✨
If you want to add a new page or feature:
1.  Create a new component in `client/src/components/`.
2.  Add a route in `client/src/App.jsx`.
3.  Add a link in `client/src/components/Navbar.jsx`.
