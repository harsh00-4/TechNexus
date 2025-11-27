import React, { useEffect, useState } from 'react';
import PublishHackathonModal from './PublishHackathonModal';

const Hackathons = () => {
    const [hackathons, setHackathons] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [stateFilter, setStateFilter] = useState('all');
    const [cityFilter, setCityFilter] = useState('all');
    const [venueFilter, setVenueFilter] = useState('all');
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [showPublishModal, setShowPublishModal] = useState(false);

    const fetchHackathons = async (forceRefresh = false) => {
        try {
            setLoading(true);
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const url = forceRefresh ? `${API_URL}/api/hackathons?refresh=true` : `${API_URL}/api/hackathons`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setHackathons(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching hackathons:', error);
            setHackathons([]);
            // Don't show alert, just log the error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHackathons();
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchHackathons(true);
        setRefreshing(false);
    };

    const filteredHackathons = hackathons.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesState = stateFilter === 'all' || item.state === stateFilter;
        const matchesCity = cityFilter === 'all' || item.city === cityFilter;
        const matchesVenue = venueFilter === 'all' || item.venueType === venueFilter;

        return matchesSearch && matchesState && matchesCity && matchesVenue;
    });

    const uniqueStates = [...new Set(hackathons.map(h => h.state))].filter(Boolean);
    const uniqueCities = [...new Set(hackathons.map(h => h.city))].filter(Boolean);

    return (
        <div className="min-h-screen bg-black pt-24 px-4 md:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-3xl md:text-4xl font-bold text-white text-center flex-1">🏆 HACKATHONS</h2>
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
                <p className="text-cyan-400 text-center mb-8">AI-powered upcoming competitions and events across India</p>

                {/* Filters */}
                <div className="mb-8 space-y-4">
                    <input
                        type="text"
                        placeholder="Search hackathons..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <select
                            value={stateFilter}
                            onChange={(e) => setStateFilter(e.target.value)}
                            className="px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                        >
                            <option value="all">All States</option>
                            {uniqueStates.map(state => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                        </select>

                        <select
                            value={cityFilter}
                            onChange={(e) => setCityFilter(e.target.value)}
                            className="px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                        >
                            <option value="all">All Cities</option>
                            {uniqueCities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>

                        <select
                            value={venueFilter}
                            onChange={(e) => setVenueFilter(e.target.value)}
                            className="px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                        >
                            <option value="all">All Venues</option>
                            <option value="online">Online</option>
                            <option value="offline">Offline</option>
                            <option value="hybrid">Hybrid</option>
                        </select>
                    </div>
                </div>

                {/* Hackathons Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                        <p className="text-gray-400 mt-4">Loading hackathons...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredHackathons.map((hackathon, index) => (
                            <div
                                key={index}
                                className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-cyan-500 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="text-xl font-bold text-cyan-400 flex-1">{hackathon.name}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${hackathon.venueType === 'online' ? 'bg-green-500/20 text-green-400' :
                                        hackathon.venueType === 'offline' ? 'bg-blue-500/20 text-blue-400' :
                                            'bg-purple-500/20 text-purple-400'
                                        }`}>
                                        {hackathon.venueType?.toUpperCase() || 'TBD'}
                                    </span>
                                </div>

                                <div className="space-y-2 text-sm text-gray-400 mb-4">
                                    <p>📅 <span className="text-white">{hackathon.date || 'Date TBA'}</span></p>
                                    <p>📍 <span className="text-white">{hackathon.city}, {hackathon.state}</span></p>
                                    {hackathon.prize && (
                                        <p>💰 <span className="text-white">{hackathon.prize}</span></p>
                                    )}
                                </div>

                                {hackathon.description && (
                                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">{hackathon.description}</p>
                                )}

                                {hackathon.userSubmitted && (
                                    <div className="mb-3">
                                        <span className="text-xs bg-purple-900/30 text-purple-400 px-2 py-1 rounded-full border border-purple-500/20">
                                            👤 Posted by {hackathon.authorName}
                                        </span>
                                    </div>
                                )}

                                {hackathon.registrationLink && (
                                    <a
                                        href={hackathon.registrationLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block w-full text-center px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors font-semibold"
                                    >
                                        Register Now →
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {!loading && filteredHackathons.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg">No hackathons found matching your filters</p>
                    </div>
                )}

                <PublishHackathonModal
                    isOpen={showPublishModal}
                    onClose={() => setShowPublishModal(false)}
                    onSuccess={() => fetchHackathons(false)}
                />
            </div>
        </div>
    );
};

export default Hackathons;
