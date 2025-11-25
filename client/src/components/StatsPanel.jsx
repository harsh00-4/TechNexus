import React from 'react';

const StatsPanel = () => {
    const stats = [
        { label: "Problems Posted", value: "24", icon: "📝", color: "cyan" },
        { label: "Total Votes", value: "156", icon: "⬆️", color: "green" },
        { label: "AI Chats", value: "89", icon: "🤖", color: "purple" },
        { label: "Active Users", value: "342", icon: "👥", color: "blue" }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, idx) => (
                <div
                    key={idx}
                    className="bg-gray-900/50 dark:bg-gray-900/50 light:bg-white border border-gray-800 dark:border-gray-800 light:border-gray-200 p-6 rounded-xl text-center hover:border-cyan-500 dark:hover:border-cyan-500 light:hover:border-blue-600 transition-colors"
                >
                    <div className="text-4xl mb-2">{stat.icon}</div>
                    <div className={`text-3xl font-bold mb-1 text-${stat.color}-400 dark:text-${stat.color}-400 light:text-${stat.color}-600`}>
                        {stat.value}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-500 light:text-gray-600">{stat.label}</div>
                </div>
            ))}
        </div>
    );
};

export default StatsPanel;
