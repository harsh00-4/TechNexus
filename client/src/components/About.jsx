import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
    return (
        <div className="min-h-screen bg-black dark:bg-black light:bg-gray-50 pt-24 px-6 text-white dark:text-white light:text-gray-900">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* About Section (Story & Vision) */}
                    <div className="mb-16">
                        <h2 className="text-4xl font-bold text-cyan-400 dark:text-cyan-400 light:text-blue-600 mb-8 text-center">
                            👋 ABOUT TECHNEXUS
                        </h2>

                        <div className="bg-gray-900/50 dark:bg-gray-900/50 light:bg-white p-8 rounded-xl border border-gray-800 dark:border-gray-800 light:border-gray-200 mb-8">
                            <h3 className="text-2xl font-bold text-cyan-400 dark:text-cyan-400 light:text-blue-600 mb-4">
                                Our Story
                            </h3>
                            <p className="text-gray-300 dark:text-gray-300 light:text-gray-700 text-lg leading-relaxed mb-4">
                                Hi! I'm <span className="text-cyan-400 font-bold">Harsh Pandey</span>, a tech student from <span className="text-cyan-400 font-bold">Chandigarh University</span>.
                            </p>
                            <p className="text-gray-300 dark:text-gray-300 light:text-gray-700 text-lg leading-relaxed mb-4">
                                As a student, I faced a common problem: finding hackathons, tech news, coding resources, and opportunities meant visiting 10+ different websites daily. It was time-consuming, overwhelming, and frustrating.
                            </p>
                            <p className="text-gray-300 dark:text-gray-300 light:text-gray-700 text-lg leading-relaxed">
                                That's when I decided to build <span className="text-cyan-400 font-bold">TechNexus</span> - a single platform where tech students can find everything they need in one place.
                            </p>
                        </div>

                        <div className="bg-gradient-to-r from-cyan-900/20 to-purple-900/20 p-8 rounded-xl border border-cyan-500/30">
                            <h3 className="text-2xl font-bold text-cyan-400 dark:text-cyan-400 light:text-blue-600 mb-4">
                                🎯 Our Vision
                            </h3>
                            <p className="text-gray-300 dark:text-gray-300 light:text-gray-700 text-lg leading-relaxed">
                                To create <span className="text-cyan-400 font-bold">ONE unified platform</span> where all tech students can come together, access opportunities, learn, grow, and succeed - without jumping between multiple websites.
                            </p>
                            <p className="text-gray-300 dark:text-gray-300 light:text-gray-700 text-lg leading-relaxed mt-4">
                                No more searching 10 different sites. No more missing opportunities. Just one platform with everything you need.
                            </p>
                        </div>
                    </div>

                    {/* AI Power Section */}
                    <div className="mb-16 bg-gradient-to-r from-purple-900/20 to-cyan-900/20 p-8 rounded-xl border border-purple-500/30">
                        <h2 className="text-3xl font-bold text-cyan-400 dark:text-cyan-400 light:text-blue-600 mb-6 text-center">
                            🤖 THE POWER OF AI
                        </h2>
                        <p className="text-gray-300 dark:text-gray-300 light:text-gray-700 text-lg text-center mb-8">
                            TechNexus isn't just a list of links. It's powered by an advanced AI Assistant designed to be your personal tech mentor.
                        </p>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-black/40 p-6 rounded-lg border border-purple-500/20">
                                <div className="text-3xl mb-3">💻</div>
                                <h3 className="text-xl font-bold text-white mb-2">Instant Coding Help</h3>
                                <p className="text-gray-400 text-sm">
                                    Stuck on a bug? Paste your code and get an instant fix with explanation. No more waiting on Stack Overflow.
                                </p>
                            </div>
                            <div className="bg-black/40 p-6 rounded-lg border border-purple-500/20">
                                <div className="text-3xl mb-3">🚀</div>
                                <h3 className="text-xl font-bold text-white mb-2">Career Roadmap</h3>
                                <p className="text-gray-400 text-sm">
                                    Ask "How do I become a Full Stack Developer?" and get a personalized, step-by-step learning path.
                                </p>
                            </div>
                            <div className="bg-black/40 p-6 rounded-lg border border-purple-500/20">
                                <div className="text-3xl mb-3">🧠</div>
                                <h3 className="text-xl font-bold text-white mb-2">Project Ideas</h3>
                                <p className="text-gray-400 text-sm">
                                    Need a hackathon idea? The AI generates unique, winning project concepts tailored to your skills.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Why Us Section */}
                    <div>
                        <h2 className="text-4xl font-bold text-cyan-400 dark:text-cyan-400 light:text-blue-600 mb-8 text-center">
                            ⚡ WHY CHOOSE TECHNEXUS?
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            {/* Feature 1 */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="bg-gray-900/50 dark:bg-gray-900/50 light:bg-white p-6 rounded-xl border border-gray-800 dark:border-gray-800 light:border-gray-200"
                            >
                                <div className="text-4xl mb-4">🎯</div>
                                <h3 className="text-xl font-bold text-cyan-400 dark:text-cyan-400 light:text-blue-600 mb-3">
                                    Everything in One Place
                                </h3>
                                <p className="text-gray-400 dark:text-gray-400 light:text-gray-600">
                                    Stop visiting 10+ websites. Get hackathons, tech news, resources, and AI help all in one platform. Save time, stay organized.
                                </p>
                            </motion.div>

                            {/* Feature 2 */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="bg-gray-900/50 dark:bg-gray-900/50 light:bg-white p-6 rounded-xl border border-gray-800 dark:border-gray-800 light:border-gray-200"
                            >
                                <div className="text-4xl mb-4">🇮🇳</div>
                                <h3 className="text-xl font-bold text-cyan-400 dark:text-cyan-400 light:text-blue-600 mb-3">
                                    India-Focused Content
                                </h3>
                                <p className="text-gray-400 dark:text-gray-400 light:text-gray-600">
                                    Real hackathons from Unstop, opportunities for Indian students, prizes in ₹. Built by students, for students.
                                </p>
                            </motion.div>

                            {/* Feature 3 */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="bg-gray-900/50 dark:bg-gray-900/50 light:bg-white p-6 rounded-xl border border-gray-800 dark:border-gray-800 light:border-gray-200"
                            >
                                <div className="text-4xl mb-4">🔄</div>
                                <h3 className="text-xl font-bold text-cyan-400 dark:text-cyan-400 light:text-blue-600 mb-3">
                                    Daily Auto-Updates
                                </h3>
                                <p className="text-gray-400 dark:text-gray-400 light:text-gray-600">
                                    Fresh hackathons and tech news every 24 hours. Never miss an opportunity. Always stay updated with the latest trends.
                                </p>
                            </motion.div>

                            {/* Feature 4 */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="bg-gray-900/50 dark:bg-gray-900/50 light:bg-white p-6 rounded-xl border border-gray-800 dark:border-gray-800 light:border-gray-200"
                            >
                                <div className="text-4xl mb-4">🤖</div>
                                <h3 className="text-xl font-bold text-cyan-400 dark:text-cyan-400 light:text-blue-600 mb-3">
                                    AI-Powered Assistant
                                </h3>
                                <p className="text-gray-400 dark:text-gray-400 light:text-gray-600">
                                    Get instant coding help, career advice, and tech guidance from our AI assistant. Available 24/7 to support your learning journey.
                                </p>
                            </motion.div>

                            {/* Feature 5 */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="bg-gray-900/50 dark:bg-gray-900/50 light:bg-white p-6 rounded-xl border border-gray-800 dark:border-gray-800 light:border-gray-200"
                            >
                                <div className="text-4xl mb-4">🚀</div>
                                <h3 className="text-xl font-bold text-cyan-400 dark:text-cyan-400 light:text-blue-600 mb-3">
                                    Built by Students
                                </h3>
                                <p className="text-gray-400 dark:text-gray-400 light:text-gray-600">
                                    We understand student problems because we face them too. Every feature is designed to solve real student challenges.
                                </p>
                            </motion.div>
                        </div>

                        {/* Call to Action */}
                        <div className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 p-8 rounded-xl border border-cyan-500/50 text-center">
                            <h3 className="text-2xl font-bold text-cyan-400 dark:text-cyan-400 light:text-blue-600 mb-4">
                                Join Thousands of Tech Students
                            </h3>
                            <p className="text-gray-300 dark:text-gray-300 light:text-gray-700 text-lg mb-6">
                                Stop wasting time on multiple websites. Get everything you need in one place.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <div className="bg-gray-800 dark:bg-gray-800 light:bg-gray-100 px-6 py-3 rounded-lg">
                                    <div className="text-cyan-400 font-bold text-2xl">1000+</div>
                                    <div className="text-gray-400 text-sm">Hackathons Listed</div>
                                </div>
                                <div className="bg-gray-800 dark:bg-gray-800 light:bg-gray-100 px-6 py-3 rounded-lg">
                                    <div className="text-cyan-400 font-bold text-2xl">Daily</div>
                                    <div className="text-gray-400 text-sm">Fresh Updates</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default About;
