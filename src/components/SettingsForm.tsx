'use client';

import { useState } from 'react';
import { Save, Info } from 'lucide-react';
import { updateSetting } from '@/app/actions';

interface SettingsFormProps {
    initialCalendarId: string;
}

export default function SettingsForm({ initialCalendarId }: SettingsFormProps) {
    const [calendarId, setCalendarId] = useState(initialCalendarId);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        try {
            await updateSetting('selected_calendar_id', calendarId);
            setMessage('Settings saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage('Failed to save settings.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="settings-container">
            <form onSubmit={handleSave} className="settings-form">
                <div className="settings-group">
                    <label htmlFor="calendar-id">Primary Google Calendar ID</label>
                    <input
                        id="calendar-id"
                        type="text"
                        className="input-field"
                        placeholder="e.g. yourname@gmail.com"
                        value={calendarId}
                        onChange={(e) => setCalendarId(e.target.value)}
                    />
                    <p className="settings-help">
                        <Info size={14} />
                        Enter the Calendar ID you want to display. If left empty, it will use the default from environment variables.
                    </p>
                </div>

                <button type="submit" className="btn btn-primary" disabled={saving}>
                    <Save size={18} /> {saving ? 'Saving...' : 'Save Settings'}
                </button>

                {message && (
                    <p className={`settings-message ${message.includes('success') ? 'success' : 'error'}`}>
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
}
