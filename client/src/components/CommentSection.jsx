import React, { useState } from 'react';

const CommentSection = ({ problemId }) => {
    const [comments, setComments] = useState([
        { id: 1, author: "Alex", text: "Have you tried using a heap data structure?", time: "2 hours ago" },
        { id: 2, author: "Sarah", text: "Check out Dijkstra's algorithm for similar problems.", time: "5 hours ago" }
    ]);
    const [newComment, setNewComment] = useState('');

    const handleAddComment = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const comment = {
            id: comments.length + 1,
            author: "You",
            text: newComment,
            time: "Just now"
        };

        setComments([comment, ...comments]);
        setNewComment('');
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
                {comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-900/30 dark:bg-gray-900/30 light:bg-gray-100 p-4 rounded-lg border border-gray-800 dark:border-gray-800 light:border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold text-white dark:text-white light:text-gray-900">{comment.author}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-500 light:text-gray-600">{comment.time}</span>
                        </div>
                        <p className="text-gray-300 dark:text-gray-300 light:text-gray-700">{comment.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommentSection;
