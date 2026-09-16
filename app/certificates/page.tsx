'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import LoadingSkeleton from '@/components/loading-skeleton';
import EmptyState from '@/components/empty-state';
import toast from 'react-hot-toast';

interface Certificate {
  id: string;
  certificateId: string;
  event?: { title: string };
  issueDate: string;
  status: string;
  participationType: string;
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCertificates = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch('/api/certificates', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCertificates(data.data || []);
        } else {
          toast.error('Failed to load certificates');
        }
      } catch (error) {
        toast.error('An error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadCertificates();
  }, []);

  const handleDownload = (certificateId: string) => {
    toast.success('Certificate download started');
    // Implementation for PDF download
  };

  const handleVerify = async (certificateId: string) => {
    try {
      const response = await fetch(`/api/certificates/${certificateId}/verify`);
      if (response.ok) {
        const data = await response.json();
        toast.success('Certificate verified successfully');
      } else {
        toast.error('Certificate verification failed');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  return (
    <>
      <Navbar />
      <Sidebar>
        <main className="p-8">
          <h1 className="text-4xl font-bold mb-2">My Certificates</h1>
          <p className="text-gray-600 dark:text-dark-secondary mb-8">
            View and verify your achievement certificates
          </p>

          {loading ? (
            <LoadingSkeleton />
          ) : certificates.length === 0 ? (
            <EmptyState
              icon="🎓"
              title="No Certificates Yet"
              description="You haven't earned any certificates yet. Participate in events to earn certificates."
              action={{
                label: 'Browse Events',
                onClick: () => (window.location.href = '/events'),
              }}
            />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert) => (
                <div key={cert.id} className="glass-card hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{cert.event?.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-dark-secondary">
                        {cert.participationType}
                      </p>
                    </div>
                    <span className="badge badge-success">Issued</span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-dark-secondary mb-4">
                    ID: {cert.certificateId.substring(0, 8)}...
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                    Issued: {new Date(cert.issueDate).toLocaleDateString()}
                  </p>

                  <div className="space-y-2">
                    <button
                      onClick={() => handleDownload(cert.certificateId)}
                      className="btn-primary w-full text-sm"
                    >
                      Download PDF
                    </button>
                    <button
                      onClick={() => handleVerify(cert.certificateId)}
                      className="btn-secondary w-full text-sm"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </Sidebar>
    </>
  );
}
