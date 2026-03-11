'use client';

import { useState } from 'react';
import { Save, Info, Moon, Sun } from 'lucide-react';
import { updateSetting } from '@/app/actions';

interface SettingsFormProps {
    initialCalendarId: string;
    initialTheme: string;
}

export default function SettingsForm({ initialCalendarId, initialTheme }: SettingsFormProps) {
    const [calendarId, setCalendarId] = useState(initialCalendarId);
    const [theme, setTheme] = useState(initialTheme);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        try {
            await updateSetting('selected_calendar_id', calendarId);
            await updateSetting('theme', theme);
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

                <div className="settings-group">
                    <label>Theme Preference</label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            type="button"
                            className={`btn ${theme === 'dark' ? 'btn-primary' : ''}`}
                            onClick={() => setTheme('dark')}
                            style={{ flex: 1, justifyContent: 'center' }}
                        >
                            <Moon size={18} /> Dark Theme
                        </button>
                        <button
                            type="button"
                            className={`btn ${theme === 'light' ? 'btn-primary' : ''}`}
                            onClick={() => setTheme('light')}
                            style={{ flex: 1, justifyContent: 'center' }}
                        >
                            <Sun size={18} /> Paper Light Theme
                        </button>
                    </div>
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
