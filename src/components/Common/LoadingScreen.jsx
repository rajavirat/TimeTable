import React from 'react';
import { RefreshCw } from 'lucide-react';

const LoadingScreen = ({ darkMode }) => {
    return (
        <div className={`min-h-screen flex items-center justify-center ${darkMode
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
            : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
            }`}>
            <div className="text-center">
                <RefreshCw className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Loading...</p>
            </div>
        </div>
    );
};

export default LoadingScreen;
