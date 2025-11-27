import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setMobileMenuOpen(false);
    };

    const navLinks = [
        { to: '/dashboard', label: 'DASHBOARD' },
        { to: '/news', label: 'NEWS' },
        { to: '/hackathons', label: 'HACKATHONS' },
        { to: '/arena', label: 'ARENA' },
        { to: '/resources', label: 'RESOURCES' },
        { to: '/about', label: 'ABOUT' },
        { to: '/feedback', label: 'FEEDBACK' },
    ];

    return (
        <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-cyan-500/30">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="cursor-pointer flex-shrink-0" onClick={() => setMobileMenuOpen(false)}>
                        <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                            TECHNEXUS
                        </h1>
                        <p className="text-[10px] md:text-xs text-cyan-400 font-medium hidden sm:block">One Platform. All Opportunities.</p>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-6">
                        {navLinks.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="text-sm hover:text-cyan-400 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Auth Buttons - Desktop */}
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-3">
                                <NotificationBell />
                                <span className="text-cyan-400 text-sm">
                                    👤 {user?.name}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="px-3 py-1.5 bg-red-500/20 border border-red-500/50 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="px-3 py-1.5 bg-cyan-500/20 border border-cyan-500/50 rounded-lg hover:bg-cyan-500/30 transition-colors text-sm"
                            >
                                Login
                            </Link>
                        )}

                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-xl"
                            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                        >
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center space-x-2 lg:hidden">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-lg"
                        >
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                        >
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden mt-4 pb-4 border-t border-gray-800 pt-4">
                        <div className="flex flex-col space-y-3">
                            {navLinks.map(link => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="text-sm hover:text-cyan-400 transition-colors py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {/* Auth Buttons - Mobile */}
                            <div className="border-t border-gray-800 pt-3 mt-3">
                                {isAuthenticated ? (
                                    <>
                                        <div className="flex items-center space-x-2 mb-3">
                                            <NotificationBell />
                                            <span className="text-cyan-400 text-sm">
                                                👤 {user?.name}
                                            </span>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        to="/login"
                                        className="block w-full text-center px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded-lg hover:bg-cyan-500/30 transition-colors text-sm"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
