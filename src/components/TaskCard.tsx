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
    <div className={`bg-white rounded-lg shadow-sm border-l-4 ${priorityColors[task.priority]} p-4 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 ${isOverdue ? 'bg-red-50 animate-pulse-gentle' : ''} ${task.completed ? 'opacity-75 bg-green-50' : ''} group`}>
      <div className="flex items-start space-x-3">
        <button
          onClick={() => onComplete(task.id)}
          className={`mt-1 transition-all duration-300 transform hover:scale-110 ${task.completed ? 'text-green-600 animate-bounce-gentle' : 'text-gray-400 hover:text-green-600'}`}
        >
          {task.completed ? (
            <CheckCircle className="w-5 h-5 drop-shadow-sm" />
          ) : (
            <Circle className="w-5 h-5 hover:fill-green-100" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg transition-transform duration-300 hover:scale-125">{typeEmojis[task.type]}</span>
            <h3 className={`text-sm font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </h3>
            {isToday && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 animate-pulse-gentle shadow-sm">
                Today
              </span>
            )}
            {isOverdue && !task.completed && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-red-100 to-red-200 text-red-800 animate-bounce-gentle shadow-sm">
                Overdue
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 mb-3 group-hover:text-gray-700 transition-colors duration-300">{task.description}</p>

          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3 group-hover:text-blue-500 transition-colors duration-300" />
              <span>{new Date(task.scheduledDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3 group-hover:text-green-500 transition-colors duration-300" />
              <span>{formatDuration(task.duration)}</span>
            </div>
          </div>
        </div>

        {!task.completed && (
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => onReschedule(task.id)}
              className="p-1 text-gray-400 hover:text-blue-600 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
              title="Reschedule task"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      
      {/* Progress bar for task completion */}
      <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className={`h-full rounded-full transition-all duration-1000 ease-out ${
          task.completed ? 'bg-gradient-to-r from-green-400 to-green-600 w-full' : 'bg-gradient-to-r from-blue-400 to-blue-600 w-1/3'
        }`}></div>
      </div>
    </div>
  );
};