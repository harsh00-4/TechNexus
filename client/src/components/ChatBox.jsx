import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const ChatBox = ({ type, groupId, recipientId, chatName }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const { user, token } = useAuth();
    const { isDarkMode } = useTheme();
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds
        return () => clearInterval(interval);
    }, [type, groupId, recipientId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async () => {
        if (!token || !user) {
            setLoading(false);
            return;
        }

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            let url = `${API_URL}/api/chat/${type}`;
            const params = new URLSearchParams();
            if (groupId) params.append('groupId', groupId);
            if (recipientId) params.append('recipientId', recipientId);

            if (params.toString()) url += `?${params.toString()}`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setLoading(false);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        if (!token || !user) {
            alert('Please login to send messages');
            return;
        }

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await fetch(`${API_URL}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    content: newMessage,
                    type,
                    groupId,
                    recipient: recipientId
                })
            });

            if (response.ok) {
                setNewMessage('');
                fetchMessages();
            } else {
                alert('Failed to send message. Please try logging in.');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please check your connection.');
        }
    };

    return (
        <div className={`flex flex-col h-[600px] rounded-xl shadow-2xl overflow-hidden border ${isDarkMode ? 'bg-gray-900/80 border-gray-700/50' : 'bg-white border-gray-200'}`}>
            {/* Chat Header */}
            <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700/50 bg-gray-800/60' : 'border-gray-200 bg-gray-50'}`}>
                <h3 className={`font-bold text-lg ${isDarkMode ? 'text-cyan-400' : 'text-gray-800'}`}>
                    {chatName || `${type.charAt(0).toUpperCase() + type.slice(1)} Chat`}
                </h3>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {!token || !user ? (
                    <div className={`text-center flex flex-col items-center justify-center h-full ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <p className="mb-4">Please login to use the chat feature</p>
                        <a href="/login" className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/30">
                            Login
                        </a>
                    </div>
                ) : loading ? (
                    <div className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading messages...</div>
                ) : messages.length === 0 ? (
                    <div className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No messages yet. Start the conversation!</div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg._id}
                            className={`flex ${msg.sender._id === user.id ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[70%] rounded-xl p-3 shadow-lg ${msg.sender._id === user.id
                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                                    : isDarkMode
                                        ? 'bg-gray-800/80 text-white border border-gray-700/50'
                                        : 'bg-gray-200 text-gray-800'
                                    }`}
                            >
                                {msg.sender._id !== user.id && (
                                    <div className="text-xs opacity-75 mb-1">{msg.sender.name}</div>
                                )}
                                <p>{msg.content}</p>
                                <div className="text-xs opacity-75 mt-1 text-right">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={sendMessage} className={`p-4 border-t ${isDarkMode ? 'border-gray-700/50 bg-gray-800/60' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className={`flex-1 p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${isDarkMode
                            ? 'bg-gray-900/50 border-gray-700/50 text-white placeholder-gray-500'
                            : 'bg-white border-gray-300 text-gray-800'
                            }`}
                    />
                    <button
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all font-medium shadow-lg shadow-cyan-500/30"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatBox;
