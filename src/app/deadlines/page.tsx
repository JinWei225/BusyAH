import DeadlinesList from '@/components/DeadlinesList';
import { getDeadlines } from '@/app/actions';

export const dynamic = 'force-dynamic';

export default async function DeadlinesPage() {
    const deadlines = await getDeadlines();

    return (
        <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto' }}>
            <h1 className="page-title" style={{ marginBottom: '2rem', textAlign: 'center' }}>Deadlines Manager</h1>
            <DeadlinesList initialDeadlines={deadlines} />
        </div>
    );
}
