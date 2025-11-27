import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatsPanel from './StatsPanel';
import { motion } from 'framer-motion';
import cyberNetworkImage from '../assets/cyber_network.png';

const MainDashboard = () => {
    const navigate = useNavigate();
    const options = [
        { id: 'news', title: 'Tech News', icon: '📰', desc: 'Latest updates from the tech world.', gradient: 'from-blue-500 to-cyan-500' },
        { id: 'hackathons', title: 'Hackathons', icon: '🏆', desc: 'Upcoming events and competitions.', gradient: 'from-purple-500 to-pink-500' },
        { id: 'arena', title: 'Problem Arena', icon: '⚔️', desc: 'Drop problems, vote, and solve.', gradient: 'from-orange-500 to-red-500' },
        { id: 'groups', title: 'Groups', icon: '👥', desc: 'Create and manage your groups.', gradient: 'from-indigo-500 to-purple-500' },
        { id: 'resources', title: 'Resources', icon: '📚', desc: 'Learning materials and guides.', gradient: 'from-green-500 to-emerald-500' },
        { id: 'about', title: 'Why Us?', icon: '⭐', desc: 'Discover what makes us unique.', gradient: 'from-yellow-500 to-amber-500' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-24 px-4 md:px-6 lg:px-8 relative pb-12">
            {/* Background Image */}
            <div className="fixed inset-0 opacity-5 pointer-events-none">
                <img src={cyberNetworkImage} alt="" className="w-full h-full object-cover" />
            </div>

            {/* Animated Background Gradient */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-3">
                        COMMAND CENTER
                    </h2>
                    <p className="text-cyan-400/80 text-lg">Select a module to begin your journey</p>
                </motion.div>

                <StatsPanel />

                {/* Main Navigation Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {options.map((option, index) => (
                        <motion.div
                            key={option.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 p-8 rounded-2xl cursor-pointer backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/20"
                            onClick={() => navigate(`/${option.id}`)}
                        >
                            {/* Gradient Overlay on Hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

                            {/* Content */}
                            <div className="relative z-10">
                                <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                                    {option.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                                    {option.title}
                                </h3>
                                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                                    {option.desc}
                                </p>
                            </div>

                            {/* Corner Accent */}
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MainDashboard;
