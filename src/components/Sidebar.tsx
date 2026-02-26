'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, CheckSquare, Clock, Settings, RefreshCw } from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <aside className="sidebar">
            <h1>
                <span style={{ color: 'var(--text-primary)' }}>Busy</span>AH
            </h1>
            <nav>
                <Link href="/">
                    <div className="nav-link" data-active={pathname === '/' ? 'true' : 'false'}>
                        <CheckSquare size={20} />
                        <span>Dashboard</span>
                    </div>
                </Link>
                <Link href="/calendar">
                    <div className="nav-link" data-active={pathname === '/calendar' ? 'true' : 'false'}>
                        <Calendar size={20} />
                        <span>Calendar</span>
                    </div>
                </Link>
                <Link href="/deadlines">
                    <div className="nav-link" data-active={pathname === '/deadlines' ? 'true' : 'false'}>
                        <Clock size={20} />
                        <span>Deadlines</span>
                    </div>
                </Link>
                <Link href="/settings">
                    <div className="nav-link" data-active={pathname === '/settings' ? 'true' : 'false'}>
                        <Settings size={20} />
                        <span>Settings</span>
                    </div>
                </Link>

                <div className="sidebar-divider" />

                <button className="nav-link sync-btn" onClick={handleRefresh} style={{ border: 'none', background: 'none', width: '100%', cursor: 'pointer' }}>
                    <RefreshCw size={20} />
                    <span>Sync</span>
                </button>
            </nav>
        </aside>
    );
}
