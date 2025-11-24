import React from 'react';
import { Sparkles, LogIn, UserPlus, User, Mail, Lock, Eye, EyeOff, Sun, Moon } from 'lucide-react';

const AuthPage = ({
    isLogin,
    setIsLogin,
    formData,
    handleInputChange,
    handleAuthSubmit,
    handleGoogleLogin,
    authErrors,
    authLoading,
    darkMode,
    setDarkMode,
    showPassword,
    setShowPassword,
    showSuccessAnimation
}) => {
    return (
        <div className={`min-h-screen flex items-center justify-center transition-all duration-500 ${darkMode
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
            : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
            }`}>
            {/* Dark Mode Toggle */}
            <div className="absolute top-4 right-4 z-50">
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${darkMode
                        ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700 shadow-lg shadow-yellow-400/20'
                        : 'bg-white text-gray-800 hover:bg-gray-100 shadow-lg shadow-gray-400/20'
                        }`}
                >
                    {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                </button>
            </div>

            <div className={`w-full max-w-md p-8 m-4 rounded-2xl shadow-2xl transition-all duration-300 ${darkMode
                ? 'bg-gray-800/90 backdrop-blur-lg border border-gray-700'
                : 'bg-white/90 backdrop-blur-lg'
                } ${showSuccessAnimation ? 'transform scale-105' : ''}`}>
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <Sparkles className={`w-8 h-8 ${darkMode ? 'text-purple-400' : 'text-purple-600'} animate-pulse`} />
                        <h1 className={`text-3xl font-bold ml-2 bg-gradient-to-r ${darkMode
                            ? 'from-blue-400 via-purple-400 to-pink-400'
                            : 'from-blue-600 via-purple-600 to-pink-600'
                            } bg-clip-text text-transparent`}>
                            Smart Timetable
                        </h1>
                    </div>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {isLogin ? 'Welcome back!' : 'Create your account'}
                    </p>
                </div>

                {/* Toggle Buttons */}
                <div className={`flex rounded-lg p-1 mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <button
                        onClick={() => {
                            setIsLogin(true);
                        }}
                        className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-200 ${isLogin
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                            : darkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}
                    >
                        <LogIn className="w-4 h-4 inline mr-2" />
                        Login
                    </button>
                    <button
                        onClick={() => {
                            setIsLogin(false);
                        }}
                        className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-200 ${!isLogin
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                            : darkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}
                    >
                        <UserPlus className="w-4 h-4 inline mr-2" />
                        Register
                    </button>
                </div>

                {/* Form Fields */}
                <form onSubmit={handleAuthSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Full Name
                            </label>
                            <div className="relative">
                                <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'
                                    }`} />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-4 py-3 rounded-lg transition-all duration-200 ${darkMode
                                        ? 'bg-gray-700 text-white border border-gray-600 focus:border-purple-400'
                                        : 'bg-white text-gray-800 border-2 border-gray-200 focus:border-blue-500'
                                        } focus:ring-4 focus:ring-opacity-20 focus:ring-blue-500 ${authErrors.name ? 'border-red-500' : ''
                                        }`}
                                    placeholder="Enter your full name"
                                />
                            </div>
                            {authErrors.name && <p className="text-red-500 text-sm mt-1">{authErrors.name}</p>}
                        </div>
                    )}

                    <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'
                                }`} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full pl-10 pr-4 py-3 rounded-lg transition-all duration-200 ${darkMode
                                    ? 'bg-gray-700 text-white border border-gray-600 focus:border-purple-400'
                                    : 'bg-white text-gray-800 border-2 border-gray-200 focus:border-blue-500'
                                    } focus:ring-4 focus:ring-opacity-20 focus:ring-blue-500 ${authErrors.email ? 'border-red-500' : ''
                                    }`}
                                placeholder="Enter your email"
                            />
                        </div>
                        {authErrors.email && <p className="text-red-500 text-sm mt-1">{authErrors.email}</p>}
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Password
                        </label>
                        <div className="relative">
                            <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'
                                }`} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className={`w-full pl-10 pr-12 py-3 rounded-lg transition-all duration-200 ${darkMode
                                    ? 'bg-gray-700 text-white border border-gray-600 focus:border-purple-400'
                                    : 'bg-white text-gray-800 border-2 border-gray-200 focus:border-blue-500'
                                    } focus:ring-4 focus:ring-opacity-20 focus:ring-blue-500 ${authErrors.password ? 'border-red-500' : ''
                                    }`}
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {authErrors.password && <p className="text-red-500 text-sm mt-1">{authErrors.password}</p>}
                    </div>

                    {!isLogin && (
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'
                                    }`} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-4 py-3 rounded-lg transition-all duration-200 ${darkMode
                                        ? 'bg-gray-700 text-white border border-gray-600 focus:border-purple-400'
                                        : 'bg-white text-gray-800 border-2 border-gray-200 focus:border-blue-500'
                                        } focus:ring-4 focus:ring-opacity-20 focus:ring-blue-500 ${authErrors.confirmPassword ? 'border-red-500' : ''
                                        }`}
                                    placeholder="Confirm your password"
                                />
                            </div>
                            {authErrors.confirmPassword && <p className="text-red-500 text-sm mt-1">{authErrors.confirmPassword}</p>}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {authLoading ? 'Please wait...' : (isLogin ? 'Login' : 'Create Account')}
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className={`w-full border-t ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className={`px-2 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={authLoading}
                        className={`w-full py-3 flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 border-2 ${darkMode
                            ? 'bg-white text-gray-800 border-white hover:bg-gray-100'
                            : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Google
                    </button>
                </form>

                {isLogin && (
                    <div className="mt-4 text-center">
                        <button className={`text-sm ${darkMode ? 'text-purple-400 hover:text-purple-300' : 'text-blue-600 hover:text-blue-700'}`}>
                            Forgot password?
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthPage;
