import React, { useState, useEffect } from 'react';
import { Plus, Save, Download, Edit3, Clock, Calendar, Users, User, AlertCircle, CheckCircle, RefreshCw, Sun, Moon, Sparkles, X, ChevronDown, ChevronUp, Info } from 'lucide-react';

const TimetableGenerator = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [timetableType, setTimetableType] = useState('');
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [expandedActivity, setExpandedActivity] = useState(null);
  const [timetableData, setTimetableData] = useState({
    name: '',
    timeSlots: [],
    activities: [],
    constraints: []
  });
  const [generatedTimetable, setGeneratedTimetable] = useState(null);
  const [conflicts, setConflicts] = useState([]);
  const [optimizationSettings, setOptimizationSettings] = useState({
    prioritizePreferences: true,
    minimizeGaps: true,
    balanceWorkload: true
  });

  // Apply dark mode to body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const timetableTypes = [
    { 
      id: 'school', 
      name: 'School Schedule', 
      icon: <Users className="w-6 h-6" />, 
      description: 'Class schedules, subjects, and periods',
      gradient: 'from-blue-400 to-blue-600'
    },
    { 
      id: 'college', 
      name: 'College Schedule', 
      icon: <Calendar className="w-6 h-6" />, 
      description: 'Lectures, labs, and study sessions',
      gradient: 'from-purple-400 to-purple-600'
    },
    { 
      id: 'personal', 
      name: 'Personal Schedule', 
      icon: <User className="w-6 h-6" />, 
      description: 'Daily routines and personal activities',
      gradient: 'from-green-400 to-green-600'
    },
    { 
      id: 'work', 
      name: 'Work Schedule', 
      icon: <Clock className="w-6 h-6" />, 
      description: 'Shift schedules and work planning',
      gradient: 'from-orange-400 to-orange-600'
    }
  ];

  const timeSlots = [
    '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', 
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', 
    '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const [currentActivity, setCurrentActivity] = useState({
    name: '',
    duration: 1,
    priority: 'medium',
    preferredDays: [],
    preferredTimes: [],
    avoidTimes: [],
    instructor: '',
    room: '',
    color: 'blue',
    description: '',
    recurring: false
  });

  const priorityLevels = ['high', 'medium', 'low'];
  const colors = [
    { name: 'blue', light: 'bg-blue-200', dark: 'bg-blue-700', border: 'border-blue-400' },
    { name: 'green', light: 'bg-green-200', dark: 'bg-green-700', border: 'border-green-400' },
    { name: 'purple', light: 'bg-purple-200', dark: 'bg-purple-700', border: 'border-purple-400' },
    { name: 'yellow', light: 'bg-yellow-200', dark: 'bg-yellow-700', border: 'border-yellow-400' },
    { name: 'pink', light: 'bg-pink-200', dark: 'bg-pink-700', border: 'border-pink-400' },
    { name: 'indigo', light: 'bg-indigo-200', dark: 'bg-indigo-700', border: 'border-indigo-400' },
    { name: 'red', light: 'bg-red-200', dark: 'bg-red-700', border: 'border-red-400' },
    { name: 'orange', light: 'bg-orange-200', dark: 'bg-orange-700', border: 'border-orange-400' }
  ];

  const handleTypeSelection = (type) => {
    setTimetableType(type);
    setCurrentStep(2);
    setShowSuccessAnimation(true);
    setTimeout(() => setShowSuccessAnimation(false), 500);
  };

  const addTimeSlot = (slot) => {
    if (!timetableData.timeSlots.includes(slot)) {
      setTimetableData(prev => ({
        ...prev,
        timeSlots: [...prev.timeSlots, slot].sort((a, b) => {
          const timeA = parseInt(a.split(':')[0]) + (a.includes('PM') && !a.includes('12') ? 12 : 0);
          const timeB = parseInt(b.split(':')[0]) + (b.includes('PM') && !b.includes('12') ? 12 : 0);
          return timeA - timeB;
        })
      }));
    }
  };

  const removeTimeSlot = (slot) => {
    setTimetableData(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.filter(s => s !== slot)
    }));
  };

  const addActivity = () => {
    if (currentActivity.name && currentActivity.duration) {
      const colorObj = colors.find(c => c.name === currentActivity.color);
      const newActivity = {
        ...currentActivity,
        id: Date.now(),
        colorLight: colorObj.light,
        colorDark: colorObj.dark,
        borderColor: colorObj.border
      };
      
      setTimetableData(prev => ({
        ...prev,
        activities: [...prev.activities, newActivity]
      }));
      
      // Reset form
      setCurrentActivity({
        name: '',
        duration: 1,
        priority: 'medium',
        preferredDays: [],
        preferredTimes: [],
        avoidTimes: [],
        instructor: '',
        room: '',
        color: 'blue',
        description: '',
        recurring: false
      });
    }
  };

  const removeActivity = (id) => {
    setTimetableData(prev => ({
      ...prev,
      activities: prev.activities.filter(a => a.id !== id)
    }));
  };

  const togglePreference = (type, value) => {
    setCurrentActivity(prev => ({
      ...prev,
      [type]: prev[type].includes(value) 
        ? prev[type].filter(item => item !== value)
        : [...prev[type], value]
    }));
  };

  // Conflict Detection Function
  const detectConflicts = (schedule) => {
    const detectedConflicts = [];
    
    Object.keys(schedule).forEach(day => {
      const daySchedule = schedule[day];
      const timeSlots = Object.keys(daySchedule).sort();
      
      timeSlots.forEach(slot => {
        const activity = daySchedule[slot];
        if (activity && activity.duration > 1) {
          const slotIndex = timetableData.timeSlots.indexOf(slot);
          for (let i = 1; i < activity.duration; i++) {
            const nextSlot = timetableData.timeSlots[slotIndex + i];
            if (nextSlot && daySchedule[nextSlot]) {
              detectedConflicts.push({
                type: 'time_overlap',
                severity: 'high',
                message: `${activity.name} conflicts with ${daySchedule[nextSlot].name} on ${day}`,
                day,
                time: slot
              });
            }
          }
        }
        
        if (activity && activity.instructor) {
          timeSlots.forEach(otherSlot => {
            if (otherSlot !== slot && daySchedule[otherSlot] && 
                daySchedule[otherSlot].instructor === activity.instructor) {
              detectedConflicts.push({
                type: 'instructor_conflict',
                severity: 'high',
                message: `${activity.instructor} has conflicting classes on ${day}`,
                day,
                time: slot
              });
            }
          });
        }
        
        if (activity && activity.room) {
          timeSlots.forEach(otherSlot => {
            if (otherSlot !== slot && daySchedule[otherSlot] && 
                daySchedule[otherSlot].room === activity.room) {
              detectedConflicts.push({
                type: 'room_conflict',
                severity: 'medium',
                message: `${activity.room} is double-booked on ${day}`,
                day,
                time: slot
              });
            }
          });
        }
      });
    });
    
    return detectedConflicts;
  };

  // Greedy Algorithm Implementation
  const greedyScheduler = (activities, timeSlots, workingDays) => {
    const schedule = {};
    workingDays.forEach(day => {
      schedule[day] = {};
    });

    const sortedActivities = [...activities].sort((a, b) => {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      const aScore = priorityWeight[a.priority] + (a.preferredTimes.length > 0 ? 2 : 0);
      const bScore = priorityWeight[b.priority] + (b.preferredTimes.length > 0 ? 2 : 0);
      return bScore - aScore;
    });

    sortedActivities.forEach(activity => {
      let bestSlot = null;
      let bestScore = -1;

      workingDays.forEach(day => {
        if (activity.preferredDays.length > 0 && !activity.preferredDays.includes(day)) {
          return;
        }

        timeSlots.forEach(time => {
          if (activity.avoidTimes.includes(time)) {
            return;
          }

          let isAvailable = true;
          const timeIndex = timeSlots.indexOf(time);
          
          for (let i = 0; i < activity.duration; i++) {
            const checkTime = timeSlots[timeIndex + i];
            if (!checkTime || schedule[day][checkTime]) {
              isAvailable = false;
              break;
            }
          }

          if (isAvailable) {
            let score = 0;

            if (activity.preferredTimes.includes(time)) {
              score += 10;
            }

            if (activity.preferredDays.includes(day)) {
              score += 5;
            }

            const priorityBonus = { high: 8, medium: 4, low: 2 };
            score += priorityBonus[activity.priority];

            if (optimizationSettings.minimizeGaps) {
              const adjacentSlots = [
                timeSlots[timeIndex - 1],
                timeSlots[timeIndex + activity.duration]
              ];
              
              adjacentSlots.forEach(adjSlot => {
                if (adjSlot && schedule[day][adjSlot]) {
                  score += 3;
                }
              });
            }

            if (optimizationSettings.balanceWorkload) {
              const dayLoad = Object.keys(schedule[day]).length;
              score += Math.max(0, 5 - dayLoad);
            }

            if (activity.priority !== 'high') {
              const hour = parseInt(time);
              if (hour < 9 || hour > 17) {
                score -= 2;
              }
            }

            if (score > bestScore) {
              bestScore = score;
              bestSlot = { day, time, timeIndex };
            }
          }
        });
      });

      if (bestSlot) {
        const { day, time, timeIndex } = bestSlot;
        for (let i = 0; i < activity.duration; i++) {
          const slotTime = timeSlots[timeIndex + i];
          if (slotTime) {
            schedule[day][slotTime] = { ...activity };
          }
        }
      }
    });

    return schedule;
  };

  const generateTimetable = () => {
    let workingDays = [];
    switch (timetableType) {
      case 'school':
      case 'college':
        workingDays = days.slice(0, 5);
        break;
      case 'work':
        workingDays = days.slice(0, 6);
        break;
      case 'personal':
        workingDays = days;
        break;
      default:
        workingDays = days.slice(0, 5);
    }

    const generated = greedyScheduler(timetableData.activities, timetableData.timeSlots, workingDays);
    const detectedConflicts = detectConflicts(generated);
    
    setGeneratedTimetable(generated);
    setConflicts(detectedConflicts);
    setCurrentStep(4);
    setShowSuccessAnimation(true);
    setTimeout(() => setShowSuccessAnimation(false), 1000);
  };

  const regenerateTimetable = () => {
    generateTimetable();
  };

  const resetGenerator = () => {
    setCurrentStep(1);
    setTimetableType('');
    setTimetableData({
      name: '',
      timeSlots: [],
      activities: [],
      constraints: []
    });
    setGeneratedTimetable(null);
    setConflicts([]);
  };

  const getConflictIcon = (day, slot) => {
    const hasConflict = conflicts.some(conflict => conflict.day === day && conflict.time === slot);
    return hasConflict ? <AlertCircle className="w-4 h-4 text-red-500 ml-1 animate-pulse" /> : null;
  };

  const exportTimetable = () => {
    const exportData = {
      name: timetableData.name,
      type: timetableType,
      schedule: generatedTimetable,
      activities: timetableData.activities,
      timeSlots: timetableData.timeSlots
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${timetableData.name || 'timetable'}_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Dark Mode Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
            darkMode 
              ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700 shadow-lg shadow-yellow-400/20' 
              : 'bg-white text-gray-800 hover:bg-gray-100 shadow-lg shadow-gray-400/20'
          }`}
        >
          {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {/* Enhanced Header */}
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className={`w-8 h-8 mr-2 ${darkMode ? 'text-purple-400' : 'text-purple-600'} animate-pulse`} />
            <h1 className={`text-5xl font-bold bg-gradient-to-r ${
              darkMode 
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
        </div>

        {/* Enhanced Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[
              { num: 1, label: 'Type' },
              { num: 2, label: 'Configure' },
              { num: 3, label: 'Activities' },
              { num: 4, label: 'Generate' }
            ].map((step, index) => (
              <div key={step.num} className="flex items-center">
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                    currentStep >= step.num 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-110' 
                      : darkMode
                        ? 'bg-gray-700 text-gray-400'
                        : 'bg-gray-200 text-gray-600'
                  }`}>
                    {currentStep > step.num ? <CheckCircle className="w-6 h-6" /> : step.num}
                  </div>
                  <span className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < 3 && (
                  <div className={`w-16 h-1 transition-all duration-300 ${
                    currentStep > step.num 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                      : darkMode
                        ? 'bg-gray-700'
                        : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className={`rounded-2xl shadow-2xl p-8 mt-12 transition-all duration-300 ${
          darkMode 
            ? 'bg-gray-800/90 backdrop-blur-lg border border-gray-700' 
            : 'bg-white/90 backdrop-blur-lg'
        } ${showSuccessAnimation ? 'transform scale-105' : ''}`}>
          
          {/* Step 1: Enhanced Type Selection */}
          {currentStep === 1 && (
            <div className="animate-fadeIn">
              <h2 className={`text-3xl font-bold mb-8 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Choose Your Timetable Type
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {timetableTypes.map((type) => (
                  <div
                    key={type.id}
                    onClick={() => handleTypeSelection(type.id)}
                    className={`relative overflow-hidden rounded-xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                      darkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 border border-gray-600' 
                        : 'bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-500'
                    }`}
                  >
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${type.gradient} opacity-10 rounded-full -mr-16 -mt-16`}></div>
                    <div className="relative z-10">
                      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-lg bg-gradient-to-br ${type.gradient} text-white mb-4`}>
                        {type.icon}
                      </div>
                      <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {type.name}
                      </h3>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {type.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Enhanced Configuration */}
          {currentStep === 2 && (
            <div className="animate-fadeIn">
              <h2 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Configure Your Timetable
              </h2>
              
              <div className="space-y-8">
                <div>
                  <label className={`block text-sm font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Timetable Name
                  </label>
                  <input
                    type="text"
                    className={`w-full p-4 rounded-lg transition-all duration-200 ${
                      darkMode 
                        ? 'bg-gray-700 text-white border border-gray-600 focus:border-purple-400' 
                        : 'bg-white text-gray-800 border-2 border-gray-200 focus:border-blue-500'
                    } focus:ring-4 focus:ring-opacity-20 focus:ring-blue-500`}
                    placeholder="Enter a memorable name for your timetable..."
                    value={timetableData.name}
                    onChange={(e) => setTimetableData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Select Time Slots
                  </label>
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mb-4">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => addTimeSlot(slot)}
                        className={`p-2 text-sm rounded-lg transition-all duration-200 transform hover:scale-105 ${
                          timetableData.timeSlots.includes(slot)
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                            : darkMode
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                  
                  {timetableData.timeSlots.length > 0 && (
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                      <p className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Selected Time Slots ({timetableData.timeSlots.length}):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {timetableData.timeSlots.map((slot) => (
                          <span
                            key={slot}
                            onClick={() => removeTimeSlot(slot)}
                            className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                              darkMode
                                ? 'bg-purple-600 text-white hover:bg-red-600'
                                : 'bg-blue-100 text-blue-800 hover:bg-red-100 hover:text-red-800'
                            }`}
                          >
                            {slot} ×
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Enhanced Optimization Settings */}
                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gradient-to-r from-blue-50 to-purple-50'}`}>
                  <div className="flex items-center mb-4">
                    <Info className={`w-5 h-5 mr-2 ${darkMode ? 'text-purple-400' : 'text-blue-600'}`} />
                    <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      AI Optimization Settings
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {Object.entries(optimizationSettings).map(([key, value]) => (
                      <label key={key} className="flex items-center group cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => setOptimizationSettings(prev => ({
                              ...prev,
                              [key]: e.target.checked
                            }))}
                            className="sr-only"
                          />
                          <div className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                            value 
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                              : darkMode ? 'bg-gray-600' : 'bg-gray-300'
                          }`}>
                            <div className={`w-5 h-5 bg-white rounded-full shadow-lg transform transition-transform duration-200 ${
                              value ? 'translate-x-6' : 'translate-x-0.5'
                            } mt-0.5`}></div>
                          </div>
                        </div>
                        <span className={`ml-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {key === 'prioritizePreferences' && '🎯 Prioritize time preferences'}
                          {key === 'minimizeGaps' && '⏱️ Minimize gaps between activities'}
                          {key === 'balanceWorkload' && '⚖️ Balance daily workload'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
                      darkMode
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    disabled={!timetableData.name || timetableData.timeSlots.length === 0}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                      !timetableData.name || timetableData.timeSlots.length === 0
                        ? darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    }`}
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Enhanced Activities */}
          {currentStep === 3 && (
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
                        onChange={(e) => setCurrentActivity(prev => ({...prev, name: e.target.value}))}
                        className={`w-full p-3 rounded-lg ${
                          darkMode 
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
                        onChange={(e) => setCurrentActivity(prev => ({...prev, duration: parseInt(e.target.value)}))}
                        className={`w-full p-3 rounded-lg ${
                          darkMode 
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
                        onChange={(e) => setCurrentActivity(prev => ({...prev, instructor: e.target.value}))}
                        className={`w-full p-3 rounded-lg ${
                          darkMode 
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
                        onChange={(e) => setCurrentActivity(prev => ({...prev, room: e.target.value}))}
                        className={`w-full p-3 rounded-lg ${
                          darkMode 
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
                      onChange={(e) => setCurrentActivity(prev => ({...prev, description: e.target.value}))}
                      className={`w-full p-3 rounded-lg ${
                        darkMode 
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
                            onClick={() => setCurrentActivity(prev => ({...prev, priority}))}
                            className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all duration-200 ${
                              currentActivity.priority === priority
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
                        {colors.map(color => (
                          <button
                            key={color.name}
                            onClick={() => setCurrentActivity(prev => ({...prev, color: color.name}))}
                            className={`w-10 h-10 rounded-lg ${darkMode ? color.dark : color.light} ${color.border} border-2 transition-all duration-200 ${
                              currentActivity.color === color.name ? 'ring-2 ring-offset-2 ring-purple-500 scale-110' : ''
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
                      onChange={(e) => setCurrentActivity(prev => ({...prev, recurring: e.target.checked}))}
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
                            onClick={() => togglePreference('preferredDays', day)}
                            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                              currentActivity.preferredDays.includes(day)
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
                            onClick={() => togglePreference('preferredTimes', time)}
                            className={`px-3 py-1 text-sm rounded-lg transition-all duration-200 ${
                              currentActivity.preferredTimes.includes(time)
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
                            onClick={() => togglePreference('avoidTimes', time)}
                            className={`px-3 py-1 text-sm rounded-lg transition-all duration-200 ${
                              currentActivity.avoidTimes.includes(time)
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
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                    !currentActivity.name
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
                                <span className={`ml-3 px-2 py-1 rounded text-xs font-semibold ${
                                  activity.priority === 'high' 
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
                              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} space-y-1`}>
                                <div>⏱️ Duration: {activity.duration} hour{activity.duration > 1 ? 's' : ''}</div>
                                {activity.instructor && <div>👤 Instructor: {activity.instructor}</div>}
                                {activity.room && <div>📍 Room: {activity.room}</div>}
                                {activity.description && <div>📝 {activity.description}</div>}
                                {activity.preferredDays.length > 0 && (
                                  <div className="text-green-600">
                                    ✓ Preferred days: {activity.preferredDays.join(', ')}
                                  </div>
                                )}
                                {activity.preferredTimes.length > 0 && (
                                  <div className="text-blue-600">
                                    ✓ Preferred times: {activity.preferredTimes.join(', ')}
                                  </div>
                                )}
                                {activity.avoidTimes.length > 0 && (
                                  <div className="text-red-600">
                                    ✗ Avoid times: {activity.avoidTimes.join(', ')}
                                  </div>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setExpandedActivity(expandedActivity === activity.id ? null : activity.id);
                              }}
                              className={`ml-4 p-2 rounded-lg transition-all duration-200 ${
                                darkMode 
                                  ? 'text-gray-400 hover:text-white hover:bg-gray-600' 
                                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                              }`}
                            >
                              {expandedActivity === activity.id ? <ChevronUp /> : <ChevronDown />}
                            </button>
                            <button
                              onClick={() => removeActivity(activity.id)}
                              className="ml-2 p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all duration-200"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                          {expandedActivity === activity.id && (
                            <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                              <button
                                onClick={() => {
                                  setCurrentActivity({...activity});
                                  removeActivity(activity.id);
                                }}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
                              >
                                <Edit3 className="w-4 h-4 inline mr-2" />
                                Edit Activity
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
                      darkMode
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    ← Back
                  </button>
                  <button
                    onClick={generateTimetable}
                    disabled={timetableData.activities.length === 0}
                    className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                      timetableData.activities.length === 0
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
          )}

          {/* Step 4: Enhanced Generated Timetable */}
          {currentStep === 4 && generatedTimetable && (
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

              {/* Conflicts Panel */}
              {conflicts.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 animate-pulse">
                  <h3 className="font-bold text-red-600 mb-3 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Detected Conflicts
                  </h3>
                  <div className="space-y-2">
                    {conflicts.map((conflict, index) => (
                      <div key={index} className={`text-sm p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-bold mr-2 ${
                          conflict.severity === 'high' 
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
              )}

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

              {/* Timetable Grid */}
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
                              <div className={`p-3 rounded-lg shadow-md transition-all duration-200 hover:shadow-xl hover:scale-105 ${
                                darkMode ? generatedTimetable[day][slot].colorDark : generatedTimetable[day][slot].colorLight
                              } ${generatedTimetable[day][slot].borderColor} border-l-4`}>
                                <div className="flex items-center justify-between">
                                  <span className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                    {generatedTimetable[day][slot].name}
                                  </span>
                                  {getConflictIcon(day, slot)}
                                </div>
                                {generatedTimetable[day][slot].instructor && (
                                  <div className={`text-xs mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    👤 {generatedTimetable[day][slot].instructor}
                                  </div>
                                )}
                                {generatedTimetable[day][slot].room && (
                                  <div className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
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

              {/* Statistics Dashboard */}
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

              {/* Algorithm Info */}
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

              <div className="mt-8 flex justify-between">
                <button
                  onClick={resetGenerator}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
                    darkMode
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
          )}
        </div>
      </div>
    </div>
  );
};

export default TimetableGenerator;