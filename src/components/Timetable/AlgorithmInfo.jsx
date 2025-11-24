import React from 'react';

const AlgorithmInfo = ({ darkMode }) => {
    return (
        <div className={`mt-6 p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-blue-50'}`}>
            <h3 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                🧠 AI-Powered Features
            </h3>
            <div className={`grid md:grid-cols-2 gap-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <div>✅ Greedy optimization algorithm</div>
                <div>✅ Priority-based scheduling</div>
                <div>✅ Time preference consideration</div>
                <div>✅ Conflict detection & prevention</div>
                <div>✅ Gap minimization</div>
                <div>✅ Workload balancing</div>
            </div>
        </div>
    );
};

export default AlgorithmInfo;
