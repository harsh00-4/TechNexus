# 🚀 TechNexus - The Ultimate Student Tech Platform

![TechNexus Banner](https://img.shields.io/badge/TechNexus-Live-cyan?style=for-the-badge)
![MERN Stack](https://img.shields.io/badge/MERN-Stack-green?style=for-the-badge)
![AI Powered](https://img.shields.io/badge/AI-Powered-purple?style=for-the-badge)

TechNexus is a futuristic, AI-powered platform designed to help students discover hackathons, stay updated with tech news, and solve coding problems.

## ✨ Features

- **🤖 AI Assistant:** 24/7 Chatbot powered by Llama 3.3 (Groq) for coding help and career advice.
- **🏆 Hackathon Discovery:** Auto-updated list of hackathons from Unstop, Devfolio, and more.
- **📰 Tech News:** Real-time tech news feed from Dev.to.
- **⚔️ Problem Arena:** Community-driven coding problems with voting system.
- **🛡️ 24/7 Monitoring:** Self-healing system with AI error analysis.
- **🎨 Cyberpunk UI:** Glassmorphism design with dark/light mode.

## 🛠️ Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **AI:** Groq SDK (Llama 3.3 70B)
- **Security:** Helmet, Rate Limiting, HPP, Manual XSS Protection

---

## 🚀 Quick Start (Local)

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/technexus.git
    cd technexus
    ```

2.  **Install Dependencies**
    ```bash
    # Install server dependencies
    cd server
    npm install

    # Install client dependencies
    cd ../client
    npm install
    ```

3.  **Configure Environment**
    - Create `server/.env` (copy from `server/.env.example`)
    - Create `client/.env` (set `VITE_API_URL=http://localhost:5000`)

4.  **Run the App**
    ```bash
    # Terminal 1: Start Backend
    cd server
    npm run dev

    # Terminal 2: Start Frontend
    cd client
    npm run dev
    ```

---

## ☁️ Deployment

### Backend (Render)
1.  Create a new Web Service on [Render](https://render.com).
2.  Connect your repo.
3.  Render will automatically detect the `render.yaml` blueprint.
4.  Add your environment variables (MongoDB URI, API Keys).

### Frontend (Vercel)
1.  Import your repo to [Vercel](https://vercel.com).
2.  Set Root Directory to `client`.
3.  Add Environment Variable: `VITE_API_URL` = Your Render Backend URL.
4.  Deploy!

---

## 🛡️ Security & Monitoring

- **Antivirus:** Optional ClamAV integration for file uploads.
- **Rate Limiting:** Protects against DDoS and spam.
- **Self-Healing:** Server automatically restarts and reconnects to DB on failure.

---

Made with ❤️ by TechNexus Team
