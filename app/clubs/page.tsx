'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import LoadingSkeleton from '@/components/loading-skeleton';
import EmptyState from '@/components/empty-state';
import toast from 'react-hot-toast';

interface Club {
  id: string;
  name: string;
  slug: string;
  description: string;
  domain: string;
  logo?: string;
  totalMembers: number;
  _count?: {
    events: number;
    projects: number;
    memberships: number;
  };
}

export default function ClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadClubs();
  }, []);

  const loadClubs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/clubs');
      if (response.ok) {
        const data = await response.json();
        setClubs(data.data || []);
      } else {
        toast.error('Failed to load clubs');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filteredClubs = clubs.filter((club) =>
    club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.domain?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <Sidebar>
        <main className="p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Technical Clubs</h1>
            <p className="text-gray-600 dark:text-dark-secondary mb-6">
              Discover and join technical clubs
            </p>

            {/* Search */}
            <input
              type="text"
              placeholder="Search clubs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field max-w-md"
            />
          </div>

          {loading ? (
            <LoadingSkeleton count={6} variant="card" />
          ) : filteredClubs.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="No Clubs Found"
              description="No clubs match your search criteria."
            />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClubs.map((club) => (
                <Link key={club.id} href={`/clubs/${club.id}`}>
                  <div className="glass-card hover:shadow-lg transition cursor-pointer h-full">
                    {club.logo && (
                      <img
                        src={club.logo}
                        alt={club.name}
                        className="w-full h-32 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h3 className="text-xl font-semibold mb-2">{club.name}</h3>
                    {club.domain && (
                      <span className="badge badge-primary mb-3">{club.domain}</span>
                    )}
                    <p className="text-gray-600 dark:text-dark-secondary text-sm mb-4 line-clamp-2">
                      {club.description}
                    </p>
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>👥 {club.totalMembers} members</span>
                      <span>📅 {club._count?.events || 0} events</span>
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
