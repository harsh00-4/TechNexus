import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import aiBrainImage from '../assets/ai_brain.png';

const WelcomeDashboard = () => {
    const navigate = useNavigate();
    return (
        <div className="h-screen w-full bg-black flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 opacity-20">
                <img src={aiBrainImage} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:50px_50px]"></div>

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="z-10 text-center"
            >
                <motion.h1
                    className="text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    TECHNEXUS
                </motion.h1>
                <motion.p
                    className="text-2xl text-cyan-400 mb-8 font-semibold tracking-wide"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    One Platform. All Opportunities.
                </motion.p>
                <motion.p
                    className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    The ultimate hub for tech students. Innovate. Collaborate. Dominate.
                </motion.p>

                <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(6,182,212,0.5)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/dashboard')}
                    className="px-8 py-4 bg-cyan-600 text-white rounded-none border border-cyan-400 font-bold tracking-widest hover:bg-cyan-500 transition-all"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                >
                    ENTER SYSTEM
                </motion.button>
            </motion.div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent"></div>
        </div>
    );
};

export default WelcomeDashboard;
