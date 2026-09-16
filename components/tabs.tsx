'use client';

import { ReactNode } from 'react';

export interface TabProps {
  label: string;
  value: string;
  icon?: string;
}

interface TabsProps {
  tabs: TabProps[];
  activeTab: string;
  onTabChange: (value: string) => void;
  children: ReactNode;
}

export default function Tabs({ tabs, activeTab, onTabChange, children }: TabsProps) {
  return (
    <div>
      <div className="flex border-b border-gray-200 dark:border-dark-border">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === tab.value
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-600 dark:text-dark-secondary hover:text-gray-900 dark:hover:text-dark-primary'
            }`}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}
