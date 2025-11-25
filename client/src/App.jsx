import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/Navbar';
import WelcomeDashboard from './components/WelcomeDashboard';
import MainDashboard from './components/MainDashboard';
import NewsFeed from './components/NewsFeed';
import Hackathons from './components/Hackathons';
import ProblemArena from './components/ProblemArena';
import AIChat from './components/AIChat';
import Feedback from './components/Feedback';
import Resources from './components/Resources';
import About from './components/About';
import Login from './components/Login';
import Signup from './components/Signup';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <div className="min-h-screen bg-black dark:bg-black light:bg-white transition-colors">
              <Routes>
                {/* Welcome Page */}
                <Route path="/" element={<WelcomeDashboard />} />

                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Main App Routes */}
                <Route path="/dashboard" element={
                  <>
                    <Navbar />
                    <MainDashboard />
                  </>
                } />

                <Route path="/news" element={
                  <>
                    <Navbar />
                    <NewsFeed />
                  </>
                } />

                <Route path="/hackathons" element={
                  <>
                    <Navbar />
                    <Hackathons />
                  </>
                } />

                <Route path="/arena" element={
                  <>
                    <Navbar />
                    <ProblemArena />
                  </>
                } />

                <Route path="/chat" element={
                  <>
                    <Navbar />
                    <AIChat />
                  </>
                } />

                <Route path="/feedback" element={
                  <>
                    <Navbar />
                    <Feedback />
                  </>
                } />

                <Route path="/resources" element={
                  <>
                    <Navbar />
                    <Resources />
                  </>
                } />

                <Route path="/about" element={
                  <>
                    <Navbar />
                    <About />
                  </>
                } />

                {/* Catch all - redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
