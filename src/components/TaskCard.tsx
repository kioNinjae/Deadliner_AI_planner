import React from 'react';
import { CheckCircle, Circle, Calendar, Clock, RotateCcw } from 'lucide-react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: string) => void;
  onReschedule: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete, onReschedule }) => {
  const priorityColors = {
    low: 'border-l-green-400',
    medium: 'border-l-yellow-400',
    high: 'border-l-red-400'
  };

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

  const isOverdue = new Date(task.scheduledDate) < new Date() && !task.completed;
  const isToday = task.scheduledDate === new Date().toISOString().split('T')[0];

  return (
    <div className={`bg-white rounded-lg shadow-sm border-l-4 ${priorityColors[task.priority]} p-4 hover:shadow-md transition-all ${isOverdue ? 'bg-red-50' : ''} ${task.completed ? 'opacity-75' : ''}`}>
      <div className="flex items-start space-x-3">
        <button
          onClick={() => onComplete(task.id)}
          className={`mt-1 transition-colors ${task.completed ? 'text-green-600' : 'text-gray-400 hover:text-green-600'}`}
        >
          {task.completed ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">{typeEmojis[task.type]}</span>
            <h3 className={`text-sm font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </h3>
            {isToday && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Today
              </span>
            )}
            {isOverdue && !task.completed && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Overdue
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 mb-3">{task.description}</p>

          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(task.scheduledDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{formatDuration(task.duration)}</span>
            </div>
          </div>
        </div>

        {!task.completed && (
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => onReschedule(task.id)}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
              title="Reschedule task"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};