'use client';

import { useTheme } from '@/components/theme-provider';
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-primary">
      {/* Navbar */}
      <nav className="glass sticky top-0 z-50 border-b border-gray-200 dark:border-dark-border">
        <div className="container-custom flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg"></div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent">
              DIGITwinTHON
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#about" className="hover:text-primary-600 dark:hover:text-primary-400 transition">
              About
            </Link>
            <Link href="#clubs" className="hover:text-primary-600 dark:hover:text-primary-400 transition">
              Clubs
            </Link>
            <Link href="#events" className="hover:text-primary-600 dark:hover:text-primary-400 transition">
              Events
            </Link>
            <Link href="#resources" className="hover:text-primary-600 dark:hover:text-primary-400 transition">
              Resources
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-lg transition"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <Link href="/auth/login" className="btn-primary hidden sm:inline-block">
              Login
            </Link>
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-dark-border p-4 space-y-3">
            <Link href="#about" className="block hover:text-primary-600 dark:hover:text-primary-400">
              About
            </Link>
            <Link href="#clubs" className="block hover:text-primary-600 dark:hover:text-primary-400">
              Clubs
            </Link>
            <Link href="#events" className="block hover:text-primary-600 dark:hover:text-primary-400">
              Events
            </Link>
            <Link href="#resources" className="block hover:text-primary-600 dark:hover:text-primary-400">
              Resources
            </Link>
            <Link href="/auth/login" className="btn-primary block text-center">
              Login
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32 px-4 bg-gradient-to-b from-white to-gray-50 dark:from-dark-bg dark:to-dark-surface">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent">
            Centralized Technical Club Management
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-dark-secondary mb-8 max-w-2xl mx-auto">
            One platform to manage clubs, members, events, projects, learning and achievements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="btn-primary inline-block">
              Get Started
            </Link>
            <Link href="#clubs" className="btn-secondary inline-block">
              Explore Clubs
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">About DIGITwinTHON Platform</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Centralized Management',
                description: 'Manage all club activities in one place instead of using disconnected tools.',
              },
              {
                title: 'Digital Membership Cards',
                description: 'Generate and verify digital membership cards with QR codes.',
              },
              {
                title: 'Automated Certificates',
                description: 'Automatically generate certificates for event participation.',
              },
              {
                title: 'Event Management',
                description: 'Create, manage, and track events with registration and attendance.',
              },
              {
                title: 'Learning Resources',
                description: 'Access curated learning materials and track your progress.',
              },
              {
                title: 'Analytics & Reports',
                description: 'View detailed analytics and generate comprehensive reports.',
              },
            ].map((feature, index) => (
              <div key={index} className="glass-card">
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-dark-secondary">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-dark-surface">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: '100+', label: 'Active Members' },
              { number: '25+', label: 'Clubs' },
              { number: '50+', label: 'Events' },
              { number: '1000+', label: 'Certificates' },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <p className="text-gray-600 dark:text-dark-secondary mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Club Management?</h2>
          <p className="text-lg text-gray-600 dark:text-dark-secondary mb-8 max-w-2xl mx-auto">
            Join DIGITwinTHON today and experience a modern approach to managing technical clubs.
          </p>
          <Link href="/auth/register" className="btn-primary inline-block">
            Start Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface py-12 px-4">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-600 dark:text-dark-secondary">
                <li><Link href="#" className="hover:text-primary-600 dark:hover:text-primary-400">About</Link></li>
                <li><Link href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Features</Link></li>
                <li><Link href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-600 dark:text-dark-secondary">
                <li><Link href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Documentation</Link></li>
                <li><Link href="#" className="hover:text-primary-600 dark:hover:text-primary-400">API</Link></li>
                <li><Link href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-600 dark:text-dark-secondary">
                <li><Link href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Privacy</Link></li>
                <li><Link href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Terms</Link></li>
                <li><Link href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-600 dark:text-dark-secondary">
                <li><Link href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Twitter</Link></li>
                <li><Link href="#" className="hover:text-primary-600 dark:hover:text-primary-400">GitHub</Link></li>
                <li><Link href="#" className="hover:text-primary-600 dark:hover:text-primary-400">LinkedIn</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-dark-border pt-8 text-center text-gray-600 dark:text-dark-secondary">
            <p>&copy; 2024 DIGITwinTHON. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
