import React, { useState, useEffect } from 'react';

const CommentSection = ({ problemId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        fetchComments();
    }, [problemId]);

    const fetchComments = () => {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        fetch(`${API_URL}/api/problems/${problemId}/comments`)
            .then(res => res.json())
            .then(data => setComments(data))
            .catch(err => console.error("Failed to fetch comments", err));
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const token = localStorage.getItem('token');

        if (!token) {
            alert("Please login to comment!");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/problems/${problemId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ text: newComment })
            });
            const data = await res.json();

            if (data.success) {
                setComments([data.comment, ...comments]);
                setNewComment('');
            } else {
                alert(data.message || "Failed to post comment");
            }
        } catch (err) {
            console.error("Error posting comment:", err);
        }
    };

    return (
        <div className="mt-6 border-t border-gray-800 dark:border-gray-800 light:border-gray-300 pt-6">
            <h4 className="text-lg font-bold text-cyan-400 dark:text-cyan-400 light:text-blue-600 mb-4">
                💬 Comments ({comments.length})
            </h4>

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="mb-6">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts or solutions..."
                    className="w-full bg-black dark:bg-black light:bg-gray-100 border border-gray-700 dark:border-gray-700 light:border-gray-300 rounded p-3 text-white dark:text-white light:text-gray-900 focus:outline-none focus:border-cyan-500 resize-none h-20"
                />
                <button
                    type="submit"
                    className="mt-2 px-4 py-2 bg-cyan-700 dark:bg-cyan-700 light:bg-blue-600 hover:bg-cyan-600 dark:hover:bg-cyan-600 light:hover:bg-blue-700 text-white font-bold rounded transition-colors text-sm"
                >
                    Post Comment
                </button>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
                {comments.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">No comments yet. Be the first!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment._id} className="bg-gray-900/30 dark:bg-gray-900/30 light:bg-gray-100 p-4 rounded-lg border border-gray-800 dark:border-gray-800 light:border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="font-bold text-white dark:text-white light:text-gray-900">{comment.author}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-500 light:text-gray-600">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-gray-300 dark:text-gray-300 light:text-gray-700">{comment.text}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentSection;
