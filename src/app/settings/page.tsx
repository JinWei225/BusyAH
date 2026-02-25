import SettingsForm from '@/components/SettingsForm';
import { getSetting } from '@/app/actions';

export default async function SettingsPage() {
    const calendarId = await getSetting('selected_calendar_id') || '';

    return (
        <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto' }}>
            <h1 className="page-title">Settings</h1>
            <p className="page-subtitle">Manage your application configurations.</p>

            <SettingsForm initialCalendarId={calendarId} />
        </div>
    );
}
