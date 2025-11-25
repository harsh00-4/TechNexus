import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatsPanel from './StatsPanel';
import { motion } from 'framer-motion';
import cyberNetworkImage from '../assets/cyber_network.png';

const MainDashboard = () => {
    const navigate = useNavigate();
    const options = [
        { id: 'news', title: 'Tech News', icon: '📰', desc: 'Latest updates from the tech world.' },
        { id: 'hackathons', title: 'Hackathons', icon: '🏆', desc: 'Upcoming events and competitions.' },
        { id: 'arena', title: 'Problem Arena', icon: '⚔️', desc: 'Drop problems, vote, and solve.' },
        { id: 'chat', title: 'AI Assistant', icon: '🤖', desc: 'Chat with the system AI.' },
        { id: 'resources', title: 'Resources', icon: '📚', desc: 'Learning materials and guides.' },
        { id: 'about', title: 'Why Us?', icon: '⭐', desc: 'Discover what makes us unique.' },
    ];

    return (
        <div className="min-h-screen bg-black pt-24 px-4 md:px-6 lg:px-8 relative">
            {/* Background Image */}
            <div className="fixed inset-0 opacity-10 pointer-events-none">
                <img src={cyberNetworkImage} alt="" className="w-full h-full object-cover" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 text-center">COMMAND CENTER</h2>
                <p className="text-cyan-400 text-center mb-12">Select a module to begin</p>

                <StatsPanel />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {options.map((option) => (
                        <motion.div
                            key={option.id}
                            whileHover={{ scale: 1.02, backgroundColor: 'rgba(6,182,212,0.1)' }}
                            className="bg-gray-900/50 border border-gray-800 p-6 md:p-8 rounded-xl cursor-pointer backdrop-blur-sm hover:border-cyan-500 transition-colors"
                            onClick={() => navigate(`/${option.id}`)}
                        >
                            <div className="text-5xl md:text-6xl mb-4">{option.icon}</div>
                            <h3 className="text-xl md:text-2xl font-bold text-cyan-400 mb-2">{option.title}</h3>
                            <p className="text-sm md:text-base text-gray-400">{option.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MainDashboard;
