'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Clock, MoreVertical, Edit2, X, Check } from 'lucide-react';
import { createDeadline, deleteDeadline, updateDeadline } from '@/app/actions';
import './DeadlinesList.css';

type Deadline = any;

interface DeadlinesListProps {
    initialDeadlines: Deadline[];
}

export default function DeadlinesList({ initialDeadlines }: DeadlinesListProps) {
    const [deadlines, setDeadlines] = useState<Deadline[]>(initialDeadlines);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [now, setNow] = useState(new Date());
    const [mounted, setMounted] = useState(false);

    // Edit states
    const [editingDeadlineId, setEditingDeadlineId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDate, setEditDate] = useState('');
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
        const interval = setInterval(() => setNow(new Date()), 60000); // update every minute
        return () => clearInterval(interval);
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !targetDate) return;
        setLoading(true);
        const newDeadline = await createDeadline(title, description, new Date(targetDate));
        if (newDeadline) {
            setDeadlines(prev => [newDeadline, ...prev]);
        }
        setTitle('');
        setDescription('');
        setTargetDate('');
        setLoading(false);
    };

    const handleUpdate = async (id: string) => {
        if (!editTitle.trim() || !editDate) return;
        setLoading(true);
        await updateDeadline(id, editTitle, null, new Date(editDate));
        setDeadlines(prev => prev.map(d =>
            d.id === id ? { ...d, title: editTitle, targetDate: new Date(editDate).toISOString() } : d
        ));
        setEditingDeadlineId(null);
        setLoading(false);
    };

    const toggleMenu = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveMenuId(activeMenuId === id ? null : id);
    };

    const calculateRemaining = (target: Date) => {
        const diff = target.getTime() - now.getTime();
        if (diff <= 0) return 'Deadline passed!';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        return `${days}d ${hours}h ${minutes}m left`;
    };

    if (!mounted) return <div className="deadlines-widget" style={{ opacity: 0 }}></div>;

    return (
        <div className="deadlines-widget" suppressHydrationWarning onClick={() => setActiveMenuId(null)}>
            <div className="deadline-section">
                <h3 className="section-title">Add New Deadline</h3>
                <form onSubmit={handleAdd} className="add-deadline-form">
                    <input
                        type="text"
                        className="input-field mb-2"
                        placeholder="Deadline title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                    />
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
                        <input
                            type="datetime-local"
                            className="input-field"
                            value={targetDate}
                            onChange={e => setTargetDate(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            <Plus size={18} /> Add
                        </button>
                    </div>
                </form>
            </div>

            <div className="deadline-section" style={{ marginTop: '3rem' }}>
                <h3 className="section-title">Active Deadlines</h3>
                <div className="deadline-items">
                    {deadlines.length === 0 && (
                        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No deadlines set. You're all caught up!</p>
                    )}
                    {deadlines.map(deadline => {
                        const isEditing = editingDeadlineId === deadline.id;
                        const isMenuOpen = activeMenuId === deadline.id;

                        return (
                            <div key={deadline.id} className={`deadline-card ${isEditing ? 'editing' : ''}`}>
                                <div className="deadline-info">
                                    {isEditing ? (
                                        <div className="edit-fields">
                                            <input
                                                autoFocus
                                                className="edit-input"
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                style={{ marginBottom: '8px' }}
                                            />
                                            <input
                                                type="datetime-local"
                                                className="edit-input"
                                                value={editDate}
                                                onChange={(e) => setEditDate(e.target.value)}
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <h3 className="deadline-title">{deadline.title}</h3>
                                            <div className="countdown-badge">
                                                <Clock size={14} />
                                                <span>{calculateRemaining(new Date(deadline.targetDate))}</span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="deadline-actions">
                                    {isEditing ? (
                                        <div className="edit-actions">
                                            <button className="btn-icon success" onClick={() => handleUpdate(deadline.id)}>
                                                <Check size={18} />
                                            </button>
                                            <button className="btn-icon" onClick={() => setEditingDeadlineId(null)}>
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="menu-container">
                                            <button className="btn-icon" onClick={(e) => toggleMenu(deadline.id, e)}>
                                                <MoreVertical size={18} />
                                            </button>
                                            {isMenuOpen && (
                                                <div className="dropdown-menu">
                                                    <button onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingDeadlineId(deadline.id);
                                                        setEditTitle(deadline.title);
                                                        // Convert Date to string for datetime-local input
                                                        const date = new Date(deadline.targetDate);
                                                        const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                                                        setEditDate(localDate);
                                                        setActiveMenuId(null);
                                                    }}>
                                                        <Edit2 size={14} /> Edit
                                                    </button>
                                                    <button className="danger" onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteDeadline(deadline.id);
                                                        setDeadlines(prev => prev.filter(d => d.id !== deadline.id));
                                                        setActiveMenuId(null);
                                                    }}>
                                                        <Trash2 size={14} /> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
