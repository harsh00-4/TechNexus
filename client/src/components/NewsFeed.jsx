import React, { useEffect, useState } from 'react';
import PublishNewsModal from './PublishNewsModal';

const NewsFeed = () => {
    const [news, setNews] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [showPublishModal, setShowPublishModal] = useState(false);

    const fetchNews = async (forceRefresh = false) => {
        try {
            setLoading(true);
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const url = forceRefresh ? `${API_URL}/api/news?refresh=true` : `${API_URL}/api/news`;
            const response = await fetch(url);
            const data = await response.json();
            setNews(data);
        } catch (error) {
            console.error('Error fetching news:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchNews(true);
        setRefreshing(false);
    };

    const filteredNews = news.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-black pt-24 px-4 md:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-3xl md:text-4xl font-bold text-white text-center flex-1">📰 TECH NEWS</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowPublishModal(true)}
                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-500 hover:to-pink-500 transition-colors text-white font-medium flex items-center gap-2"
                        >
                            <span>✍️</span>
                            Publish
                        </button>
                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded-lg hover:bg-cyan-500/30 transition-colors text-cyan-400 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <span className={refreshing ? 'animate-spin' : ''}>🔄</span>
                            {refreshing ? 'Refreshing...' : 'Refresh AI'}
                        </button>
                    </div>
                </div>
                <p className="text-cyan-400 text-center mb-8">AI-powered latest updates from the tech world</p>

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
                    {filteredNews.length > 0 ? filteredNews.map((item, index) => (
                        <div
                            key={item.id || index}
                            className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-cyan-500 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
                        >
                            <h4 className="text-xl font-bold mb-3 text-white line-clamp-2">{item.title}</h4>
                            <p className="text-gray-400 mb-4 line-clamp-3">{item.summary}</p>

                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm text-cyan-600">{item.date}</span>
                                    {item.verified && (
                                        <span className="text-[10px] bg-cyan-900/30 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/20">
                                            ✅ Verified
                                        </span>
                                    )}
                                    {item.userSubmitted && (
                                        <span className="text-[10px] bg-purple-900/30 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/20">
                                            👤 By {item.authorName}
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

                <PublishNewsModal
                    isOpen={showPublishModal}
                    onClose={() => setShowPublishModal(false)}
                    onSuccess={() => fetchNews(false)}
                />
            </div>
        </div>
    );
};

export default NewsFeed;
