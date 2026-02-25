'use client';

import { useState, useEffect } from 'react';
import { CalendarEvent } from '@/lib/calendar';
import { ChevronLeft, ChevronRight, Calendar as CalIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, endOfWeek, startOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, setMonth, setYear } from 'date-fns';
import './CalendarWidget.css';

interface CalendarWidgetProps {
    events: CalendarEvent[];
}

export default function CalendarWidget({ events }: CalendarWidgetProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentDate(setMonth(currentDate, parseInt(e.target.value)));
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentDate(setYear(currentDate, parseInt(e.target.value)));
    };

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

    if (!mounted) return <div className="calendar-widget" style={{ opacity: 0 }}></div>;

    return (
        <div className="calendar-widget" suppressHydrationWarning>
            <div className="calendar-controls">
                <div className="cal-selectors">
                    <select value={currentDate.getMonth()} onChange={handleMonthChange} className="cal-select">
                        {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
                    </select>
                    <select value={currentDate.getFullYear()} onChange={handleYearChange} className="cal-select">
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
                <div className="cal-arrows">
                    <button className="btn-icon" onClick={prevMonth}><ChevronLeft size={20} /></button>
                    <button className="btn-icon" onClick={nextMonth}><ChevronRight size={20} /></button>
                </div>
            </div>

            <div className="month-grid">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="cal-header-day">{d}</div>
                ))}
                {days.map((day, i) => {
                    const isSelectedMonth = isSameMonth(day, monthStart);
                    const isToday = isSameDay(day, new Date());
                    const dayEvents = events.filter(e => isSameDay(new Date(e.start), day));

                    return (
                        <div
                            key={i}
                            className={`cal-day ${!isSelectedMonth ? 'disabled' : ''} ${isToday ? 'today' : ''}`}
                        >
                            <span className="cal-day-num">{format(day, dateFormat)}</span>
                            {dayEvents.length > 0 && <span className="cal-event-dot"></span>}
                        </div>
                    );
                })}
            </div>

            <div className="events-list-section mt-4">
                <h3 className="events-title"><CalIcon size={18} /> Upcoming Events</h3>
                <div className="events-list">
                    {events.length === 0 ? (
                        <p className="no-events">No upcoming events.</p>
                    ) : (
                        events.map(event => (
                            <div key={event.id} className="event-item">
                                <div className="event-date">
                                    <span className="event-day">{format(new Date(event.start), 'dd')}</span>
                                    <span className="event-month">{format(new Date(event.start), 'MMM')}</span>
                                </div>
                                <div className="event-details">
                                    <h4 className="event-name">{event.title}</h4>
                                    <p className="event-time">{format(new Date(event.start), 'p')} - {format(new Date(event.end), 'p')}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
