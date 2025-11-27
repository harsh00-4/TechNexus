import React from 'react';
import GroupsManager from './GroupsManager';

const Groups = () => {
    return (
        <div className="min-h-screen bg-black pt-24 px-4 md:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-2">👥 GROUPS</h2>
                <p className="text-cyan-400 text-center mb-8">Manage your collaboration groups</p>

                <GroupsManager />
            </div>
        </div>
    );
};

export default Groups;
