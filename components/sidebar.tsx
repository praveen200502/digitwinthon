'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

const menuItems = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'Clubs', href: '/clubs', icon: '🏛️' },
  { label: 'Events', href: '/events', icon: '🎤' },
  { label: 'Projects', href: '/projects', icon: '💡' },
  { label: 'Learning', href: '/learning', icon: '📚' },
  { label: 'Certificates', href: '/certificates', icon: '🎓' },
  { label: 'Notifications', href: '/notifications', icon: '🔔' },
];

const adminMenuItems = [
  { label: 'Users', href: '/admin/users', icon: '👥' },
  { label: 'Analytics', href: '/admin/analytics', icon: '📈' },
  { label: 'Reports', href: '/admin/reports', icon: '📄' },
  { label: 'Audit Logs', href: '/admin/audit', icon: '🔍' },
];

export default function Sidebar({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-dark-surface border-r border-gray-200 dark:border-dark-border p-6 hidden lg:block fixed left-0 top-0 h-screen overflow-y-auto">
        <nav className="space-y-2">
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              Menu
            </h3>
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-2 rounded-lg transition ${
                  pathname === item.href
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-100 font-semibold'
                    : 'text-gray-700 dark:text-dark-secondary hover:bg-gray-100 dark:hover:bg-dark-card'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              Administration
            </h3>
            {adminMenuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-2 rounded-lg transition ${
                  pathname === item.href
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-100 font-semibold'
                    : 'text-gray-700 dark:text-dark-secondary hover:bg-gray-100 dark:hover:bg-dark-card'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">{children}</main>
    </div>
  );
}
