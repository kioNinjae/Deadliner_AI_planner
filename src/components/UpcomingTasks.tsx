import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Task } from '../types';

interface UpcomingTasksProps {
  tasks: Task[];
  onCompleteTask: (taskId: string) => void;
}

export const UpcomingTasks: React.FC<UpcomingTasksProps> = ({ tasks, onCompleteTask }) => {
  const groupedTasks = tasks.reduce((acc, task) => {
    const date = task.scheduledDate;
    if (!acc[date]) acc[date] = [];
    acc[date].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const sortedDates = Object.keys(groupedTasks).sort();

  const typeEmojis = {
    study: '📚',
    assignment: '📝',
    reminder: '🔄'
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}min`;
  };

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Tasks</h3>
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No upcoming tasks</p>
          <p className="text-sm text-gray-400 mt-1">Add some assignments to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Upcoming Tasks ({tasks.length})
      </h3>
      
      <div className="space-y-4">
        {sortedDates.slice(0, 7).map((date) => {
          const dayTasks = groupedTasks[date];
          const isToday = date === new Date().toISOString().split('T')[0];
          const dateObj = new Date(date);
          
          return (
            <div key={date} className="border-l-2 border-gray-200 pl-4">
              <div className="flex items-center space-x-2 mb-2">
                <h4 className={`font-medium ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                  {isToday ? 'Today' : dateObj.toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </h4>
                {isToday && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Today
                  </span>
                )}
              </div>
              
              <div className="space-y-2">
                {dayTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-lg">{typeEmojis[task.type]}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {task.title}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{formatDuration(task.duration)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onCompleteTask(task.id)}
                      className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Complete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};