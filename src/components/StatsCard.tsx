import React from 'react';
import { CheckCircle, Clock, AlertTriangle, TrendingUp } from 'lucide-react';

interface StatsCardProps {
  stats: {
    totalTasks: number;
    completedTasks: number;
    completionRate: number;
    upcomingDeadlines: number;
  };
}

export const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  const statItems = [
    {
      label: 'Total Tasks',
      value: stats.totalTasks,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Completed',
      value: stats.completedTasks,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Completion Rate',
      value: `${Math.round(stats.completionRate)}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Upcoming Deadlines',
      value: stats.upcomingDeadlines,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statItems.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${item.bgColor}`}>
              <item.icon className={`w-6 h-6 ${item.color}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};