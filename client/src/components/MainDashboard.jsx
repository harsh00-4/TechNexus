import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatsPanel from './StatsPanel';
import { motion } from 'framer-motion';
import cyberNetworkImage from '../assets/cyber_network.png';

const MainDashboard = () => {
    const navigate = useNavigate();
    const options = [
        { id: 'news', title: 'Tech News', icon: '📰', desc: 'Latest updates from the tech world.' },
        { id: 'arena', title: 'Problem Arena', icon: '⚔️', desc: 'Drop problems, vote, and solve.' },
        { id: 'chat', title: 'AI Assistant', icon: '🤖', desc: 'Chat with the system AI.' },
        { id: 'hackathons', title: 'Hackathons', icon: '🏆', desc: 'Upcoming events and competitions.' },
    ];

    return (
        <div className="min-h-screen bg-black dark:bg-black light:bg-gray-50 pt-24 px-6 relative">
            {/* Background Image */}
            <div className="fixed inset-0 opacity-10 pointer-events-none">
                <img src={cyberNetworkImage} alt="" className="w-full h-full object-cover" />
            </div>

            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold text-white dark:text-white light:text-gray-900 mb-2 text-center">COMMAND CENTER</h2>
                <p className="text-cyan-400 dark:text-cyan-400 light:text-blue-600 text-center mb-12">Select a module to begin</p>

                <StatsPanel />

                <div className="grid md:grid-cols-2 gap-8">
                    {options.map((option) => (
                        <motion.div
                            key={option.id}
                            whileHover={{ scale: 1.02, backgroundColor: 'rgba(6,182,212,0.1)' }}
                            className="bg-gray-900/50 dark:bg-gray-900/50 light:bg-white border border-gray-800 dark:border-gray-800 light:border-gray-200 p-8 rounded-xl cursor-pointer backdrop-blur-sm hover:border-cyan-500 dark:hover:border-cyan-500 light:hover:border-blue-600 transition-colors"
                            onClick={() => navigate(`/${option.id}`)}
                        >
                            <div className="text-6xl mb-4">{option.icon}</div>
                            <h3 className="text-2xl font-bold text-cyan-400 dark:text-cyan-400 light:text-blue-600 mb-2">{option.title}</h3>
                            <p className="text-gray-400 dark:text-gray-400 light:text-gray-600">{option.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MainDashboard;
