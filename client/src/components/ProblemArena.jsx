import React, { useEffect, useState } from 'react';
import CommentSection from './CommentSection';

const ProblemArena = () => {
    const [problems, setProblems] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newProblem, setNewProblem] = useState({ title: '', description: '' });
    const [filter, setFilter] = useState('all'); // all, most-voted, recent

    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = () => {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        fetch(`${API_URL}/api/problems`)
            .then(res => res.json())
            .then(data => setProblems(data))
            .catch(err => console.error("Failed to fetch problems", err));
    };

    const handleVote = (id) => {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        fetch(`${API_URL}/api/vote`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setProblems(problems.map(p => p.id === id ? { ...p, votes: data.votes } : p));
                }
            })
            .catch(err => console.error("Vote failed", err));
    };

    const handleSubmitProblem = (e) => {
        e.preventDefault();
        if (!newProblem.title.trim() || !newProblem.description.trim()) return;

        const problem = {
            id: problems.length + 1,
            title: newProblem.title,
            description: newProblem.description,
            votes: 0
        };

        setProblems([problem, ...problems]);
        setNewProblem({ title: '', description: '' });
        setShowForm(false);
    };

    const getFilteredProblems = () => {
        let sorted = [...problems];
        if (filter === 'most-voted') {
            sorted.sort((a, b) => b.votes - a.votes);
        } else if (filter === 'recent') {
            sorted.reverse(); // Newest first
        }
        return sorted;
    };

    const filteredProblems = getFilteredProblems();

    return (
        <div className="min-h-screen bg-black dark:bg-black light:bg-gray-50 pt-24 px-6 text-white dark:text-white light:text-gray-900">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-red-500 dark:text-red-500 light:text-red-600 border-b border-gray-800 dark:border-gray-800 light:border-gray-300 pb-2">
                        PROBLEM ARENA
                    </h2>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 bg-gray-900 dark:bg-gray-900 light:bg-white border border-gray-700 dark:border-gray-700 light:border-gray-300 rounded-lg text-white dark:text-white light:text-gray-900 focus:outline-none focus:border-cyan-500"
                    >
                        <option value="all">All Problems</option>
                        <option value="most-voted">Most Voted</option>
                        <option value="recent">Most Recent</option>
                    </select>
                </div>

                <div className="space-y-6">
                    {filteredProblems.map((problem) => (
                        <div key={problem.id} className="bg-gray-900/50 dark:bg-gray-900/50 light:bg-white p-6 rounded-lg border border-gray-800 dark:border-gray-800 light:border-gray-200 flex gap-6 items-start">
                            <div className="flex flex-col items-center gap-2">
                                <button
                                    onClick={() => handleVote(problem.id)}
                                    className="text-gray-500 dark:text-gray-500 light:text-gray-400 hover:text-cyan-400 dark:hover:text-cyan-400 light:hover:text-blue-600 transition-colors text-2xl"
                                >
                                    ▲
                                </button>
                                <span className="font-bold text-xl text-cyan-400 dark:text-cyan-400 light:text-blue-600">{problem.votes}</span>
                                <button className="text-gray-500 dark:text-gray-500 light:text-gray-400 hover:text-red-400 transition-colors text-2xl">▼</button>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2 text-white dark:text-white light:text-gray-900">{problem.title}</h3>
                                <p className="text-gray-400 dark:text-gray-400 light:text-gray-600">{problem.description}</p>
                                <CommentSection problemId={problem.id} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Problem Submission Form */}
                {showForm ? (
                    <form onSubmit={handleSubmitProblem} className="mt-8 bg-gray-900/50 dark:bg-gray-900/50 light:bg-white p-6 rounded-lg border border-cyan-500">
                        <h3 className="text-xl font-bold text-cyan-400 dark:text-cyan-400 light:text-blue-600 mb-4">Drop a New Problem</h3>
                        <input
                            type="text"
                            placeholder="Problem Title"
                            value={newProblem.title}
                            onChange={(e) => setNewProblem({ ...newProblem, title: e.target.value })}
                            className="w-full bg-black dark:bg-black light:bg-gray-100 border border-gray-600 dark:border-gray-600 light:border-gray-300 rounded p-3 text-white dark:text-white light:text-gray-900 mb-4 focus:outline-none focus:border-cyan-500"
                        />
                        <textarea
                            placeholder="Describe the problem..."
                            value={newProblem.description}
                            onChange={(e) => setNewProblem({ ...newProblem, description: e.target.value })}
                            className="w-full bg-black dark:bg-black light:bg-gray-100 border border-gray-600 dark:border-gray-600 light:border-gray-300 rounded p-3 text-white dark:text-white light:text-gray-900 mb-4 h-32 focus:outline-none focus:border-cyan-500"
                        />
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-cyan-700 dark:bg-cyan-700 light:bg-blue-600 hover:bg-cyan-600 dark:hover:bg-cyan-600 light:hover:bg-blue-700 text-white font-bold rounded transition-colors"
                            >
                                Submit Problem
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-6 py-2 bg-gray-700 dark:bg-gray-700 light:bg-gray-300 hover:bg-gray-600 dark:hover:bg-gray-600 light:hover:bg-gray-400 text-white dark:text-white light:text-gray-900 font-bold rounded transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div
                        onClick={() => setShowForm(true)}
                        className="mt-12 p-6 border border-dashed border-gray-700 dark:border-gray-700 light:border-gray-400 rounded-lg text-center text-gray-500 dark:text-gray-500 light:text-gray-600 hover:border-cyan-500 dark:hover:border-cyan-500 light:hover:border-blue-600 hover:text-cyan-500 dark:hover:text-cyan-500 light:hover:text-blue-600 cursor-pointer transition-colors"
                    >
                        + Drop a new problem
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProblemArena;
