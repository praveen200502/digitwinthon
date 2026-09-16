'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import LoadingSkeleton from '@/components/loading-skeleton';
import Tabs from '@/components/tabs';
import toast from 'react-hot-toast';

interface Club {
  id: string;
  name: string;
  description: string;
  domain: string;
  logo?: string;
  memberships?: any[];
  events?: any[];
  projects?: any[];
  announcements?: any[];
}

export default function ClubDetailPage() {
  const params = useParams();
  const clubId = params.id as string;
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadClub();
  }, [clubId]);

  const loadClub = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/clubs/${clubId}`);
      if (response.ok) {
        const data = await response.json();
        setClub(data.data);
      } else {
        toast.error('Failed to load club');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClub = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      const response = await fetch(`/api/clubs/${clubId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (response.ok) {
        toast.success('Successfully joined the club!');
        loadClub();
      } else {
        toast.error('Failed to join club');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  if (loading) return <LoadingSkeleton />;

  if (!club) {
    return (
      <>
        <Navbar />
        <Sidebar>
          <div className="p-8 text-center">Club not found</div>
        </Sidebar>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Sidebar>
        <main className="p-8">
          {/* Club Header */}
          <div className="mb-8">
            {club.logo && (
              <img
                src={club.logo}
                alt={club.name}
                className="w-full h-64 object-cover rounded-xl mb-6"
              />
            )}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">{club.name}</h1>
                {club.domain && (
                  <span className="badge badge-primary">{club.domain}</span>
                )}
              </div>
              <button onClick={handleJoinClub} className="btn-primary">
                Join Club
              </button>
            </div>
            {club.description && (
              <p className="text-gray-600 dark:text-dark-secondary text-lg">
                {club.description}
              </p>
            )}
          </div>

          {/* Tabs */}
          <Tabs
            tabs={[
              { label: 'Overview', value: 'overview', icon: '📋' },
              { label: 'Members', value: 'members', icon: '👥' },
              { label: 'Events', value: 'events', icon: '📅' },
              { label: 'Projects', value: 'projects', icon: '💡' },
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          >
            {activeTab === 'overview' && (
              <div className="grid md:grid-cols-3 gap-6">
                <div className="glass-card">
                  <h3 className="font-semibold mb-2">Members</h3>
                  <p className="text-3xl font-bold">
                    {club.memberships?.length || 0}
                  </p>
                </div>
                <div className="glass-card">
                  <h3 className="font-semibold mb-2">Events</h3>
                  <p className="text-3xl font-bold">{club.events?.length || 0}</p>
                </div>
                <div className="glass-card">
                  <h3 className="font-semibold mb-2">Projects</h3>
                  <p className="text-3xl font-bold">{club.projects?.length || 0}</p>
                </div>
              </div>
            )}

            {activeTab === 'members' && (
              <div className="space-y-4">
                {club.memberships?.map((member) => (
                  <div key={member.id} className="glass-card flex items-center">
                    <div className="w-12 h-12 bg-primary-500 rounded-full mr-4 flex items-center justify-center">
                      {member.user?.firstName?.[0]}
                    </div>
                    <div>
                      <p className="font-semibold">
                        {member.user?.firstName} {member.user?.lastName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-dark-secondary">
                        {member.user?.studentId}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'events' && (
              <div className="space-y-4">
                {club.events && club.events.length > 0 ? (
                  club.events.map((event) => (
                    <div key={event.id} className="glass-card">
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-dark-secondary mt-1">
                        {event.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        📅 {new Date(event.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-dark-secondary">No events yet</p>
                )}
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-4">
                {club.projects && club.projects.length > 0 ? (
                  club.projects.map((project) => (
                    <div key={project.id} className="glass-card">
                      <h3 className="font-semibold">{project.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-dark-secondary mt-1">
                        {project.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-dark-secondary">
                    No projects yet
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
