'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import LoadingSkeleton from '@/components/loading-skeleton';
import EmptyState from '@/components/empty-state';
import toast from 'react-hot-toast';

interface LearningResource {
  id: string;
  title: string;
  description: string;
  resourceType: string;
  domain: string;
  technology?: string;
  difficulty: string;
  creator: { firstName: string; lastName: string };
  viewCount: number;
}

export default function LearningPage() {
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/learning-resources');
      if (response.ok) {
        const data = await response.json();
        setResources(data.data || []);
      } else {
        // Use mock data for demo
        setResources([
          {
            id: '1',
            title: 'Introduction to Python',
            description: 'Learn Python basics from scratch',
            resourceType: 'tutorial',
            domain: 'Python',
            difficulty: 'beginner',
            creator: { firstName: 'John', lastName: 'Doe' },
            viewCount: 150,
          },
          {
            id: '2',
            title: 'Advanced React Patterns',
            description: 'Master advanced React patterns and hooks',
            resourceType: 'video',
            domain: 'Web Development',
            technology: 'React',
            difficulty: 'advanced',
            creator: { firstName: 'Jane', lastName: 'Smith' },
            viewCount: 220,
          },
        ]);
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = resources.filter((resource) => {
    if (filterDifficulty === 'all') return true;
    return resource.difficulty === filterDifficulty;
  });

  const resourceTypeIcons: Record<string, string> = {
    tutorial: '📖',
    video: '🎥',
    notes: '📝',
    presentation: '📊',
    documentation: '📚',
    link: '🔗',
    pdf: '📄',
  };

  return (
    <>
      <Navbar />
      <Sidebar>
        <main className="p-8">
          <h1 className="text-4xl font-bold mb-2">Learning Resources</h1>
          <p className="text-gray-600 dark:text-dark-secondary mb-8">
            Curated learning materials to enhance your skills
          </p>

          {/* Filters */}
          <div className="flex gap-4 mb-8 flex-wrap">
            {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setFilterDifficulty(level)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterDifficulty === level
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 dark:bg-dark-card text-gray-900 dark:text-dark-primary hover:bg-gray-300'
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <LoadingSkeleton />
          ) : filteredResources.length === 0 ? (
            <EmptyState
              icon="📚"
              title="No Resources Found"
              description="No learning resources match your filter criteria."
            />
          ) : (
            <div className="space-y-4">
              {filteredResources.map((resource) => (
                <div
                  key={resource.id}
                  className="glass-card hover:shadow-lg transition cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-4 flex-1">
                      <span className="text-3xl">
                        {resourceTypeIcons[resource.resourceType] || '📖'}
                      </span>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-1">{resource.title}</h3>
                        <p className="text-gray-600 dark:text-dark-secondary mb-3">
                          {resource.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>{resource.domain}</span>
                          {resource.technology && <span>• {resource.technology}</span>}
                          <span>
                            {resource.difficulty.charAt(0).toUpperCase() +
                              resource.difficulty.slice(1)}
                          </span>
                          <span>👁️ {resource.viewCount}</span>
                        </div>
                      </div>
                    </div>
                    <span className="badge badge-primary">
                      {resource.resourceType}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    By {resource.creator.firstName} {resource.creator.lastName}
                  </p>
                </div>
              ))}
            </div>
          )}
        </main>
      </Sidebar>
    </>
  );
}
