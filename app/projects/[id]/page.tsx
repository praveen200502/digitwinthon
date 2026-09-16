'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import LoadingSkeleton from '@/components/loading-skeleton';
import Tabs from '@/components/tabs';
import toast from 'react-hot-toast';

interface Project {
  id: string;
  title: string;
  description: string;
  domain: string;
  technologies: string[];
  status: string;
  club: { name: string };
  members: any[];
  reviews: any[];
  githubLink?: string;
  demoLink?: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data.data);
      } else {
        toast.error('Failed to load project');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSkeleton />;

  if (!project) {
    return (
      <>
        <Navbar />
        <Sidebar>
          <div className="p-8 text-center">Project not found</div>
        </Sidebar>
      </>
    );
  }

  const averageRating =
    project.reviews.length > 0
      ? (
          project.reviews.reduce((sum, r) => sum + r.rating, 0) /
          project.reviews.length
        ).toFixed(1)
      : 'N/A';

  return (
    <>
      <Navbar />
      <Sidebar>
        <main className="p-8">
          {/* Project Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">{project.title}</h1>
                <p className="text-gray-600 dark:text-dark-secondary text-lg">
                  {project.club.name}
                </p>
              </div>
              <span className={`badge ${
                project.status === 'approved'
                  ? 'badge-success'
                  : project.status === 'rejected'
                    ? 'badge-danger'
                    : 'badge-warning'
              }`}>
                {project.status}
              </span>
            </div>

            {project.description && (
              <p className="text-gray-600 dark:text-dark-secondary text-lg mb-6">
                {project.description}
              </p>
            )}

            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-100 px-3 py-1 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {(project.githubLink || project.demoLink) && (
              <div className="flex gap-4 mb-6">
                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    View on GitHub
                  </a>
                )}
                {project.demoLink && (
                  <a
                    href={project.demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    View Demo
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Tabs */}
          <Tabs
            tabs={[
              { label: 'Overview', value: 'overview', icon: '📋' },
              { label: 'Team', value: 'team', icon: '👥' },
              { label: 'Reviews', value: 'reviews', icon: '⭐' },
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          >
            {activeTab === 'overview' && (
              <div className="glass-card">
                <h2 className="text-2xl font-bold mb-4">Project Details</h2>
                <p className="text-gray-600 dark:text-dark-secondary">
                  {project.description}
                </p>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="space-y-4">
                {project.members && project.members.length > 0 ? (
                  project.members.map((member) => (
                    <div key={member.id} className="glass-card flex items-center">
                      <div className="w-12 h-12 bg-primary-500 rounded-full mr-4 flex items-center justify-center text-white">
                        {member.user?.firstName?.[0]}
                      </div>
                      <div>
                        <p className="font-semibold">
                          {member.user?.firstName} {member.user?.lastName}
                        </p>
                        {member.role && (
                          <p className="text-sm text-gray-600 dark:text-dark-secondary">
                            {member.role}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-dark-secondary">No team members</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div className="glass-card">
                  <p className="text-gray-600 dark:text-dark-secondary">Average Rating</p>
                  <p className="text-4xl font-bold mt-2">⭐ {averageRating}</p>
                </div>
                {project.reviews && project.reviews.length > 0 ? (
                  project.reviews.map((review) => (
                    <div key={review.id} className="glass-card">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-semibold">
                          {review.reviewer?.firstName} {review.reviewer?.lastName}
                        </p>
                        <span className="text-yellow-500">{'⭐'.repeat(review.rating)}</span>
                      </div>
                      {review.remarks && (
                        <p className="text-gray-600 dark:text-dark-secondary">
                          {review.remarks}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-dark-secondary">No reviews yet</p>
                )}
              </div>
            )}
          </Tabs>
        </main>
      </Sidebar>
    </>
  );
}
