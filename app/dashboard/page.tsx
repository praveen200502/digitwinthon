'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import StatCard from '@/components/stat-card';
import LoadingSkeleton from '@/components/loading-skeleton';
import toast from 'react-hot-toast';

interface DashboardStats {
  totalClubs: number;
  totalMembers: number;
  upcomingEvents: number;
  certificates: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      window.location.href = '/auth/login';
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      toast.error('Failed to load user data');
    }

    // Load dashboard stats
    const loadStats = async () => {
      try {
        setLoading(true);
        // For now, using mock data. In production, fetch from API
        setStats({
          totalClubs: 25,
          totalMembers: 500,
          upcomingEvents: 12,
          certificates: 150,
        });
      } catch (error) {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <>
      <Navbar />
      <Sidebar>
        <main className="p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {user?.firstName || 'User'}!
            </h1>
            <p className="text-gray-600 dark:text-dark-secondary">
              Here's an overview of your club activities
            </p>
          </div>

          {loading ? (
            <LoadingSkeleton count={4} />
          ) : stats ? (
            <>
              <div className="grid md:grid-cols-4 gap-6 mb-12">
                <StatCard
                  icon="🏛️"
                  label="Total Clubs"
                  value={stats.totalClubs}
                  trend={{ value: 12, isPositive: true }}
                />
                <StatCard
                  icon="👥"
                  label="Club Members"
                  value={stats.totalMembers}
                  trend={{ value: 8, isPositive: true }}
                />
                <StatCard
                  icon="📅"
                  label="Upcoming Events"
                  value={stats.upcomingEvents}
                  trend={{ value: 5, isPositive: true }}
                />
                <StatCard
                  icon="🎓"
                  label="Certificates Issued"
                  value={stats.certificates}
                  trend={{ value: 25, isPositive: true }}
                />
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Quick Actions */}
                <div className="glass-card">
                  <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
                  <div className="space-y-3">
                    <Link
                      href="/clubs"
                      className="block btn-primary text-center hover:shadow-md transition"
                    >
                      Browse Clubs
                    </Link>
                    <Link
                      href="/events"
                      className="block btn-secondary text-center hover:shadow-md transition"
                    >
                      View Events
                    </Link>
                    <Link
                      href="/projects"
                      className="block btn-secondary text-center hover:shadow-md transition"
                    >
                      Explore Projects
                    </Link>
                  </div>
                </div>

                {/* Upcoming Events */}
                <div className="glass-card">
                  <h2 className="text-2xl font-bold mb-4">📅 Upcoming Events</h2>
                  <p className="text-gray-600 dark:text-dark-secondary text-sm mb-4">
                    Loading your registered events...
                  </p>
                  <button className="btn-primary w-full">View All Events</button>
                </div>
              </div>
            </>
          ) : null}
        </main>
      </Sidebar>
    </>
  );
}
