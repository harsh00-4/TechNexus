import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Resources = () => {
    const [activeCategory, setActiveCategory] = useState('tutorials');

    const resources = {
        tutorials: [
            { title: 'React Complete Guide', url: 'https://react.dev/learn', description: 'Official React documentation and tutorials', level: 'Beginner' },
            { title: 'Node.js Full Course', url: 'https://nodejs.dev/learn', description: 'Learn backend development with Node.js', level: 'Intermediate' },
            { title: 'Python for Beginners', url: 'https://www.python.org/about/gettingstarted/', description: 'Start your Python journey', level: 'Beginner' },
            { title: 'Full Stack Open', url: 'https://fullstackopen.com/', description: 'Free full-stack course by University of Helsinki', level: 'Advanced' },
            { title: 'JavaScript.info', url: 'https://javascript.info/', description: 'Modern JavaScript tutorial', level: 'All Levels' },
            { title: 'freeCodeCamp', url: 'https://www.freecodecamp.org/', description: 'Learn to code for free', level: 'All Levels' }
        ],
        interview: [
            { title: 'LeetCode', url: 'https://leetcode.com/', description: 'Practice coding interview questions', level: 'All Levels' },
            { title: 'NeetCode', url: 'https://neetcode.io/', description: 'Curated list of 150 LeetCode problems', level: 'Intermediate' },
            { title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', description: 'Learn system design fundamentals', level: 'Advanced' },
            { title: 'Tech Interview Handbook', url: 'https://www.techinterviewhandbook.org/', description: 'Complete interview preparation guide', level: 'All Levels' },
            { title: 'Behavioral Interview Guide', url: 'https://www.themuse.com/advice/behavioral-interview-questions-answers-examples', description: 'Master behavioral questions', level: 'Beginner' }
        ],
        resume: [
            { title: 'Resume.io Templates', url: 'https://resume.io/resume-templates', description: 'Professional resume templates', level: 'All Levels' },
            { title: 'Tech Resume Guide', url: 'https://www.careercup.com/resume', description: 'How to write a tech resume', level: 'Beginner' },
            { title: 'LinkedIn Optimization', url: 'https://www.linkedin.com/help/linkedin/answer/a549047', description: 'Optimize your LinkedIn profile', level: 'All Levels' },
            { title: 'Portfolio Examples', url: 'https://github.com/topics/portfolio', description: 'Inspiring developer portfolios', level: 'Intermediate' },
            { title: 'GitHub Profile README', url: 'https://github.com/abhisheknaiidu/awesome-github-profile-readme', description: 'Make your GitHub stand out', level: 'Beginner' }
        ],
        projects: [
            { title: 'Build a Chat App', url: 'https://socket.io/get-started/chat', description: 'Real-time chat with Socket.io', level: 'Intermediate' },
            { title: 'E-Commerce Platform', url: 'https://www.youtube.com/results?search_query=mern+ecommerce', description: 'Full-stack MERN project', level: 'Advanced' },
            { title: 'Weather App', url: 'https://openweathermap.org/api', description: 'Build with API integration', level: 'Beginner' },
            { title: 'Task Manager', url: 'https://www.youtube.com/results?search_query=react+task+manager', description: 'CRUD operations practice', level: 'Beginner' },
            { title: 'Social Media Clone', url: 'https://www.youtube.com/results?search_query=social+media+clone', description: 'Advanced full-stack project', level: 'Advanced' },
            { title: 'Portfolio Website', url: 'https://github.com/topics/portfolio-website', description: 'Showcase your work', level: 'Beginner' }
        ]
    };

    const categories = [
        { id: 'tutorials', name: '📚 Coding Tutorials', icon: '💻' },
        { id: 'interview', name: '🎯 Interview Prep', icon: '💼' },
        { id: 'resume', name: '📄 Resume & Profile', icon: '✨' },
        { id: 'projects', name: '🚀 Project Ideas', icon: '🛠️' }
    ];

    const getLevelColor = (level) => {
        switch (level) {
            case 'Beginner': return 'bg-green-900 text-green-300';
            case 'Intermediate': return 'bg-yellow-900 text-yellow-300';
            case 'Advanced': return 'bg-red-900 text-red-300';
            default: return 'bg-blue-900 text-blue-300';
        }
    };

    return (
        <div className="min-h-screen bg-black dark:bg-black light:bg-gray-50 pt-24 px-6 text-white dark:text-white light:text-gray-900">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-4xl font-bold text-cyan-400 dark:text-cyan-400 light:text-blue-600 mb-4 text-center">
                        📚 LEARNING RESOURCES
                    </h2>
                    <p className="text-gray-400 dark:text-gray-400 light:text-gray-600 text-center mb-8">
                        Curated resources to help you learn, grow, and succeed in tech
                    </p>

                    {/* Category Tabs */}
                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        {categories.map((category) => (
                            <motion.button
                                key={category.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveCategory(category.id)}
                                className={`px-6 py-3 rounded-lg font-bold transition-all ${activeCategory === category.id
                                        ? 'bg-cyan-700 text-white dark:bg-cyan-700 light:bg-blue-600'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 dark:bg-gray-800 dark:text-gray-300 light:bg-gray-200 light:text-gray-700'
                                    }`}
                            >
                                {category.icon} {category.name}
                            </motion.button>
                        ))}
                    </div>

                    {/* Resources Grid */}
                    <motion.div
                        key={activeCategory}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {resources[activeCategory].map((resource, index) => (
                            <motion.a
                                key={index}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gray-900/50 dark:bg-gray-900/50 light:bg-white p-6 rounded-xl border border-gray-800 dark:border-gray-800 light:border-gray-200 hover:border-cyan-500 transition-all group"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-lg font-bold text-white dark:text-white light:text-gray-900 group-hover:text-cyan-400 transition-colors">
                                        {resource.title}
                                    </h3>
                                    <span className={`text-xs px-2 py-1 rounded ${getLevelColor(resource.level)}`}>
                                        {resource.level}
                                    </span>
                                </div>
                                <p className="text-gray-400 dark:text-gray-400 light:text-gray-600 text-sm mb-4">
                                    {resource.description}
                                </p>
                                <div className="flex items-center text-cyan-400 dark:text-cyan-400 light:text-blue-600 text-sm font-bold">
                                    Visit Resource →
                                </div>
                            </motion.a>
                        ))}
                    </motion.div>

                    {/* Tips Section */}
                    <div className="mt-12 bg-gradient-to-r from-cyan-900/20 to-purple-900/20 p-6 rounded-xl border border-cyan-500/30">
                        <h3 className="text-xl font-bold text-cyan-400 dark:text-cyan-400 light:text-blue-600 mb-4">
                            💡 Pro Tips
                        </h3>
                        <ul className="space-y-2 text-gray-300 dark:text-gray-300 light:text-gray-700">
                            <li>✅ Practice coding daily - consistency is key</li>
                            <li>✅ Build projects to apply what you learn</li>
                            <li>✅ Contribute to open source on GitHub</li>
                            <li>✅ Network with other developers</li>
                            <li>✅ Keep your resume and LinkedIn updated</li>
                        </ul>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Resources;
