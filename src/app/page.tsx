import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function Home() {
  // Use user's local timezone offset or default to UTC if on server.
  // A safer approach on the server without knowledge of client timezone is to use UTC or a fixed offset.
  // Since we know the user is in +08:00 based on previous context, let's format it simply based on UTC for now
  // Or better, let's just generate a client-side redirect if we want local time, but we can do it on the server
  // by formatting the current Date to ISO string.
  
  const today = new Date();
  // Adjust to UTC+8 if we want a static server offset, or let's just use UTC as a baseline
  const offset = 8 * 60; // 8 hours in minutes
  const localDate = new Date(today.getTime() + offset * 60 * 1000);
  
  const dateString = localDate.toISOString().split('T')[0];
  
  redirect(`/day/${dateString}`);
}
