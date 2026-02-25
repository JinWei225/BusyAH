import TodoList from '@/components/TodoList';
import DeadlinesList from '@/components/DeadlinesList';
import CalendarWidget from '@/components/CalendarWidget';
import { getTodos, getDeadlines, getSetting } from '@/app/actions';
import { getUpcomingEvents } from '@/lib/calendar';

export default async function Home() {
  const todos = await getTodos();
  const deadlines = await getDeadlines();
  const calendarId = await getSetting('selected_calendar_id') || undefined;
  const events = await getUpcomingEvents(5, calendarId);

  const { db } = await import('@/lib/db');
  const { subtasks } = await import('@/lib/db/schema');
  const allSubtasks = await db.select().from(subtasks);

  return (
    <div className="dashboard-grid">
      <div className="main-column">
        <TodoList initialTodos={todos} allSubtasks={allSubtasks} />
      </div>
      <div className="side-column">
        <CalendarWidget events={events} />
        <DeadlinesList initialDeadlines={deadlines} />
      </div>
    </div>
  );
}
