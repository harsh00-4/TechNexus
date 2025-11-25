import React, { useEffect, useState } from 'react';

const NewsFeed = () => {
    const [news, setNews] = useState([]);
    const [hackathons, setHackathons] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [stateFilter, setStateFilter] = useState('all');
    const [cityFilter, setCityFilter] = useState('all');
    const [venueFilter, setVenueFilter] = useState('all');

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

        const fetchHackathons = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const response = await fetch(`${API_URL}/api/hackathons`);
                const data = await response.json();
                setHackathons(data);
            } catch (error) {
                console.error('Error fetching hackathons:', error);
            }
        };

        fetchNews();
        fetchHackathons();
    }, []);

    const filteredNews = news.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredHackathons = hackathons.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesState = stateFilter === 'all' || item.state === stateFilter;
        const matchesCity = cityFilter === 'all' || item.city === cityFilter;
        const matchesVenue = venueFilter === 'all' || item.venueType === venueFilter;

        return matchesSearch && matchesState && matchesCity && matchesVenue;
    });

    return (
        <div className="min-h-screen bg-black dark:bg-black light:bg-gray-50 pt-24 px-6 text-white dark:text-white light:text-gray-900">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-cyan-400 dark:text-cyan-400 light:text-blue-600 border-b border-gray-800 dark:border-gray-800 light:border-gray-300 pb-2">
                        TECH NEWS & HACKATHONS
                    </h2>
                    <input
                        type="text"
                        placeholder="🔍 Search news and events..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-4 py-2 bg-gray-900 dark:bg-gray-900 light:bg-white border border-gray-700 dark:border-gray-700 light:border-gray-300 rounded-lg text-white dark:text-white light:text-gray-900 focus:outline-none focus:border-cyan-500 w-80"
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* News Section */}
                    <div>
                        <h3 className="text-2xl font-bold mb-4 text-purple-400 dark:text-purple-400 light:text-purple-600">📰 Latest News</h3>
                        <div className="space-y-4">
                            {filteredNews.length > 0 ? filteredNews.map((item) => (
                                <div key={item.id} className="bg-gray-900/50 dark:bg-gray-900/50 light:bg-white p-6 rounded-lg border border-gray-800 dark:border-gray-800 light:border-gray-200 hover:border-cyan-500 transition-colors">
                                    <h4 className="text-xl font-bold mb-2 text-white dark:text-white light:text-gray-900">{item.title}</h4>
                                    <p className="text-gray-400 dark:text-gray-400 light:text-gray-600 mb-4">{item.summary}</p>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-cyan-600 dark:text-cyan-600 light:text-blue-500">{item.date}</span>
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
                                                Read Article →
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )) : (
                                <p className="text-gray-500">No news found matching "{searchQuery}"</p>
                            )}
                        </div>
                    </div>

                    {/* Hackathons Section */}
                    <div>
                        <h3 className="text-2xl font-bold mb-4 text-green-400 dark:text-green-400 light:text-green-600">🏆 Hackathons</h3>

                        {/* Filters */}
                        <div className="grid grid-cols-1 gap-3 mb-6">
                            <select
                                value={stateFilter}
                                onChange={(e) => setStateFilter(e.target.value)}
                                className="px-4 py-2 bg-gray-800 dark:bg-gray-800 light:bg-gray-100 border border-gray-700 dark:border-gray-700 light:border-gray-300 rounded text-white dark:text-white light:text-gray-900 text-sm"
                            >
                                <option value="all">📍 All States</option>
                                <option value="Karnataka">Karnataka</option>
                                <option value="Maharashtra">Maharashtra</option>
                                <option value="Delhi">Delhi</option>
                                <option value="Tamil Nadu">Tamil Nadu</option>
                                <option value="Telangana">Telangana</option>
                                <option value="Gujarat">Gujarat</option>
                                <option value="Rajasthan">Rajasthan</option>
                                <option value="Uttar Pradesh">Uttar Pradesh</option>
                                <option value="West Bengal">West Bengal</option>
                                <option value="Punjab">Punjab</option>
                                <option value="Haryana">Haryana</option>
                                <option value="Kerala">Kerala</option>
                                <option value="Madhya Pradesh">Madhya Pradesh</option>
                                <option value="Pan India">Pan India (Online)</option>
                            </select>

                            <select
                                value={cityFilter}
                                onChange={(e) => setCityFilter(e.target.value)}
                                className="px-4 py-2 bg-gray-800 dark:bg-gray-800 light:bg-gray-100 border border-gray-700 dark:border-gray-700 light:border-gray-300 rounded text-white dark:text-white light:text-gray-900 text-sm"
                            >
                                <option value="all">🏙️ All Cities</option>
                                <option value="Bangalore">Bangalore</option>
                                <option value="Mumbai">Mumbai</option>
                                <option value="Delhi">Delhi</option>
                                <option value="Hyderabad">Hyderabad</option>
                                <option value="Chennai">Chennai</option>
                                <option value="Pune">Pune</option>
                                <option value="Kolkata">Kolkata</option>
                                <option value="Ahmedabad">Ahmedabad</option>
                                <option value="Jaipur">Jaipur</option>
                                <option value="Lucknow">Lucknow</option>
                                <option value="Chandigarh">Chandigarh</option>
                                <option value="Gurugram">Gurugram</option>
                                <option value="Noida">Noida</option>
                                <option value="Kochi">Kochi</option>
                                <option value="Indore">Indore</option>
                            </select>

                            <select
                                value={venueFilter}
                                onChange={(e) => setVenueFilter(e.target.value)}
                                className="px-4 py-2 bg-gray-800 dark:bg-gray-800 light:bg-gray-100 border border-gray-700 dark:border-gray-700 light:border-gray-300 rounded text-white dark:text-white light:text-gray-900 text-sm"
                            >
                                <option value="all">🎯 All Event Modes</option>
                                <option value="Online">🌐 Online</option>
                                <option value="Offline">📍 Offline</option>
                                <option value="Hybrid">🔄 Hybrid</option>
                            </select>
                        </div>

                        <div className="space-y-4">
                            {filteredHackathons.length > 0 ? filteredHackathons.map((item) => (
                                <div key={item.id} className="bg-gray-900/50 dark:bg-gray-900/50 light:bg-white p-6 rounded-lg border border-gray-800 dark:border-gray-800 light:border-gray-200 hover:border-green-500 transition-colors">
                                    <div className="flex justify-between items-start mb-3">
                                        <h4 className="text-lg font-bold text-white dark:text-white light:text-gray-900 flex-1">{item.name}</h4>
                                        <span className={`inline-block px-3 py-1 rounded text-xs font-bold ml-2 ${item.venueType === 'Online' ? 'bg-blue-900 text-blue-300' :
                                            item.venueType === 'Offline' ? 'bg-orange-900 text-orange-300' :
                                                'bg-purple-900 text-purple-300'
                                            }`}>
                                            {item.venueType === 'Online' ? '🌐 Online' :
                                                item.venueType === 'Offline' ? '📍 Offline' :
                                                    '🔄 Hybrid'}
                                        </span>
                                        {item.verified && (
                                            <span className="inline-block px-2 py-1 rounded text-xs font-bold ml-2 bg-cyan-900/50 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                                                ✅ Verified
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-2 mb-3">
                                        {/* Location */}
                                        <p className="text-gray-400 dark:text-gray-400 light:text-gray-600 text-sm flex items-center gap-2">
                                            <span>📍</span>
                                            {item.venueType === 'Online' ? 'Pan India' : `${item.city}, ${item.state}`}
                                        </p>

                                        {/* Organizer */}
                                        <p className="text-gray-400 dark:text-gray-400 light:text-gray-600 text-sm flex items-center gap-2">
                                            <span>🏢</span>
                                            <span className="font-medium text-cyan-400 dark:text-cyan-400 light:text-blue-600">
                                                {item.date}
                                            </span>
                                        </p>
                                    </div>

                                    {item.prize && (
                                        <p className="text-yellow-400 font-bold text-sm mb-2">💰 Prize: {item.prize}</p>
                                    )}
                                    {item.deadline && (
                                        <p className="text-gray-500 text-xs mb-3">⏰ {item.deadline}</p>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <span className={`inline-block px-3 py-1 rounded text-xs font-bold ${item.status === 'Open' ? 'bg-green-900 text-green-300' : 'bg-blue-900 text-blue-300'}`}>
                                            {item.status}
                                        </span>
                                        {item.url && (
                                            <a
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white font-bold rounded transition-colors text-sm"
                                            >
                                                Register Now →
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )) : (
                                <p className="text-gray-500">No hackathons found with selected filters</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsFeed;
