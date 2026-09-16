'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from './theme-provider';

export default function Navbar() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  return (
    <nav className="glass sticky top-0 z-50 border-b border-gray-200 dark:border-dark-border">
      <div className="container-custom flex items-center justify-between h-16">
        <Link href="/dashboard" className="flex items-center space-x-2 hover:opacity-80 transition">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg"></div>
          <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent">
            DIGITwinTHON
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-lg transition"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <button
            onClick={handleLogout}
            className="btn-secondary text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
