import React, { useEffect, useState } from 'react';

const NewsFeed = () => {
    const [news, setNews] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const response = await fetch(`${API_URL}/api/news`);
                const data = await response.json();
                setNews(data);
            } catch (error) {
                console.error('Error fetching news:', error);
            }
        };

        fetchNews();
    }, []);

    const filteredNews = news.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-black pt-24 px-4 md:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 text-center">📰 TECH NEWS</h2>
                <p className="text-cyan-400 text-center mb-8">Latest updates from the tech world</p>

                {/* Search */}
                <input
                    type="text"
                    placeholder="🔍 Search news..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 mb-8 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />

                {/* News Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNews.length > 0 ? filteredNews.map((item) => (
                        <div
                            key={item.id}
                            className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-cyan-500 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
                        >
                            <h4 className="text-xl font-bold mb-3 text-white line-clamp-2">{item.title}</h4>
                            <p className="text-gray-400 mb-4 line-clamp-3">{item.summary}</p>

                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-cyan-600">{item.date}</span>
                                    {item.verified && (
                                        <span className="text-[10px] bg-cyan-900/30 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/20">
                                            ✅ Verified
                                        </span>
                                    )}
                                </div>
                                {item.url && (
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-cyan-400 hover:text-cyan-300 underline text-sm"
                                    >
                                        Read →
                                    </a>
                                )}
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full text-center py-20">
                            <p className="text-gray-400 text-lg">No news found matching "{searchQuery}"</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewsFeed;
