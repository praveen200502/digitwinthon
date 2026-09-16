'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import LoadingSkeleton from '@/components/loading-skeleton';
import Tabs from '@/components/tabs';
import toast from 'react-hot-toast';
import { formatDate, formatTime } from '@/lib/date-utils';

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
  registrations: any[];
  attendance: any[];
  feedback: any[];
}

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.id as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/events/${eventId}`);
      if (response.ok) {
        const data = await response.json();
        setEvent(data.data);
        checkRegistration(data.data);
      } else {
        toast.error('Failed to load event');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const checkRegistration = (eventData: Event) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isReg = eventData.registrations?.some((r) => r.userId === user.id);
    setIsRegistered(!!isReg);
  };

  const handleRegister = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      const response = await fetch(`/api/events/${eventId}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(
          data.data.status === 'registered'
            ? 'Successfully registered for event!'
            : 'Added to waitlist!'
        );
        loadEvent();
      } else {
        toast.error('Failed to register');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  if (loading) return <LoadingSkeleton />;

  if (!event) {
    return (
      <>
        <Navbar />
        <Sidebar>
          <div className="p-8 text-center">Event not found</div>
        </Sidebar>
      </>
    );
  }

  const registrationCount = event.registrations?.length || 0;
  const attendanceCount = event.attendance?.length || 0;
  const spotsAvailable = Math.max(0, event.capacity - registrationCount);

  return (
    <>
      <Navbar />
      <Sidebar>
        <main className="p-8">
          {/* Event Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
                <p className="text-gray-600 dark:text-dark-secondary text-lg">
                  {event.club.name}
                </p>
              </div>
              {!isRegistered && (
                <button onClick={handleRegister} className="btn-primary">
                  Register Now
                </button>
              )}
              {isRegistered && (
                <span className="badge badge-success">Registered</span>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="glass-card">
                <p className="text-gray-600 dark:text-dark-secondary text-sm">Date & Time</p>
                <p className="font-semibold mt-1">
                  {formatDate(event.date)} | {formatTime(event.startTime)} -{' '}
                  {formatTime(event.endTime)}
                </p>
              </div>
              <div className="glass-card">
                <p className="text-gray-600 dark:text-dark-secondary text-sm">Venue</p>
                <p className="font-semibold mt-1">{event.venue}</p>
              </div>
            </div>

            {event.description && (
              <div className="glass-card mb-6">
                <p className="text-gray-600 dark:text-dark-secondary text-sm mb-2">
                  Description
                </p>
                <p>{event.description}</p>
              </div>
            )}
          </div>

          {/* Tabs */}
          <Tabs
            tabs={[
              { label: 'Overview', value: 'overview', icon: '📋' },
              { label: 'Registrations', value: 'registrations', icon: '📝' },
              { label: 'Attendance', value: 'attendance', icon: '✅' },
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          >
            {activeTab === 'overview' && (
              <div className="grid md:grid-cols-3 gap-6">
                <div className="glass-card">
                  <h3 className="font-semibold mb-2">Capacity</h3>
                  <p className="text-3xl font-bold">{event.capacity}</p>
                </div>
                <div className="glass-card">
                  <h3 className="font-semibold mb-2">Registered</h3>
                  <p className="text-3xl font-bold">{registrationCount}</p>
                </div>
                <div className="glass-card">
                  <h3 className="font-semibold mb-2">Available Spots</h3>
                  <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    {spotsAvailable}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'registrations' && (
              <div className="space-y-4">
                {event.registrations && event.registrations.length > 0 ? (
                  event.registrations.map((reg) => (
                    <div key={reg.id} className="glass-card flex items-center">
                      <div className="w-12 h-12 bg-primary-500 rounded-full mr-4 flex items-center justify-center text-white">
                        {reg.user?.firstName?.[0]}
                      </div>
                      <div>
                        <p className="font-semibold">
                          {reg.user?.firstName} {reg.user?.lastName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-dark-secondary">
                          Registered {new Date(reg.registeredAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-dark-secondary">
                    No registrations yet
                  </p>
                )}
              </div>
            )}

            {activeTab === 'attendance' && (
              <div className="space-y-4">
                {event.attendance && event.attendance.length > 0 ? (
                  event.attendance.map((att) => (
                    <div key={att.id} className="glass-card flex items-center">
                      <div className="w-12 h-12 bg-green-500 rounded-full mr-4 flex items-center justify-center text-white">
                        ✓
                      </div>
                      <div>
                        <p className="font-semibold">
                          {att.user?.firstName} {att.user?.lastName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-dark-secondary">
                          Attended {new Date(att.scannedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-dark-secondary">
                    No attendance records yet
                  </p>
                )}
              </div>
            )}
          </Tabs>
        </main>
      </Sidebar>
    </>
  );
}
