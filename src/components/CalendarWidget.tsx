'use client';

import { useState, useEffect } from 'react';
import { CalendarEvent } from '@/lib/calendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, endOfWeek, startOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, setMonth, setYear } from 'date-fns';

import './CalendarWidget.css';

interface CalendarWidgetProps {
    events: CalendarEvent[];
}

export default function CalendarWidget({ events }: CalendarWidgetProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
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

    const handleDayClick = (day: Date) => {
        setSelectedDate(day);
    };

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

    const filteredEvents = events.filter(e => isSameDay(new Date(e.start), selectedDate));

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
                    const isSelectedDay = isSameDay(day, selectedDate);
                    const dayEvents = events.filter(e => isSameDay(new Date(e.start), day));

                    return (
                        <div
                            key={i}
                            className={`cal-day ${!isSelectedMonth ? 'disabled' : ''} ${isToday ? 'today' : ''} ${isSelectedDay ? 'selected' : ''}`}
                            onClick={() => handleDayClick(day)}
                        >
                            <span className="cal-day-num">{format(day, dateFormat)}</span>
                            {dayEvents.length > 0 && <span className="cal-event-dot"></span>}
                        </div>
                    );
                })}
            </div>

            <div style={{ marginTop: '3rem', color: 'var(--text-primary)' }}>
                <h3 style={{ marginBottom: '1rem' }}>Events for {format(selectedDate, 'MMMM d, yyyy')}</h3>
                {filteredEvents.length > 0 ? (
                    <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {filteredEvents.map((evt, idx) => (
                            <li key={idx} style={{ background: 'var(--bg-surface-hover)', padding: '12px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                                    <span style={{ fontWeight: 500, wordBreak: 'break-word', lineHeight: '1.4' }}>{evt.title}</span>
                                    <span style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap', flexShrink: 0, marginTop: '2px' }}>
                                        {format(new Date(evt.start), 'h:mm a')}
                                    </span>
                                </div>
                                {evt.location && (
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                                        <span>📍</span> <span style={{ wordBreak: 'break-word' }}>{evt.location}</span>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p style={{ color: 'var(--text-secondary)' }}>No events scheduled.</p>
                )}
            </div>
        </div>
    );
}
