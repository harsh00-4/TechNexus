import React, { useState } from 'react';

const AIChat = () => {
    const [messages, setMessages] = useState([
        { sender: 'ai', text: 'System Online. How can I assist you today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        const newMessages = [...messages, { sender: 'user', text: userMessage }];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await fetch(`${API_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage })
            });

            if (!res.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await res.json();
            setMessages([...newMessages, { sender: 'ai', text: data.response }]);
        } catch (err) {
            console.error("Chat error", err);
            setMessages([...newMessages, {
                sender: 'ai',
                text: 'Error: Unable to connect to AI service. Please check if the backend server is running.'
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black pt-24 px-6 text-white flex flex-col items-center">
            <div className="w-full max-w-4xl h-[600px] bg-gray-900/50 border border-gray-800 rounded-lg flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-gray-800 p-4 border-b border-gray-700 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="font-mono text-cyan-400">AI_ASSISTANT_V1.0</span>
                    {loading && <span className="text-xs text-gray-500 ml-auto">Processing...</span>}
                </div>

                {/* Messages */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-4 rounded-lg ${msg.sender === 'user' ? 'bg-cyan-900/30 border border-cyan-700 text-cyan-100' : 'bg-gray-800 border border-gray-700 text-gray-300'}`}>
                                <div className="text-xs opacity-50 mb-1 uppercase">{msg.sender}</div>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input */}
                <div className="p-4 bg-gray-800 border-t border-gray-700 flex gap-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !loading && sendMessage()}
                        placeholder="Enter command..."
                        disabled={loading}
                        className="flex-1 bg-black border border-gray-600 rounded p-3 text-white focus:outline-none focus:border-cyan-500 font-mono disabled:opacity-50"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={loading}
                        className="px-6 bg-cyan-700 hover:bg-cyan-600 text-white font-bold rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'SENDING...' : 'SEND'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIChat;
