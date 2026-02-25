import CalendarWidget from '@/components/CalendarWidget';
import { getUpcomingEvents } from '@/lib/calendar';

export default async function CalendarPage() {
    const events = await getUpcomingEvents(20);

    return (
        <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto' }}>
            <h1 className="page-title" style={{ marginBottom: '2rem' }}>Calendar & Events</h1>
            <CalendarWidget events={events} />
        </div>
    );
}
