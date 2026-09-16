'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import LoadingSkeleton from '@/components/loading-skeleton';
import EmptyState from '@/components/empty-state';
import toast from 'react-hot-toast';
import { formatDate } from '@/lib/date-utils';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  capacity: number;
  status: string;
  club: { name: string };
  _count?: {
    registrations: number;
    waitlist: number;
  };
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data.data || []);
      } else {
        toast.error('Failed to load events');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const now = new Date();
  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    if (filter === 'upcoming') return eventDate > now;
    if (filter === 'past') return eventDate <= now;
    return true;
  });

  return (
    <>
      <Navbar />
      <Sidebar>
        <main className="p-8">
          <h1 className="text-4xl font-bold mb-2">Events</h1>
          <p className="text-gray-600 dark:text-dark-secondary mb-8">
            Discover and register for club events
          </p>

          {/* Filters */}
          <div className="flex gap-4 mb-8">
            {(['all', 'upcoming', 'past'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === f
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 dark:bg-dark-card text-gray-900 dark:text-dark-primary hover:bg-gray-300'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <LoadingSkeleton />
          ) : filteredEvents.length === 0 ? (
            <EmptyState
              icon="📅"
              title="No Events Found"
              description="No events match your filter criteria."
            />
          ) : (
            <div className="space-y-6">
              {filteredEvents.map((event) => (
                <Link key={event.id} href={`/events/${event.id}`}>
                  <div className="glass-card hover:shadow-lg transition cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
                        <p className="text-gray-600 dark:text-dark-secondary">
                          {event.club.name}
                        </p>
                      </div>
                      <span className="badge badge-primary">{event.status}</span>
                    </div>

                    <p className="text-gray-600 dark:text-dark-secondary mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="grid md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">📅 Date</p>
                        <p className="font-semibold">{formatDate(event.date)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">🕐 Time</p>
                        <p className="font-semibold">
                          {new Date(event.startTime).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">📍 Venue</p>
                        <p className="font-semibold">{event.venue || 'TBA'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">👥 Capacity</p>
                        <p className="font-semibold">
                          {event._count?.registrations || 0}/{event.capacity}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </Sidebar>
    </>
  );
}
