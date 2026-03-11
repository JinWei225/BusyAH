import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import { getSetting } from '@/app/actions';

export const metadata: Metadata = {
  title: 'BusyAH',
  description: 'Premium personal productivity app with Events, Todos, and Deadlines.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = await getSetting('theme') || 'dark';

  return (
    <html lang="en">
      <body className={theme === 'light' ? 'light-theme' : ''}>
        <div className="app-container">
          <Sidebar />
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
