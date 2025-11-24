import React from 'react';

const TypeSelection = ({ timetableTypes, handleTypeSelection, darkMode }) => {
    return (
        <div className="animate-fadeIn">
            <h2 className={`text-3xl font-bold mb-8 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Choose Your Timetable Type
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
                {timetableTypes.map((type) => (
                    <div
                        key={type.id}
                        onClick={() => handleTypeSelection(type.id)}
                        className={`relative overflow-hidden rounded-xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${darkMode
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
    );
};

export default TypeSelection;
