import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const CreateGroupModal = ({ isOpen, onClose, onSuccess }) => {
    const [groupName, setGroupName] = useState('');
    const [description, setDescription] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();

    useEffect(() => {
        if (searchQuery.length >= 2) {
            searchUsers();
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);

    const searchUsers = async () => {
        if (!token) return;

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await axios.get(`${API_URL}/api/users/search?query=${searchQuery}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.data.success) {
                setSearchResults(response.data.users);
            }
        } catch (error) {
            console.error('Error searching users:', error);
        }
    };

    const toggleMember = (user) => {
        if (selectedMembers.find(m => m._id === user._id)) {
            setSelectedMembers(selectedMembers.filter(m => m._id !== user._id));
        } else {
            setSelectedMembers([...selectedMembers, user]);
        }
    };

    const handleCreateGroup = async () => {
        if (!groupName.trim()) {
            alert('Please enter a group name');
            return;
        }

        if (!token) {
            alert('Please login to create a group');
            return;
        }

        setLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await axios.post(`${API_URL}/api/groups`, {
                name: groupName,
                description,
                type: 'personal',
                memberIds: selectedMembers.map(m => m._id)
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                if (onSuccess) {
                    onSuccess(response.data.group);
                }
                onClose();
                setGroupName('');
                setDescription('');
                setSelectedMembers([]);
                alert('Group created successfully!');
            }
        } catch (error) {
            console.error('Error creating group:', error);
            console.error('Error response:', error.response);
            console.error('Error data:', error.response?.data);

            const errorMessage = error.response?.data?.message || 'Failed to create group. Please try again.';
            alert(errorMessage);
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-cyan-400">Create New Group</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-300 mb-2">Group Name *</label>
                        <input
                            type="text"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                            placeholder="Enter group name"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                            placeholder="What's this group about?"
                            rows="2"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2">Add Members</label>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                            placeholder="Search users by name or email"
                        />
                    </div>

                    {searchResults.length > 0 && (
                        <div className="max-h-40 overflow-y-auto space-y-2">
                            {searchResults.map(user => (
                                <div
                                    key={user._id}
                                    onClick={() => toggleMember(user)}
                                    className={`p-2 rounded-lg cursor-pointer transition-colors ${selectedMembers.find(m => m._id === user._id)
                                        ? 'bg-cyan-500/20 border border-cyan-500'
                                        : 'bg-gray-800 border border-gray-700 hover:border-gray-600'
                                        }`}
                                >
                                    <div className="text-white font-medium">{user.name}</div>
                                    <div className="text-gray-400 text-sm">{user.email}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {selectedMembers.length > 0 && (
                        <div>
                            <label className="block text-gray-300 mb-2">Selected Members ({selectedMembers.length})</label>
                            <div className="flex flex-wrap gap-2">
                                {selectedMembers.map(member => (
                                    <span
                                        key={member._id}
                                        className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm flex items-center gap-2"
                                    >
                                        {member.name}
                                        <button
                                            onClick={() => toggleMember(member)}
                                            className="hover:text-white"
                                        >
                                            ✕
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-2 pt-4">
                        <button
                            onClick={handleCreateGroup}
                            disabled={loading || !groupName.trim()}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating...' : 'Create Group'}
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateGroupModal;
