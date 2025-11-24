import React from 'react';
import { Calendar, Download, Trash2, Clock, User, Printer } from 'lucide-react';

const SavedTimetables = ({ savedTimetables, loadTimetable, deleteTimetable, darkMode }) => {
    const formatDate = (timestamp) => {
        if (!timestamp) return 'Unknown date';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'school':
            case 'college':
                return <Calendar className="w-5 h-5" />;
            case 'personal':
                return <User className="w-5 h-5" />;
            case 'work':
                return <Clock className="w-5 h-5" />;
            default:
                return <Calendar className="w-5 h-5" />;
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (savedTimetables.length === 0) {
        return (
            <div className="text-center py-12">
                <Calendar className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    No Saved Timetables
                </h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Create and save a timetable to see it here
                </p>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
                <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    My Saved Timetables
                </h2>
                <button
                    onClick={handlePrint}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${darkMode
                            ? 'bg-gray-700 text-white hover:bg-gray-600'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                >
                    <Printer className="w-4 h-4" />
                    Print / Save PDF
                </button>
            </div>

            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .printable-table, .printable-table * {
                        visibility: visible;
                    }
                    .printable-table {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    .no-print {
                        display: none !important;
                    }
                }
            `}</style>

            <div className={`overflow-hidden rounded-xl shadow-lg printable-table ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className={`${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-50 text-gray-700'} text-left`}>
                                <th className="p-4 font-semibold">Name</th>
                                <th className="p-4 font-semibold">Type</th>
                                <th className="p-4 font-semibold">Date Created</th>
                                <th className="p-4 font-semibold">Details</th>
                                <th className="p-4 font-semibold text-right no-print">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {savedTimetables.map((timetable) => (
                                <tr
                                    key={timetable.id}
                                    className={`transition-colors duration-150 ${darkMode
                                            ? 'text-gray-300 hover:bg-gray-700/50'
                                            : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <td className="p-4 font-medium">
                                        {timetable.name || 'Untitled Timetable'}
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {getTypeIcon(timetable.type)}
                                            {timetable.type}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm">
                                        {formatDate(timetable.createdAt)}
                                    </td>
                                    <td className="p-4 text-sm">
                                        {timetable.activities?.length || 0} activities • {timetable.timeSlots?.length || 0} slots
                                    </td>
                                    <td className="p-4 text-right no-print">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => loadTimetable(timetable)}
                                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors dark:hover:bg-blue-900/20"
                                                title="Load Timetable"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteTimetable(timetable.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors dark:hover:bg-red-900/20"
                                                title="Delete Timetable"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SavedTimetables;
