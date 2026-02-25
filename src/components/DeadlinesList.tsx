'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Clock } from 'lucide-react';
import { createDeadline, deleteDeadline } from '@/app/actions';
import './DeadlinesList.css';

type Deadline = any;

interface DeadlinesListProps {
    initialDeadlines: Deadline[];
}

export default function DeadlinesList({ initialDeadlines }: DeadlinesListProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [now, setNow] = useState(new Date());
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const interval = setInterval(() => setNow(new Date()), 60000); // update every minute
        return () => clearInterval(interval);
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !targetDate) return;
        setLoading(true);
        await createDeadline(title, description, new Date(targetDate));
        setTitle('');
        setDescription('');
        setTargetDate('');
        setLoading(false);
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
        <div className="deadlines-widget" suppressHydrationWarning>
            <div className="widget-header">
                <h2 className="widget-title">Deadlines</h2>
            </div>

            <form onSubmit={handleAdd} className="add-deadline-form">
                <input
                    type="text"
                    className="input-field mb-2"
                    placeholder="Deadline title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                />
                <input
                    type="datetime-local"
                    className="input-field mb-2"
                    value={targetDate}
                    onChange={e => setTargetDate(e.target.value)}
                    required
                />
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
                    <Plus size={18} /> Add Deadline
                </button>
            </form>

            <div className="deadline-items">
                {initialDeadlines.map(deadline => (
                    <div key={deadline.id} className="deadline-card">
                        <div className="deadline-info">
                            <h3 className="deadline-title">{deadline.title}</h3>
                            <div className="countdown-badge">
                                <Clock size={14} />
                                <span>{calculateRemaining(new Date(deadline.targetDate))}</span>
                            </div>
                        </div>
                        <button className="btn-icon danger" onClick={() => deleteDeadline(deadline.id)}>
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
