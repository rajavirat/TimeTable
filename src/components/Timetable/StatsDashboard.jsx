import React from 'react';

const StatsDashboard = ({ timetableData, generatedTimetable, conflicts, darkMode }) => {
    return (
        <div className={`mt-8 p-6 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gradient-to-r from-blue-50 to-purple-50'}`}>
            <h3 className={`font-bold text-xl mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                📊 Schedule Analytics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                    <div className="text-3xl font-bold text-blue-500">
                        {timetableData.activities.length}
                    </div>
                    <div className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Total Activities
                    </div>
                </div>
                <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                    <div className="text-3xl font-bold text-green-500">
                        {Object.values(generatedTimetable).reduce((total, day) =>
                            total + Object.keys(day).length, 0
                        )}
                    </div>
                    <div className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Scheduled Slots
                    </div>
                </div>
                <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                    <div className="text-3xl font-bold text-purple-500">
                        {timetableData.activities.filter(a => a.priority === 'high').length}
                    </div>
                    <div className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        High Priority
                    </div>
                </div>
                <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                    <div className={`text-3xl font-bold ${conflicts.length === 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {conflicts.length}
                    </div>
                    <div className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Conflicts
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsDashboard;
