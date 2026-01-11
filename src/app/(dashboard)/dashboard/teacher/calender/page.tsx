"use client";

import { ChevronLeft, ChevronRight, Clock, Users, BookOpen } from 'lucide-react';
import React, { JSX, useState } from 'react';

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Sample events data
    const events = [
        { id: 1, title: 'Math Test - Grade 8A', date: '2025-07-21', time: '09:00', type: 'exam' },
        { id: 2, title: 'Parent-Teacher Conference', date: '2025-07-22', time: '14:30', type: 'meeting' },
        { id: 3, title: 'Science Lab - Grade 7B', date: '2025-07-23', time: '11:00', type: 'class' },
        { id: 4, title: 'Staff Meeting', date: '2025-07-24', time: '15:30', type: 'meeting' },
        { id: 5, title: 'English Essay Due - Grade 9A', date: '2025-07-25', time: '23:59', type: 'deadline' },
        { id: 6, title: 'Field Trip - Science Museum', date: '2025-07-28', time: '08:00', type: 'event' },
    ];

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    const getEventsForDate = (date) => {
        const dateStr = formatDate(date);
        return events.filter(event => event.date === dateStr);
    };

    const navigateMonth = (direction) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + direction);
            return newDate;
        });
    };

    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days: JSX.Element[] = [];

        // Empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-24"></div>);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dayEvents = getEventsForDate(date);
            const isSelected = formatDate(date) === formatDate(selectedDate);
            const isToday = formatDate(date) === formatDate(new Date());

            days.push(
                <div
                    key={day}
                    onClick={() => setSelectedDate(date)}
                    className={`h-24 p-2 border border-gray-200 cursor-pointer hover:bg-blue-50 transition-colors ${isSelected ? 'bg-blue-100 border-blue-300' : ''
                        } ${isToday ? 'ring-2 ring-blue-400' : ''}`}
                >
                    <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                        {day}
                    </div>
                    <div className="mt-1 space-y-1">
                        {dayEvents.slice(0, 2).map(event => (
                            <div
                                key={event.id}
                                className={`text-xs p-1 rounded truncate ${event.type === 'exam' ? 'bg-red-100 text-red-800' :
                                    event.type === 'meeting' ? 'bg-yellow-100 text-yellow-800' :
                                        event.type === 'class' ? 'bg-blue-100 text-blue-800' :
                                            event.type === 'deadline' ? 'bg-orange-100 text-orange-800' :
                                                'bg-green-100 text-green-800'
                                    }`}
                            >
                                {event.title}
                            </div>
                        ))}
                        {dayEvents.length > 2 && (
                            <div className="text-xs text-gray-500">
                                +{dayEvents.length - 2} more
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return days;
    };

    const selectedDateEvents = getEventsForDate(selectedDate);

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Calendar</h2>
                {/* <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Plus size={20} />
                    Add Event
                </button> */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar Grid */}
                <div className="lg:col-span-2">
                    <div className="bg-gray-50 rounded-lg p-4">
                        {/* Calendar Header */}
                        <div className="flex justify-between items-center mb-4">
                            <button
                                onClick={() => navigateMonth(-1)}
                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </h3>
                            <button
                                onClick={() => navigateMonth(1)}
                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        {/* Day Headers */}
                        <div className="grid grid-cols-7 gap-px mb-2">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
                            {renderCalendarDays()}
                        </div>
                    </div>
                </div>

                {/* Events Sidebar */}
                <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">
                            {selectedDate.toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </h4>

                        {selectedDateEvents.length > 0 ? (
                            <div className="space-y-2">
                                {selectedDateEvents.map(event => (
                                    <div key={event.id} className="border border-gray-200 rounded-lg p-3 bg-white">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h5 className="font-medium text-gray-900 text-sm">{event.title}</h5>
                                                <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                                                    <Clock size={12} />
                                                    {event.time}
                                                </div>
                                            </div>
                                            <div className={`px-2 py-1 text-xs rounded-full ${event.type === 'exam' ? 'bg-red-100 text-red-800' :
                                                event.type === 'meeting' ? 'bg-yellow-100 text-yellow-800' :
                                                    event.type === 'class' ? 'bg-blue-100 text-blue-800' :
                                                        event.type === 'deadline' ? 'bg-orange-100 text-orange-800' :
                                                            'bg-green-100 text-green-800'
                                                }`}>
                                                {event.type}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">No events scheduled</p>
                        )}
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">This Week</h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <BookOpen size={16} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">12 Classes</p>
                                    <p className="text-xs text-gray-500">Scheduled this week</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <Users size={16} className="text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">3 Meetings</p>
                                    <p className="text-xs text-gray-500">Parent conferences</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <Clock size={16} className="text-red-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">2 Deadlines</p>
                                    <p className="text-xs text-gray-500">Assignments due</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}