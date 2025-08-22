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
      bgColor: 'bg-blue-50',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      label: 'Completed',
      value: stats.completedTasks,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      gradient: 'from-green-500 to-green-600'
    },
    {
      label: 'Completion Rate',
      value: `${Math.round(stats.completionRate)}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      label: 'Upcoming Deadlines',
      value: stats.upcomingDeadlines,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      gradient: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fadeInUp">
      {statItems.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 group cursor-pointer"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${item.bgColor} group-hover:bg-gradient-to-br group-hover:${item.gradient} transition-all duration-300 group-hover:shadow-lg`}>
              <item.icon className={`w-6 h-6 ${item.color} group-hover:text-white transition-all duration-300 group-hover:scale-110`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 group-hover:text-gray-600 transition-colors duration-300">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900 group-hover:text-gray-800 transition-all duration-300 transform group-hover:scale-110">{item.value}</p>
            </div>
          </div>
          <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full bg-gradient-to-r ${item.gradient} rounded-full transition-all duration-1000 ease-out group-hover:w-full`} 
                 style={{ width: item.label === 'Completion Rate' ? `${stats.completionRate}%` : '60%' }}></div>
          </div>
        </div>
      ))}
    </div>
  );
};