import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import CreateGroupModal from './CreateGroupModal';

const GroupsManager = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const { user, token } = useAuth();
    const { isDarkMode } = useTheme();

    useEffect(() => {
        if (token && user) {
            fetchGroups();
        } else {
            setLoading(false);
        }
    }, [token, user]);

    const fetchGroups = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await fetch(`${API_URL}/api/groups`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setGroups(data);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching groups:', error);
            setLoading(false);
        }
    };

    const handleLeaveGroup = async (groupId) => {
        if (!window.confirm('Are you sure you want to leave this group?')) return;

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await fetch(`${API_URL}/api/groups/${groupId}/leave`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchGroups();
                alert('Left group successfully');
            }
        } catch (error) {
            console.error('Error leaving group:', error);
            alert('Failed to leave group');
        }
    };

    const handleDeleteGroup = async (groupId) => {
        if (!window.confirm('Are you sure you want to delete this group? This cannot be undone.')) return;

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await fetch(`${API_URL}/api/groups/${groupId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchGroups();
                alert('Group deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting group:', error);
            alert('Failed to delete group');
        }
    };

    if (!token || !user) {
        return (
            <div className={`flex flex-col items-center justify-center h-[600px] rounded-xl ${isDarkMode ? 'bg-gray-900/80 text-gray-400' : 'bg-white text-gray-500'}`}>
                <p className="mb-4">Please login to manage groups</p>
                <a href="/login" className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/30">
                    Login
                </a>
            </div>
        );
    }

    return (
        <div className={`rounded-xl shadow-2xl overflow-hidden border ${isDarkMode ? 'bg-gray-900/80 border-gray-700/50' : 'bg-white border-gray-200'}`}>
            {/* Header */}
            <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700/50 bg-gray-800/60' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex justify-between items-center">
                    <h3 className={`font-bold text-2xl ${isDarkMode ? 'text-cyan-400' : 'text-gray-800'}`}>
                        My Groups
                    </h3>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all font-medium shadow-lg shadow-cyan-500/30"
                    >
                        + Create Group
                    </button>
                </div>
            </div>

            {/* Groups List */}
            <div className="p-6">
                {loading ? (
                    <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Loading groups...
                    </div>
                ) : groups.length === 0 ? (
                    <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <p className="mb-4">You haven't joined any groups yet</p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/30"
                        >
                            Create Your First Group
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {groups.map((group) => (
                            <div
                                key={group._id}
                                className={`p-6 rounded-xl border transition-all ${isDarkMode
                                    ? 'bg-gray-800/80 border-gray-700/50 hover:border-cyan-500/50'
                                    : 'bg-gray-50 border-gray-200 hover:border-cyan-500'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 className={`font-bold text-xl mb-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                            {group.name}
                                        </h4>
                                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {group.description || 'No description'}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${group.type === 'squad' ? 'bg-purple-500/20 text-purple-400' :
                                        group.type === 'team' ? 'bg-blue-500/20 text-blue-400' :
                                            'bg-green-500/20 text-green-400'
                                        }`}>
                                        {group.type}
                                    </span>
                                </div>

                                <div className="mb-4">
                                    <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        <span className="font-medium">Creator:</span> {group.creator?.name || 'Unknown'}
                                    </p>
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        <span className="font-medium">Members:</span> {group.members?.length || 0}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setSelectedGroup(group)}
                                        className="flex-1 px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded-lg hover:bg-cyan-500/30 transition-colors text-cyan-400 font-medium text-sm"
                                    >
                                        View Details
                                    </button>
                                    {group.creator?._id === user.id ? (
                                        <button
                                            onClick={() => handleDeleteGroup(group._id)}
                                            className="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg hover:bg-red-500/30 transition-colors text-red-400 font-medium text-sm"
                                        >
                                            Delete
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleLeaveGroup(group._id)}
                                            className="px-4 py-2 bg-orange-500/20 border border-orange-500/50 rounded-lg hover:bg-orange-500/30 transition-colors text-orange-400 font-medium text-sm"
                                        >
                                            Leave
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Group Details Modal */}
            {selectedGroup && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className={`max-w-2xl w-full rounded-xl shadow-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div className="flex justify-between items-center">
                                <h3 className={`font-bold text-2xl ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                    {selectedGroup.name}
                                </h3>
                                <button
                                    onClick={() => setSelectedGroup(null)}
                                    className={`text-2xl ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {selectedGroup.description || 'No description'}
                            </p>
                            <h4 className={`font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                Members ({selectedGroup.members?.length || 0})
                            </h4>
                            <div className="space-y-2">
                                {selectedGroup.members?.map((member) => (
                                    <div
                                        key={member._id}
                                        className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}
                                    >
                                        <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                            {member.name}
                                            {member._id === selectedGroup.creator?._id && (
                                                <span className="ml-2 text-xs text-cyan-400">(Creator)</span>
                                            )}
                                        </p>
                                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {member.email}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Group Modal */}
            <CreateGroupModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={() => {
                    setShowCreateModal(false);
                    fetchGroups();
                }}
            />
        </div>
    );
};

export default GroupsManager;
