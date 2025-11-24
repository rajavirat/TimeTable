import React, { useState } from 'react';
import { User, Sun, Moon, LogOut, Sparkles, LayoutGrid, Plus } from 'lucide-react';
import StepIndicator from './StepIndicator';
import TypeSelection from './TypeSelection';
import Configuration from './Configuration';
import ActivityForm from './ActivityForm';
import GeneratedTimetable from './GeneratedTimetable';
import SavedTimetables from './SavedTimetables';

const TimetableGenerator = ({
    currentStep,
    setCurrentStep,
    timetableType,
    setTimetableType,
    showSuccessAnimation,
    timetableData,
    setTimetableData,
    currentActivity,
    setCurrentActivity,
    generatedTimetable,
    conflicts,
    optimizationSettings,
    setOptimizationSettings,
    handleTypeSelection,
    addTimeSlot,
    removeTimeSlot,
    addActivity,
    removeActivity,
    togglePreference,
    generateTimetable,
    regenerateTimetable,
    exportTimetable,
    saveTimetable,
    resetGenerator,
    getConflictIcon,
    darkMode,
    setDarkMode,
    currentUser,
    handleLogout,
    timetableTypes,
    timeSlots,
    priorityLevels,
    colors,
    days,
    savedTimetables = [],
    loadTimetable,
    deleteTimetable,
    fetchSavedTimetables
}) => {
    const [view, setView] = useState('generator'); // 'generator' or 'saved'
    return (
        <div className={`min-h-screen transition-all duration-500 ${darkMode
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
            : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
            }`}>
            {/* Dark Mode Toggle & User Info */}
            <div className="absolute top-4 right-4 z-50 flex items-center gap-4">
                <div className={`px-4 py-2 rounded-full ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-lg flex items-center gap-2`}>
                    <User className="w-5 h-5" />
                    <span className="font-semibold">{currentUser.name}</span>
                </div>
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${darkMode
                        ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700 shadow-lg shadow-yellow-400/20'
                        : 'bg-white text-gray-800 hover:bg-gray-100 shadow-lg shadow-gray-400/20'
                        }`}
                >
                    {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                </button>
                <button
                    onClick={handleLogout}
                    className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${darkMode
                        ? 'bg-red-800 text-white hover:bg-red-700 shadow-lg'
                        : 'bg-red-500 text-white hover:bg-red-600 shadow-lg'
                        }`}
                >
                    <LogOut className="w-6 h-6" />
                </button>
            </div>

            <div className="max-w-7xl mx-auto p-4">
                {/* Enhanced Header */}
                <div className="text-center mb-8 pt-8">
                    <div className="flex items-center justify-center mb-4">
                        <Sparkles className={`w-8 h-8 mr-2 ${darkMode ? 'text-purple-400' : 'text-purple-600'} animate-pulse`} />
                        <h1 className={`text-5xl font-bold bg-gradient-to-r ${darkMode
                            ? 'from-blue-400 via-purple-400 to-pink-400'
                            : 'from-blue-600 via-purple-600 to-pink-600'
                            } bg-clip-text text-transparent animate-gradient`}>
                            Smart Timetable Generator
                        </h1>
                        <Sparkles className={`w-8 h-8 ml-2 ${darkMode ? 'text-purple-400' : 'text-purple-600'} animate-pulse`} />
                    </div>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-lg`}>
                        Intelligent scheduling with conflict detection and optimization
                    </p>

                    {/* View Toggle */}
                    <div className="flex justify-center mt-6 gap-4">
                        <button
                            onClick={() => setView('generator')}
                            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${view === 'generator'
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105'
                                    : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <Plus className="w-4 h-4" />
                            New Timetable
                        </button>
                        <button
                            onClick={() => {
                                setView('saved');
                                if (fetchSavedTimetables) fetchSavedTimetables();
                            }}
                            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${view === 'saved'
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105'
                                    : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                            My Timetables
                        </button>
                    </div>
                </div>

                {view === 'saved' ? (
                    <div className={`rounded-2xl shadow-2xl p-8 mt-8 transition-all duration-300 ${darkMode
                        ? 'bg-gray-800/90 backdrop-blur-lg border border-gray-700'
                        : 'bg-white/90 backdrop-blur-lg'
                        }`}>
                        <SavedTimetables
                            savedTimetables={savedTimetables}
                            loadTimetable={(timetable) => {
                                loadTimetable(timetable);
                                setView('generator');
                            }}
                            deleteTimetable={deleteTimetable}
                            darkMode={darkMode}
                        />
                    </div>
                ) : (
                    <>
                        <StepIndicator currentStep={currentStep} darkMode={darkMode} />

                        <div className={`rounded-2xl shadow-2xl p-8 mt-12 transition-all duration-300 ${darkMode
                            ? 'bg-gray-800/90 backdrop-blur-lg border border-gray-700'
                            : 'bg-white/90 backdrop-blur-lg'
                            } ${showSuccessAnimation ? 'transform scale-105' : ''}`}>

                            {currentStep === 1 && (
                                <TypeSelection
                                    timetableTypes={timetableTypes}
                                    handleTypeSelection={handleTypeSelection}
                                    darkMode={darkMode}
                                />
                            )}

                            {currentStep === 2 && (
                                <Configuration
                                    timetableData={timetableData}
                                    setTimetableData={setTimetableData}
                                    timeSlots={timeSlots}
                                    addTimeSlot={addTimeSlot}
                                    removeTimeSlot={removeTimeSlot}
                                    optimizationSettings={optimizationSettings}
                                    setOptimizationSettings={setOptimizationSettings}
                                    setCurrentStep={setCurrentStep}
                                    darkMode={darkMode}
                                />
                            )}

                            {currentStep === 3 && (
                                <ActivityForm
                                    currentActivity={currentActivity}
                                    setCurrentActivity={setCurrentActivity}
                                    timetableData={timetableData}
                                    setTimetableData={setTimetableData}
                                    addActivity={addActivity}
                                    removeActivity={removeActivity}
                                    togglePreference={togglePreference}
                                    generateTimetable={generateTimetable}
                                    setCurrentStep={setCurrentStep}
                                    darkMode={darkMode}
                                    priorityLevels={priorityLevels}
                                    colors={colors}
                                    days={days}
                                />
                            )}

                            {currentStep === 4 && generatedTimetable && (
                                <GeneratedTimetable
                                    generatedTimetable={generatedTimetable}
                                    conflicts={conflicts}
                                    timetableData={timetableData}
                                    regenerateTimetable={regenerateTimetable}
                                    exportTimetable={exportTimetable}
                                    saveTimetable={saveTimetable}
                                    setCurrentStep={setCurrentStep}
                                    darkMode={darkMode}
                                    resetGenerator={resetGenerator}
                                    getConflictIcon={getConflictIcon}
                                />
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TimetableGenerator;
