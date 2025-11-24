import React from 'react';

const TimetableGrid = ({ generatedTimetable, timetableData, darkMode, getConflictIcon }) => {
    return (
        <div className="overflow-x-auto rounded-xl shadow-xl">
            <table className={`w-full border-collapse ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <thead>
                    <tr className={darkMode ? 'bg-gray-900' : 'bg-gradient-to-r from-blue-500 to-purple-500'}>
                        <th className={`p-4 text-left font-bold ${darkMode ? 'text-gray-300' : 'text-white'}`}>
                            Time
                        </th>
                        {Object.keys(generatedTimetable).map(day => (
                            <th key={day} className={`p-4 text-center font-bold ${darkMode ? 'text-gray-300' : 'text-white'}`}>
                                {day}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {timetableData.timeSlots.map((slot, slotIndex) => (
                        <tr key={slot} className={slotIndex % 2 === 0 ? (darkMode ? 'bg-gray-800' : 'bg-gray-50') : (darkMode ? 'bg-gray-700' : 'bg-white')}>
                            <td className={`p-4 font-semibold ${darkMode ? 'text-gray-300 bg-gray-900' : 'text-gray-700 bg-gray-100'}`}>
                                {slot}
                            </td>
                            {Object.keys(generatedTimetable).map(day => (
                                <td key={day} className="p-2">
                                    {generatedTimetable[day][slot] ? (
                                        <div className={`p-3 rounded-lg shadow-md transition-all duration-200 hover:shadow-xl hover:scale-105 ${darkMode ? generatedTimetable[day][slot].colorDark : generatedTimetable[day][slot].colorLight
                                            } ${generatedTimetable[day][slot].borderColor} border-l-4`}>
                                            <div className="flex items-center justify-between">
                                                <span className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                                    {generatedTimetable[day][slot].name}
                                                </span>
                                                {getConflictIcon(day, slot)}
                                            </div>
                                            {generatedTimetable[day][slot].instructor && (
                                                <div className={`text-xs mt-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                                    👤 {generatedTimetable[day][slot].instructor}
                                                </div>
                                            )}
                                            {generatedTimetable[day][slot].room && (
                                                <div className={`text-xs ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                                    📍 {generatedTimetable[day][slot].room}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className={`text-center p-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'} italic`}>
                                            -
                                        </div>
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TimetableGrid;
