import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Feedback = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('');

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await fetch(`${API_URL}/api/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' });
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Feedback error:', error);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-black dark:bg-black light:bg-gray-50 pt-24 px-6 text-white dark:text-white light:text-gray-900">
            <div className="max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-4xl font-bold text-cyan-400 dark:text-cyan-400 light:text-blue-600 mb-4 text-center">
                        💬 FEEDBACK
                    </h2>
                    <p className="text-gray-400 dark:text-gray-400 light:text-gray-600 text-center mb-8">
                        We'd love to hear from you! Share your thoughts, suggestions, or report issues.
                    </p>

                    <div className="bg-gray-900/50 dark:bg-gray-900/50 light:bg-white p-8 rounded-xl border border-gray-800 dark:border-gray-800 light:border-gray-200">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name Field */}
                            <div>
                                <label className="block text-sm font-bold mb-2 text-cyan-400 dark:text-cyan-400 light:text-blue-600">
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-black dark:bg-black light:bg-gray-100 border border-gray-700 dark:border-gray-700 light:border-gray-300 rounded-lg text-white dark:text-white light:text-gray-900 focus:outline-none focus:border-cyan-500"
                                    placeholder="John Doe"
                                />
                            </div>

                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-bold mb-2 text-cyan-400 dark:text-cyan-400 light:text-blue-600">
                                    Your Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-black dark:bg-black light:bg-gray-100 border border-gray-700 dark:border-gray-700 light:border-gray-300 rounded-lg text-white dark:text-white light:text-gray-900 focus:outline-none focus:border-cyan-500"
                                    placeholder="john@example.com"
                                />
                            </div>

                            {/* Message Field */}
                            <div>
                                <label className="block text-sm font-bold mb-2 text-cyan-400 dark:text-cyan-400 light:text-blue-600">
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="6"
                                    className="w-full px-4 py-3 bg-black dark:bg-black light:bg-gray-100 border border-gray-700 dark:border-gray-700 light:border-gray-300 rounded-lg text-white dark:text-white light:text-gray-900 focus:outline-none focus:border-cyan-500 resize-none"
                                    placeholder="Share your feedback, suggestions, or report an issue..."
                                />
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full py-3 rounded-lg font-bold text-white transition-colors ${loading
                                    ? 'bg-gray-600 cursor-not-allowed'
                                    : 'bg-cyan-700 hover:bg-cyan-600 dark:bg-cyan-700 dark:hover:bg-cyan-600 light:bg-blue-600 light:hover:bg-blue-700'
                                    }`}
                            >
                                {loading ? 'SENDING...' : 'SEND FEEDBACK'}
                            </motion.button>
                        </form>

                        {/* Status Messages */}
                        {status === 'success' && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 p-4 bg-green-900/50 border border-green-500 rounded-lg"
                            >
                                <p className="text-green-300 text-center font-bold">
                                    ✅ Thank you! Your feedback has been sent successfully.
                                </p>
                            </motion.div>
                        )}

                        {status === 'error' && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-lg"
                            >
                                <p className="text-red-300 text-center font-bold">
                                    ❌ Oops! Something went wrong. Please try again.
                                </p>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Feedback;
