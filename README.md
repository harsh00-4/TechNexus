# TechNexus - The Ultimate Student Tech Platform

TechNexus is a comprehensive platform designed for students to stay updated with the latest tech news, find hackathons, solve problems, and connect with peers.

## 🚀 Quick Start (Docker) - Recommended

The easiest way to run the application is using Docker. This ensures it works on any machine.

1.  **Prerequisites:** Install [Docker Desktop](https://www.docker.com/products/docker-desktop/).
2.  **Run:**
    ```bash
    docker-compose up --build
    ```
3.  **Access:**
    -   Frontend: http://localhost:5173
    -   Backend: http://localhost:5000

## 🛠 Manual Setup

### Prerequisites
-   Node.js (v18+)
-   MongoDB (Local or Atlas)

### Installation

1.  **Install Dependencies:**
    ```bash
    cd server && npm install
    cd ../client && npm install
    ```

2.  **Environment Setup:**
    -   Copy `server/.env.example` to `server/.env` and configure `MONGODB_URI`.
    -   Copy `client/.env.example` to `client/.env`.

3.  **Start Development Servers:**
    ```powershell
    .\start-dev.ps1
    ```

## 📚 Documentation

-   [Deployment Guide](deployment_guide.md)
-   [Troubleshooting](TROUBLESHOOTING.md)
-   [Quick Start](QUICKSTART.md)

## 🌟 Features

-   **Tech News:** AI-curated news feed.
-   **Hackathons:** Aggregated hackathon listings.
-   **Problem Arena:** Discuss and solve tech problems.
-   **Groups & Chat:** Real-time communication.
-   **Gamification:** Earn points and badges.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines.

## 📄 License

MIT
