'use client';

export interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatCard({ icon, label, value, trend }: StatCardProps) {
  return (
    <div className="glass-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 dark:text-dark-secondary text-sm">{label}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${
              trend.isPositive
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}% from last month
            </p>
          )}
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </div>
  );
}
