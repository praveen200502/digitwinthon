'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import StatCard from '@/components/stat-card';
import LoadingSkeleton from '@/components/loading-skeleton';
import toast from 'react-hot-toast';

interface AnalyticsData {
  clubs: { total: number; active: number; userClubs: number };
  events: { total: number; upcoming: number; userRegistrations: number };
  projects: { total: number; approved: number };
  certificates: number;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch('/api/analytics', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAnalytics(data.data);
        } else {
          toast.error('Failed to load analytics');
        }
      } catch (error) {
        toast.error('An error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  return (
    <>
      <Navbar />
      <Sidebar>
        <main className="p-8">
          <h1 className="text-4xl font-bold mb-2">Analytics</h1>
          <p className="text-gray-600 dark:text-dark-secondary mb-8">
            Platform statistics and insights
          </p>

          {loading ? (
            <LoadingSkeleton count={4} />
          ) : analytics ? (
            <>
              <div className="grid md:grid-cols-4 gap-6 mb-12">
                <StatCard
                  icon="🏢"
                  label="Total Clubs"
                  value={analytics.clubs.total}
                />
                <StatCard
                  icon="✨"
                  label="Active Clubs"
                  value={analytics.clubs.active}
                />
                <StatCard
                  icon="📅"
                  label="Upcoming Events"
                  value={analytics.events.upcoming}
                />
                <StatCard
                  icon="🎓"
                  label="Certificates Issued"
                  value={analytics.certificates}
                />
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <div className="glass-card">
                  <h2 className="text-2xl font-bold mb-6">Club Distribution</h2>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Your Clubs</span>
                        <span className="font-semibold">{analytics.clubs.userClubs}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-dark-surface rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{
                            width: `${(analytics.clubs.userClubs / analytics.clubs.total) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>All Clubs</span>
                        <span className="font-semibold">{analytics.clubs.total}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-card">
                  <h2 className="text-2xl font-bold mb-6">Project Statistics</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Projects</span>
                      <span className="text-2xl font-bold">
                        {analytics.projects.total}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Approved</span>
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {analytics.projects.approved}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Approval Rate</span>
                      <span className="text-2xl font-bold">
                        {analytics.projects.total > 0
                          ? Math.round(
                              (analytics.projects.approved / analytics.projects.total) * 100
                            )
                          : 0}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </main>
      </Sidebar>
    </>
  );
}
