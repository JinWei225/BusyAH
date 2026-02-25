import type { Metadata } from 'next';
import './globals.css';
import { Calendar, CheckSquare, Clock } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'BusyAH',
  description: 'Premium personal productivity app with Events, Todos, and Deadlines.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="app-container">
          <aside className="sidebar">
            <h1>
              <span style={{ color: 'var(--text-primary)' }}>Busy</span>AH
            </h1>
            <nav>
              <Link href="/">
                <div className="nav-link" data-active="true">
                  <CheckSquare size={20} />
                  <span>Dashboard</span>
                </div>
              </Link>
              <Link href="/calendar">
                <div className="nav-link">
                  <Calendar size={20} />
                  <span>Calendar</span>
                </div>
              </Link>
              <Link href="/deadlines">
                <div className="nav-link">
                  <Clock size={20} />
                  <span>Deadlines</span>
                </div>
              </Link>
            </nav>
          </aside>
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
