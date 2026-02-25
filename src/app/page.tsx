import TodoList from '@/components/TodoList';
import UpcomingEvents from '@/components/UpcomingEvents';
import { getTodos, getSetting } from '@/app/actions';
import { getUpcomingEvents } from '@/lib/calendar';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const todos = await getTodos();
  const calendarId = await getSetting('selected_calendar_id') || undefined;
  const events = await getUpcomingEvents(10, calendarId);

  const { db } = await import('@/lib/db');
  const { subtasks } = await import('@/lib/db/schema');
  const allSubtasks = await db.select().from(subtasks);

  return (
    <div className="dashboard-grid">
      <div className="main-column">
        <TodoList initialTodos={todos} allSubtasks={allSubtasks} />
      </div>
      <div className="side-column">
        <UpcomingEvents events={events} maxHeight="calc(100vh - 200px)" />
      </div>
    </div>
  );
}
