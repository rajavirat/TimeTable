import React from 'react';
import { Plus, X, Sparkles } from 'lucide-react';

const ActivityForm = ({
    currentActivity,
    setCurrentActivity,
    timetableData,
    setTimetableData,
    addActivity,
    removeActivity,
    togglePreference,
    generateTimetable,
    setCurrentStep,
    darkMode,
    priorityLevels,
    colors,
    days
}) => {
    return (
        <div className="animate-fadeIn">
            <h2 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Add Activities & Subjects
            </h2>

            <div className="space-y-6">
                {/* Activity Form */}
                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Activity Name *
                            </label>
                            <input
                                type="text"
                                value={currentActivity.name}
                                onChange={(e) => setCurrentActivity(prev => ({ ...prev, name: e.target.value }))}
                                className={`w-full p-3 rounded-lg ${darkMode
                                    ? 'bg-gray-600 text-white border border-gray-500'
                                    : 'bg-white text-gray-800 border border-gray-300'
                                    } focus:ring-2 focus:ring-purple-500`}
                                placeholder="e.g., Mathematics, Meeting"
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Duration (hours)
                            </label>
                            <select
                                value={currentActivity.duration}
                                onChange={(e) => setCurrentActivity(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                                className={`w-full p-3 rounded-lg ${darkMode
                                    ? 'bg-gray-600 text-white border border-gray-500'
                                    : 'bg-white text-gray-800 border border-gray-300'
                                    } focus:ring-2 focus:ring-purple-500`}
                            >
                                {[1, 2, 3, 4].map(num => (
                                    <option key={num} value={num}>{num} hour{num > 1 ? 's' : ''}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Instructor/Person
                            </label>
                            <input
                                type="text"
                                value={currentActivity.instructor}
                                onChange={(e) => setCurrentActivity(prev => ({ ...prev, instructor: e.target.value }))}
                                className={`w-full p-3 rounded-lg ${darkMode
                                    ? 'bg-gray-600 text-white border border-gray-500'
                                    : 'bg-white text-gray-800 border border-gray-300'
                                    } focus:ring-2 focus:ring-purple-500`}
                                placeholder="Optional"
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Room/Location
                            </label>
                            <input
                                type="text"
                                value={currentActivity.room}
                                onChange={(e) => setCurrentActivity(prev => ({ ...prev, room: e.target.value }))}
                                className={`w-full p-3 rounded-lg ${darkMode
                                    ? 'bg-gray-600 text-white border border-gray-500'
                                    : 'bg-white text-gray-800 border border-gray-300'
                                    } focus:ring-2 focus:ring-purple-500`}
                                placeholder="Optional"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Description/Notes
                        </label>
                        <textarea
                            value={currentActivity.description}
                            onChange={(e) => setCurrentActivity(prev => ({ ...prev, description: e.target.value }))}
                            className={`w-full p-3 rounded-lg ${darkMode
                                ? 'bg-gray-600 text-white border border-gray-500'
                                : 'bg-white text-gray-800 border border-gray-300'
                                } focus:ring-2 focus:ring-purple-500`}
                            rows="2"
                            placeholder="Optional notes about this activity..."
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Priority
                            </label>
                            <div className="flex gap-2">
                                {priorityLevels.map(priority => (
                                    <button
                                        key={priority}
                                        type="button"
                                        onClick={() => setCurrentActivity(prev => ({ ...prev, priority }))}
                                        className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all duration-200 ${currentActivity.priority === priority
                                            ? priority === 'high'
                                                ? 'bg-red-500 text-white'
                                                : priority === 'medium'
                                                    ? 'bg-yellow-500 text-white'
                                                    : 'bg-green-500 text-white'
                                            : darkMode
                                                ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Color Theme
                            </label>
                            <div className="flex gap-2">
                                {colors.slice(0, 6).map(color => (
                                    <button
                                        key={color.name}
                                        type="button"
                                        onClick={() => setCurrentActivity(prev => ({ ...prev, color: color.name }))}
                                        className={`w-10 h-10 rounded-lg ${darkMode ? color.dark : color.light} ${color.border} border-2 transition-all duration-200 ${currentActivity.color === color.name ? 'ring-2 ring-offset-2 ring-purple-500 scale-110' : ''
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            id="recurring"
                            checked={currentActivity.recurring}
                            onChange={(e) => setCurrentActivity(prev => ({ ...prev, recurring: e.target.checked }))}
                            className="mr-2"
                        />
                        <label htmlFor="recurring" className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Recurring activity (appears multiple times per week)
                        </label>
                    </div>
                </div>

                {/* Time Preferences */}
                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-blue-50'}`}>
                    <h3 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        ⚙️ Time Preferences (Optional)
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Preferred Days
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {days.map(day => (
                                    <button
                                        key={day}
                                        type="button"
                                        onClick={() => togglePreference('preferredDays', day)}
                                        className={`px-4 py-2 rounded-lg transition-all duration-200 ${currentActivity.preferredDays.includes(day)
                                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg transform scale-105'
                                            : darkMode
                                                ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        {day.slice(0, 3)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Preferred Times
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {timetableData.timeSlots.map(time => (
                                    <button
                                        key={time}
                                        type="button"
                                        onClick={() => togglePreference('preferredTimes', time)}
                                        className={`px-3 py-1 text-sm rounded-lg transition-all duration-200 ${currentActivity.preferredTimes.includes(time)
                                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                                            : darkMode
                                                ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Avoid Times
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {timetableData.timeSlots.map(time => (
                                    <button
                                        key={time}
                                        type="button"
                                        onClick={() => togglePreference('avoidTimes', time)}
                                        className={`px-3 py-1 text-sm rounded-lg transition-all duration-200 ${currentActivity.avoidTimes.includes(time)
                                            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                                            : darkMode
                                                ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={addActivity}
                    disabled={!currentActivity.name}
                    className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${!currentActivity.name
                        ? darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400'
                        : 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                        }`}
                >
                    <Plus className="w-5 h-5 inline mr-2" />
                    Add Activity
                </button>

                {/* Activities List */}
                {timetableData.activities.length > 0 && (
                    <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                        <h3 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            Added Activities ({timetableData.activities.length})
                        </h3>
                        <div className="space-y-3">
                            {timetableData.activities.map((activity) => (
                                <div
                                    key={activity.id}
                                    className={`p-4 rounded-lg border-l-4 ${darkMode ? activity.colorDark : activity.colorLight} ${activity.borderColor} transition-all duration-200 hover:shadow-lg`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center mb-2">
                                                <h4 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                                    {activity.name}
                                                </h4>
                                                <span className={`ml-3 px-2 py-1 rounded text-xs font-semibold ${activity.priority === 'high'
                                                    ? 'bg-red-500 text-white'
                                                    : activity.priority === 'medium'
                                                        ? 'bg-yellow-500 text-white'
                                                        : 'bg-green-500 text-white'
                                                    }`}>
                                                    {activity.priority.toUpperCase()}
                                                </span>
                                                {activity.recurring && (
                                                    <span className="ml-2 px-2 py-1 bg-purple-500 text-white rounded text-xs font-semibold">
                                                        RECURRING
                                                    </span>
                                                )}
                                            </div>
                                            <div className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'} space-y-1`}>
                                                <div>⏱️ Duration: {activity.duration} hour{activity.duration > 1 ? 's' : ''}</div>
                                                {activity.instructor && <div>👤 Instructor: {activity.instructor}</div>}
                                                {activity.room && <div>📍 Room: {activity.room}</div>}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeActivity(activity.id)}
                                            className="ml-2 p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all duration-200"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex justify-between">
                    <button
                        onClick={() => setCurrentStep(2)}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${darkMode
                            ? 'bg-gray-700 text-white hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        ← Back
                    </button>
                    <button
                        onClick={generateTimetable}
                        disabled={timetableData.activities.length === 0}
                        className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${timetableData.activities.length === 0
                            ? darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400'
                            : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg animate-pulse'
                            }`}
                    >
                        <Sparkles className="w-5 h-5 inline mr-2" />
                        Generate Smart Timetable
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActivityForm;
