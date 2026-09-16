'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import LoadingSkeleton from '@/components/loading-skeleton';
import EmptyState from '@/components/empty-state';
import toast from 'react-hot-toast';

interface Project {
  id: string;
  title: string;
  description: string;
  domain: string;
  technologies: string[];
  status: string;
  featured: boolean;
  club: { name: string };
  _count?: {
    reviews: number;
  };
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending'>('approved');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.data || []);
      } else {
        toast.error('Failed to load projects');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter((project) => {
    if (filterStatus === 'approved') return project.status === 'approved';
    if (filterStatus === 'pending')
      return ['draft', 'submitted', 'under_review'].includes(project.status);
    return true;
  });

  return (
    <>
      <Navbar />
      <Sidebar>
        <main className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Project Showcase</h1>
              <p className="text-gray-600 dark:text-dark-secondary">
                Explore technical projects from our community
              </p>
            </div>
            <Link href="/projects/new" className="btn-primary">
              Submit Project
            </Link>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-8">
            {(['all', 'approved', 'pending'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterStatus === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 dark:bg-dark-card text-gray-900 dark:text-dark-primary hover:bg-gray-300'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <LoadingSkeleton />
          ) : filteredProjects.length === 0 ? (
            <EmptyState
              icon="💡"
              title="No Projects Found"
              description="No projects match your filter criteria."
            />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <div className="glass-card hover:shadow-lg transition cursor-pointer h-full flex flex-col">
                    {project.featured && (
                      <span className="badge badge-warning mb-3">Featured</span>
                    )}
                    <h3 className="text-xl font-bold mb-2 flex-1">{project.title}</h3>
                    {project.domain && (
                      <span className="badge badge-primary mb-3">{project.domain}</span>
                    )}
                    <p className="text-gray-600 dark:text-dark-secondary text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-100 px-2 py-1 rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>{project.club.name}</span>
                      <span>📝 {project._count?.reviews || 0} reviews</span>
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
