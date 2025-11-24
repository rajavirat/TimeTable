import React from 'react';
import { CheckCircle, AlertCircle, RefreshCw, Download, Edit3, Save, Cloud } from 'lucide-react';
import ConflictsPanel from './ConflictsPanel';
import TimetableGrid from './TimetableGrid';
import StatsDashboard from './StatsDashboard';
import AlgorithmInfo from './AlgorithmInfo';

const GeneratedTimetable = ({
    generatedTimetable,
    conflicts,
    timetableData,
    regenerateTimetable,
    exportTimetable,
    saveTimetable,
    setCurrentStep,
    darkMode,
    resetGenerator,
    getConflictIcon
}) => {
    return (
        <div className="animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                    <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Your Smart Timetable
                    </h2>
                    <div className="flex items-center mt-2">
                        {conflicts.length === 0 ? (
                            <div className="flex items-center text-green-500 animate-pulse">
                                <CheckCircle className="w-5 h-5 mr-2" />
                                <span className="font-semibold">Perfect! No conflicts detected</span>
                            </div>
                        ) : (
                            <div className="flex items-center text-red-500 animate-pulse">
                                <AlertCircle className="w-5 h-5 mr-2" />
                                <span className="font-semibold">{conflicts.length} conflict(s) detected</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                    <button
                        onClick={regenerateTimetable}
                        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                    >
                        <RefreshCw className="w-4 h-4 inline mr-2" />
                        Regenerate
                    </button>
                    <button
                        onClick={saveTimetable}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                    >
                        <Cloud className="w-4 h-4 inline mr-2" />
                        Save to Cloud
                    </button>
                    <button
                        onClick={exportTimetable}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                    >
                        <Download className="w-4 h-4 inline mr-2" />
                        Export
                    </button>
                    <button
                        onClick={() => setCurrentStep(3)}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                    >
                        <Edit3 className="w-4 h-4 inline mr-2" />
                        Edit
                    </button>
                </div>
            </div>

            <ConflictsPanel conflicts={conflicts} darkMode={darkMode} />

            {/* Success Message */}
            {conflicts.length === 0 && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
                    <div className="flex items-center text-green-600 font-bold">
                        <CheckCircle className="w-6 h-6 mr-2" />
                        Perfect Schedule Generated!
                    </div>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Your timetable has been optimally scheduled with no conflicts. All preferences have been considered.
                    </p>
                </div>
            )}

            <TimetableGrid
                generatedTimetable={generatedTimetable}
                timetableData={timetableData}
                darkMode={darkMode}
                getConflictIcon={getConflictIcon}
            />

            <StatsDashboard
                timetableData={timetableData}
                generatedTimetable={generatedTimetable}
                conflicts={conflicts}
                darkMode={darkMode}
            />

            <AlgorithmInfo darkMode={darkMode} />

            <div className="mt-8 flex justify-between">
                <button
                    onClick={resetGenerator}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${darkMode
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    ← Start Over
                </button>
                <button
                    onClick={() => {
                        window.print();
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                    <Save className="w-5 h-5 inline mr-2" />
                    Print/Save PDF
                </button>
            </div>
        </div>
    );
};

export default GeneratedTimetable;
