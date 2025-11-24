import React from 'react';
import { CheckCircle } from 'lucide-react';

const StepIndicator = ({ currentStep, darkMode }) => {
    return (
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
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${currentStep >= step.num
                                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-110'
                                : darkMode
                                    ? 'bg-gray-700 text-gray-400'
                                    : 'bg-gray-200 text-gray-600'
                                }`}>
                                {currentStep > step.num ? <CheckCircle className="w-6 h-6" /> : step.num}
                            </div>
                            <span className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap ${darkMode ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                {step.label}
                            </span>
                        </div>
                        {index < 3 && (
                            <div className={`w-16 h-1 transition-all duration-300 ${currentStep > step.num
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
    );
};

export default StepIndicator;
