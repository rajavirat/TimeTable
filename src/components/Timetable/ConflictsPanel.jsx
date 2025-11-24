import React from 'react';
import { AlertCircle } from 'lucide-react';

const ConflictsPanel = ({ conflicts, darkMode }) => {
    if (conflicts.length === 0) return null;

    return (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 animate-pulse">
            <h3 className="font-bold text-red-600 mb-3 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Detected Conflicts
            </h3>
            <div className="space-y-2">
                {conflicts.map((conflict, index) => (
                    <div key={index} className={`text-sm p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-bold mr-2 ${conflict.severity === 'high'
                            ? 'bg-red-500 text-white'
                            : 'bg-yellow-500 text-white'
                            }`}>
                            {conflict.severity.toUpperCase()}
                        </span>
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                            {conflict.message}
                        </span>
                    </div>
                ))}
            </div>
            <div className={`mt-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                💡 Tip: Try regenerating or adjust activity preferences to resolve conflicts
            </div>
        </div>
    );
};

export default ConflictsPanel;
