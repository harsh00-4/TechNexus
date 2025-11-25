import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-black/50 dark:bg-black/50 light:bg-white/80 backdrop-blur-md border-b border-cyan-500/30">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link to="/" className="cursor-pointer">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                        TECHNEXUS
                    </h1>
                    <p className="text-xs text-cyan-400 font-medium">One Platform. All Opportunities.</p>
                </Link>

                <div className="flex items-center space-x-8">
                    <Link to="/dashboard" className="hover:text-cyan-400 transition-colors">DASHBOARD</Link>
                    <Link to="/news" className="hover:text-cyan-400 transition-colors">NEWS</Link>
                    <Link to="/arena" className="hover:text-cyan-400 transition-colors">ARENA</Link>
                    <Link to="/chat" className="hover:text-cyan-400 transition-colors">CHAT</Link>
                    <Link to="/resources" className="hover:text-cyan-400 transition-colors">RESOURCES</Link>
                    <Link to="/about" className="hover:text-cyan-400 transition-colors">ABOUT</Link>
                    <Link to="/feedback" className="hover:text-cyan-400 transition-colors">FEEDBACK</Link>

                    {/* Auth Buttons */}
                    {isAuthenticated ? (
                        <div className="flex items-center space-x-4">
                            <NotificationBell />
                            <span className="text-cyan-400 text-sm">
                                👤 {user?.name}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded-lg hover:bg-cyan-500/30 transition-colors text-sm"
                        >
                            Login
                        </Link>
                    )}

                    <button
                        onClick={toggleTheme}
                        className="ml-4 p-2 rounded-lg bg-gray-800 dark:bg-gray-800 light:bg-gray-200 hover:bg-gray-700 transition-colors text-xl"
                        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                    >
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
