import CalendarWidget from '@/components/CalendarWidget';
import { getUpcomingEvents } from '@/lib/calendar';
import { getSetting } from '@/app/actions';

export default async function CalendarPage() {
    const calendarId = await getSetting('selected_calendar_id') || undefined;
    const events = await getUpcomingEvents(20, calendarId);

    return (
        <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto' }}>
            <h1 className="page-title" style={{ marginBottom: '2rem' }}>Calendar & Events</h1>
            <CalendarWidget events={events} />
        </div>
    );
}
