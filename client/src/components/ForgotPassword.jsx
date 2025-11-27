import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resetUrl, setResetUrl] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setResetUrl('');
        setLoading(true);

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (data.success) {
                setMessage(data.message);
                // In development, show the reset URL
                if (data.resetUrl) {
                    setResetUrl(data.resetUrl);
                }
            } else {
                setError(data.message || 'Failed to send reset email');
            }
        } catch (err) {
            console.error('Forgot password error:', err);
            setError(err.message || 'Network error. Please try again.');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-6 pt-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full"
            >
                {/* Forgot Password Card */}
                <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 backdrop-blur-lg">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-cyan-400 mb-2">
                            Forgot Password?
                        </h1>
                        <p className="text-gray-400">
                            Enter your email and we'll send you a reset link
                        </p>
                    </div>

                    {/* Success Message */}
                    {message && (
                        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/50 rounded-lg">
                            <p className="text-green-500 text-sm">{message}</p>
                            {resetUrl && (
                                <div className="mt-2">
                                    <p className="text-xs text-gray-400 mb-1">Development Mode - Reset Link:</p>
                                    <a
                                        href={resetUrl}
                                        className="text-xs text-cyan-400 hover:underline break-all"
                                    >
                                        {resetUrl}
                                    </a>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                            <p className="text-red-500 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label className="block text-gray-300 mb-2 font-medium">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                placeholder="your.email@example.com"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>

                    {/* Back to Login */}
                    <div className="mt-6 text-center">
                        <Link
                            to="/login"
                            className="text-cyan-400 hover:underline font-semibold"
                        >
                            ← Back to Login
                        </Link>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="mt-4 text-center">
                    <Link
                        to="/"
                        className="text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
