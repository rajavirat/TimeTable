import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  deleteDoc,
  orderBy
} from 'firebase/firestore';
import { Users, Calendar, User, Clock, AlertCircle } from 'lucide-react';

import AuthPage from './components/Auth/AuthPage';
import LoadingScreen from './components/Common/LoadingScreen';
import TimetableGenerator from './components/Timetable/TimetableGenerator';

const IntegratedTimetableApp = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [authErrors, setAuthErrors] = useState({});
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  // Timetable Generator State
  const [currentStep, setCurrentStep] = useState(1);
  const [timetableType, setTimetableType] = useState('');
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

  // Saved Timetables State
  const [savedTimetables, setSavedTimetables] = useState([]);

  // Constants
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

  // Effects
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            name: userDoc.data().name
          });
          setIsAuthenticated(true);
        }
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch saved timetables when user authenticates
  useEffect(() => {
    if (currentUser) {
      fetchSavedTimetables();
    }
  }, [currentUser]);

  // Auth Functions
  const validateAuthForm = () => {
    const newErrors = {};
    if (!isLogin && !formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!isLogin && formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setAuthErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (validateAuthForm()) {
      try {
        setAuthLoading(true);
        if (isLogin) {
          const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
          const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
          setCurrentUser({
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            name: userDoc.data().name
          });
        } else {
          const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            name: formData.name,
            email: formData.email,
            createdAt: serverTimestamp()
          });
          setCurrentUser({
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            name: formData.name
          });
        }
        setIsAuthenticated(true);
        setShowSuccessAnimation(true);
        setTimeout(() => setShowSuccessAnimation(false), 1000);
      } catch (error) {
        console.error('Auth error:', error);
        setAuthErrors({
          email: error.code === 'auth/email-already-in-use' ? 'Email already in use' :
            error.code === 'auth/invalid-email' ? 'Invalid email' :
              error.code === 'auth/user-not-found' ? 'User not found' :
                error.code === 'auth/wrong-password' ? 'Wrong password' :
                  'Authentication failed'
        });
      } finally {
        setAuthLoading(false);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setAuthLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          createdAt: serverTimestamp()
        });
      }

      setCurrentUser({
        uid: user.uid,
        email: user.email,
        name: user.displayName
      });

      setIsAuthenticated(true);
      setShowSuccessAnimation(true);
      setTimeout(() => setShowSuccessAnimation(false), 1000);

    } catch (error) {
      console.error('Google Auth error:', error);
      setAuthErrors({
        google: 'Google Sign-In failed. Please try again.'
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (authErrors[name]) setAuthErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      setCurrentUser(null);
      resetGenerator();
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Timetable Functions
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
            if (otherSlot !== slot && daySchedule[otherSlot] && daySchedule[otherSlot].instructor === activity.instructor) {
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
            if (otherSlot !== slot && daySchedule[otherSlot] && daySchedule[otherSlot].room === activity.room) {
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

  const greedyScheduler = (activities, timeSlots, workingDays) => {
    const schedule = {};
    workingDays.forEach(day => { schedule[day] = {}; });

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
        if (activity.preferredDays.length > 0 && !activity.preferredDays.includes(day)) return;

        timeSlots.forEach(time => {
          if (activity.avoidTimes.includes(time)) return;

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
            if (activity.preferredTimes.includes(time)) score += 10;
            if (activity.preferredDays.includes(day)) score += 5;
            const priorityBonus = { high: 8, medium: 4, low: 2 };
            score += priorityBonus[activity.priority];
            if (optimizationSettings.minimizeGaps) {
              const adjacentSlots = [timeSlots[timeIndex - 1], timeSlots[timeIndex + activity.duration]];
              adjacentSlots.forEach(adjSlot => {
                if (adjSlot && schedule[day][adjSlot]) score += 3;
              });
            }
            if (optimizationSettings.balanceWorkload) {
              const dayLoad = Object.keys(schedule[day]).length;
              score += Math.max(0, 5 - dayLoad);
            }
            if (activity.priority !== 'high') {
              const hour = parseInt(time);
              if (hour < 9 || hour > 17) score -= 2;
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
          if (slotTime) schedule[day][slotTime] = { ...activity };
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

  const exportTimetable = async () => {
    const exportData = {
      name: timetableData.name,
      type: timetableType,
      schedule: generatedTimetable,
      activities: timetableData.activities,
      timeSlots: timetableData.timeSlots,
      userId: currentUser.uid,
      userEmail: currentUser.email,
      createdAt: serverTimestamp()
    };

    try {
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

      const exportFileDefaultName = `${timetableData.name || 'timetable'}_${new Date().toISOString().split('T')[0]}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();

      alert('Timetable exported successfully!');
    } catch (error) {
      console.error('Error exporting timetable:', error);
      alert('Error exporting timetable. Please try again.');
    }
  };

  // Saved Timetables Functions
  const fetchSavedTimetables = async () => {
    if (!currentUser) return;

    try {
      const q = query(
        collection(db, 'timetables'),
        where('userId', '==', currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const timetables = [];
      querySnapshot.forEach((doc) => {
        timetables.push({
          id: doc.id,
          ...doc.data()
        });
      });
      // Sort client-side to avoid Firestore index requirements
      timetables.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        return dateB - dateA;
      });
      setSavedTimetables(timetables);
    } catch (error) {
      console.error('Error fetching timetables:', error);
    }
  };

  const loadTimetable = (timetable) => {
    setTimetableType(timetable.type);
    setTimetableData({
      name: timetable.name,
      timeSlots: timetable.timeSlots,
      activities: timetable.activities,
      constraints: []
    });
    setGeneratedTimetable(timetable.schedule);
    const detectedConflicts = detectConflicts(timetable.schedule);
    setConflicts(detectedConflicts);
    setCurrentStep(4);
    alert('Timetable loaded successfully!');
  };

  const deleteTimetable = async (id) => {
    if (!confirm('Are you sure you want to delete this timetable?')) return;

    try {
      await deleteDoc(doc(db, 'timetables', id));
      alert('Timetable deleted successfully!');
      fetchSavedTimetables();
    } catch (error) {
      console.error('Error deleting timetable:', error);
      alert('Failed to delete timetable.');
    }
  };

  const saveTimetable = async () => {
    const exportData = {
      name: timetableData.name,
      type: timetableType,
      schedule: generatedTimetable,
      activities: timetableData.activities,
      timeSlots: timetableData.timeSlots,
      userId: currentUser.uid,
      userEmail: currentUser.email,
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, 'timetables'), exportData);
      alert('Timetable saved to cloud successfully!');
      fetchSavedTimetables();
    } catch (error) {
      console.error('Error saving to cloud:', error);
      alert('Failed to save to cloud. Please check your internet connection.');
    }
  };

  if (authLoading) {
    return <LoadingScreen darkMode={darkMode} />;
  }

  if (!isAuthenticated) {
    return (
      <AuthPage
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        formData={formData}
        handleInputChange={handleInputChange}
        handleAuthSubmit={handleAuthSubmit}
        handleGoogleLogin={handleGoogleLogin}
        authErrors={authErrors}
        authLoading={authLoading}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        showSuccessAnimation={showSuccessAnimation}
      />
    );
  }

  return (
    <TimetableGenerator
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      timetableType={timetableType}
      setTimetableType={setTimetableType}
      showSuccessAnimation={showSuccessAnimation}
      timetableData={timetableData}
      setTimetableData={setTimetableData}
      currentActivity={currentActivity}
      setCurrentActivity={setCurrentActivity}
      generatedTimetable={generatedTimetable}
      conflicts={conflicts}
      optimizationSettings={optimizationSettings}
      setOptimizationSettings={setOptimizationSettings}
      handleTypeSelection={handleTypeSelection}
      addTimeSlot={addTimeSlot}
      removeTimeSlot={removeTimeSlot}
      addActivity={addActivity}
      removeActivity={removeActivity}
      togglePreference={togglePreference}
      generateTimetable={generateTimetable}
      regenerateTimetable={regenerateTimetable}
      exportTimetable={exportTimetable}
      saveTimetable={saveTimetable}
      resetGenerator={resetGenerator}
      getConflictIcon={getConflictIcon}
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      currentUser={currentUser}
      handleLogout={handleLogout}
      timetableTypes={timetableTypes}
      timeSlots={timeSlots}
      priorityLevels={priorityLevels}
      colors={colors}
      days={days}
      savedTimetables={savedTimetables}
      loadTimetable={loadTimetable}
      deleteTimetable={deleteTimetable}
      fetchSavedTimetables={fetchSavedTimetables}
    />
  );
};

export default IntegratedTimetableApp;