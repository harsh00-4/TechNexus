import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ChatBox from './ChatBox';
import CreateGroupModal from './CreateGroupModal';
import axios from 'axios';

const CommunicationHub = () => {
    const [activeTab, setActiveTab] = useState('squad');
    const [groups, setGroups] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [showNewMessage, setShowNewMessage] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const { user } = useAuth();
    const { isDarkMode } = useTheme();

    useEffect(() => {
        if (user) {
            fetchGroups();
        }
    }, [user]);

    useEffect(() => {
        if (searchQuery.length >= 2 && showNewMessage) {
            searchUsers();
        } else {
            setSearchResults([]);
        }
    }, [searchQuery, showNewMessage]);

    const fetchGroups = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await axios.get(`${API_URL}/api/groups`);
            if (response.data.success) {
                setGroups(response.data.groups);
            }
        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    };

    const searchUsers = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await axios.get(`${API_URL}/api/users/search?query=${searchQuery}`);
            if (response.data.success) {
                setSearchResults(response.data.users);
            }
        } catch (error) {
            console.error('Error searching users:', error);
        }
    };

    const handleGroupCreated = (newGroup) => {
        setGroups([newGroup, ...groups]);
        setSelectedChat({ type: 'group', data: newGroup });
        setActiveTab('team');
    };

    const handleStartPersonalChat = (user) => {
        setSelectedChat({ type: 'personal', data: user });
        setActiveTab('personal');
        setShowNewMessage(false);
        setSearchQuery('');
    };

    const renderChatList = () => {
        if (activeTab === 'squad') {
            return (
                <div className="text-center py-8 text-gray-400">
                    <p>Squad chat coming soon!</p>
                    <p className="text-sm mt-2">This will be a public chat for all users</p>
                </div>
            );
        }

        if (activeTab === 'team') {
            return (
                <div className="space-y-2">
                    <button
                        onClick={() => setShowCreateGroup(true)}
                        className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all font-medium"
                    >
                        + Create New Group
                    </button>

                    {groups.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            <p>No groups yet</p>
                            <p className="text-sm mt-2">Create a group to start chatting</p>
                        </div>
                    ) : (
                        groups.map(group => (
                            <div
                                key={group._id}
                                onClick={() => setSelectedChat({ type: 'group', data: group })}
                                className={`p-4 rounded-lg cursor-pointer transition-all ${selectedChat?.type === 'group' && selectedChat?.data._id === group._id
                                        ? 'bg-cyan-500/20 border border-cyan-500'
                                        : isDarkMode
                                            ? 'bg-gray-800/50 border border-gray-700 hover:border-cyan-500/50'
                                            : 'bg-white border border-gray-200 hover:border-cyan-500/50'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
                                        {group.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {group.name}
                                        </div>
                                        <div className="text-sm text-gray-400">
                                            {group.members.length} members
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            );
        }

        if (activeTab === 'personal') {
            return (
                <div className="space-y-2">
                    <button
                        onClick={() => setShowNewMessage(!showNewMessage)}
                        className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all font-medium"
                    >
                        + New Message
                    </button>

                    {showNewMessage && (
                        <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search users..."
                                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                            />
                            {searchResults.length > 0 && (
                                <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                                    {searchResults.map(user => (
                                        <div
                                            key={user._id}
                                            onClick={() => handleStartPersonalChat(user)}
                                            className="p-3 bg-gray-900 border border-gray-700 rounded-lg hover:border-cyan-500 cursor-pointer transition-colors"
                                        >
                                            <div className="text-white font-medium">{user.name}</div>
                                            <div className="text-gray-400 text-sm">{user.email}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {!selectedChat && !showNewMessage && (
                        <div className="text-center py-8 text-gray-400">
                            <p>No conversations yet</p>
                            <p className="text-sm mt-2">Start a new message to begin chatting</p>
                        </div>
                    )}
                </div>
            );
        }
    };

    return (
        <div className={`min-h-screen pt-24 px-4 md:px-6 lg:px-8 ${isDarkMode ? 'bg-black' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto">
                <h2 className={`text-3xl md:text-4xl font-bold mb-2 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    💬 Communication Hub
                </h2>
                <p className="text-cyan-400 text-center mb-8">Connect with your peers</p>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 flex-wrap justify-center">
                    <button
                        onClick={() => setActiveTab('squad')}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'squad'
                                ? 'bg-cyan-500 text-white'
                                : isDarkMode
                                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        Squad
                    </button>
                    <button
                        onClick={() => setActiveTab('team')}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'team'
                                ? 'bg-cyan-500 text-white'
                                : isDarkMode
                                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        Team
                    </button>
                    <button
                        onClick={() => setActiveTab('personal')}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'personal'
                                ? 'bg-cyan-500 text-white'
                                : isDarkMode
                                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        Personal
                    </button>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sidebar - Chat List */}
                    <div className={`lg:col-span-1 p-4 rounded-xl border ${isDarkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200'
                        }`}>
                        {renderChatList()}
                    </div>

                    {/* Chat Area */}
                    <div className="lg:col-span-2">
                        {selectedChat ? (
                            <ChatBox
                                type={selectedChat.type}
                                groupId={selectedChat.type === 'group' ? selectedChat.data._id : null}
                                recipientId={selectedChat.type === 'personal' ? selectedChat.data._id : null}
                                chatName={selectedChat.data.name}
                            />
                        ) : (
                            <div className={`h-[600px] rounded-xl border flex items-center justify-center ${isDarkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200'
                                }`}>
                                <div className="text-center text-gray-400">
                                    <p className="text-xl mb-2">Select a chat to start messaging</p>
                                    <p className="text-sm">Choose from Squad, Team, or Personal chats</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <CreateGroupModal
                isOpen={showCreateGroup}
                onClose={() => setShowCreateGroup(false)}
                onGroupCreated={handleGroupCreated}
            />
        </div>
    );
};

export default CommunicationHub;
