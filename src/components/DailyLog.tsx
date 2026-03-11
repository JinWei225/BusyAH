'use client';

import React, { useState } from 'react';
import { createDailyLogEntry, toggleDailyLogEntry, deleteDailyLogEntry, updateDailyLogEntry } from '@/app/actions';
import { Check, Trash2, Circle } from 'lucide-react';
import './DailyLog.css';

type EntryType = 'task' | 'idea' | 'note';

interface DailyEntry {
    id: string;
    date: string;
    type: string;
    content: string;
    isCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface DailyLogProps {
    date: string;
    initialEntries: DailyEntry[];
}

export default function DailyLog({ date, initialEntries }: DailyLogProps) {
    const [entries, setEntries] = useState<DailyEntry[]>(initialEntries);
    const [inputValue, setInputValue] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey && inputValue.trim()) {
            e.preventDefault();
            let type: EntryType = 'note';
            let content = inputValue.trim();

            if (content.startsWith('[] ')) {
                type = 'task';
                content = content.substring(3);
            } else if (content.startsWith('/ ')) {
                type = 'task';
                content = content.substring(2);
            } else if (content.startsWith('- ')) {
                type = 'idea';
                content = content.substring(2);
            }

            const tempId = `temp-${Date.now()}`;
            const newEntry: DailyEntry = {
                id: tempId,
                date,
                type,
                content,
                isCompleted: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            setEntries(prev => [newEntry, ...prev]);
            setInputValue('');
            
            // Reset textarea height
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';

            setIsSaving(true);
            
            try {
                const realId = await createDailyLogEntry(date, type, content);
                setEntries(prev => prev.map(entry => entry.id === tempId ? { ...entry, id: realId } : entry));
            } catch (error) {
                console.error("Failed to save entry", error);
                setEntries(prev => prev.filter(entry => entry.id !== tempId));
            } finally {
                setIsSaving(false);
            }
        }
    };

    const handleToggle = async (id: string, currentStatus: boolean) => {
        const newStatus = !currentStatus;
        setEntries(prev => prev.map(entry => entry.id === id ? { ...entry, isCompleted: newStatus } : entry));
        await toggleDailyLogEntry(id, newStatus, date);
    };

    const handleDelete = async (id: string) => {
        setEntries(prev => prev.filter(entry => entry.id !== id));
        await deleteDailyLogEntry(id, date);
    };

    const handleContentBlur = async (id: string, newContent: string, oldContent: string) => {
        if (newContent.trim() !== oldContent.trim()) {
            setEntries(prev => prev.map(entry => entry.id === id ? { ...entry, content: newContent } : entry));
            await updateDailyLogEntry(id, newContent, date);
        }
    };

    const renderEntryIcon = (entry: DailyEntry) => {
        if (entry.type === 'task') {
            return (
                <button className={`entry-checkbox ${entry.isCompleted ? 'completed' : ''}`} onClick={() => handleToggle(entry.id, entry.isCompleted)}>
                    {entry.isCompleted && <Check size={14} strokeWidth={3} />}
                </button>
            );
        } else if (entry.type === 'idea') {
            return <div className="entry-bullet"><Circle size={6} fill="currentColor" /></div>;
        } else {
            return <div className="entry-note-spacer"></div>;
        }
    };

    return (
        <div className="daily-log">
            <div className="input-container">
                <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = `${target.scrollHeight}px`;
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Write something..."
                    className="daily-input"
                    disabled={isSaving && false} 
                    rows={1}
                />
            </div>

            <div className="entries-list">
                {entries.map(entry => (
                    <div key={entry.id} className={`entry-item ${entry.type} ${entry.type === 'task' && entry.isCompleted ? 'completed' : ''}`}>
                        <div className="entry-left">
                            {renderEntryIcon(entry)}
                            <textarea 
                                className="entry-content-input"
                                defaultValue={entry.content}
                                onBlur={(e) => handleContentBlur(entry.id, e.target.value, entry.content)}
                                onKeyDown={(e) => {
                                    if(e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        e.currentTarget.blur();
                                    }
                                }}
                                onInput={(e) => {
                                    const target = e.target as HTMLTextAreaElement;
                                    target.style.height = 'auto';
                                    target.style.height = `${target.scrollHeight}px`;
                                }}
                                ref={(el) => {
                                    if (el) {
                                        el.style.height = 'auto';
                                        el.style.height = `${el.scrollHeight}px`;
                                    }
                                }}
                                rows={1}
                            />
                        </div>
                        <button className="delete-btn" onClick={() => handleDelete(entry.id)}>
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>
            {entries.length === 0 && (
                <div className="empty-state">
                    <p>No entries for this day yet.</p>
                </div>
            )}
        </div>
    );
}
