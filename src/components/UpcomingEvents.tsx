'use client';

import { format } from 'date-fns';
import { Calendar as CalIcon } from 'lucide-react';
import { CalendarEvent } from '@/lib/calendar';
import './UpcomingEvents.css';

interface UpcomingEventsProps {
    events: CalendarEvent[];
    title?: string;
    maxHeight?: string;
}

export default function UpcomingEvents({ events, title = "Upcoming Events", maxHeight }: UpcomingEventsProps) {
    return (
        <div className="upcoming-events-widget">
            <h3 className="widget-title">
                <CalIcon size={18} /> {title}
            </h3>
            <div className="events-list" style={{ maxHeight }}>
                {events.length === 0 ? (
                    <p className="no-events">No events found.</p>
                ) : (
                    events.slice(0, 5).map(event => (
                        <div key={event.id} className="event-item">
                            <div className="event-date">
                                <span className="event-day">{format(new Date(event.start), 'dd')}</span>
                                <span className="event-month">{format(new Date(event.start), 'MMM')}</span>
                            </div>
                            <div className="event-details">
                                <h4 className="event-name">{event.title}</h4>
                                {event.location && (
                                    <p className="event-location" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                        📍 {event.location}
                                    </p>
                                )}
                                <p className="event-time" style={{ marginTop: event.location ? '4px' : '0' }}>
                                    {format(new Date(event.start), 'p')} - {format(new Date(event.end), 'p')}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
