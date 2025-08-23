import React from 'react';
import { Clock, BookOpen, AlertCircle, Calendar } from 'lucide-react';
import { Task } from '../types';

interface TaskSelectorProps {
  tasks: Task[];
  selectedTask?: Task;
  onSelectTask: (task: Task | undefined) => void;
}

export const TaskSelector: React.FC<TaskSelectorProps> = ({ 
  tasks, 
  selectedTask, 
  onSelectTask 
}) => {
  const upcomingTasks = tasks
    .filter(task => !task.completed)
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
    .slice(0, 5);

  const typeEmojis = {
    study: '📚',
    assignment: '📝',
    reminder: '🔄'
  };

  const priorityColors = {
    low: 'border-l-green-400 bg-green-50',
    medium: 'border-l-yellow-400 bg-yellow-50',
    high: 'border-l-red-400 bg-red-50'
  };

  if (upcomingTasks.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-fadeInUp hover:shadow-lg transition-all duration-300">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-blue-500 animate-pulse-gentle" />
          Select a Task to Study
        </h3>
        <div className="text-center py-8 animate-fadeInUp">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3 floating" />
          <p className="text-gray-500">No tasks available</p>
          <p className="text-sm text-gray-400 mt-1">Add some assignments to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-fadeInUp hover:shadow-lg transition-all duration-300">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <BookOpen className="w-5 h-5 mr-2 text-blue-500 animate-pulse-gentle" />
        Select a Task to Study
      </h3>
      
      <div className="space-y-3">
        <button
          onClick={() => onSelectTask(undefined)}
          className={`w-full p-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-[1.02] ${
            !selectedTask 
              ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 shadow-md' 
              : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
          }`}
        >
          <div className="flex items-center space-x-3">
            <span className="text-2xl animate-bounce-gentle">🎯</span>
            <div className="text-left">
              <p className="font-medium text-gray-900">Free Study Session</p>
              <p className="text-sm text-gray-500">Study anything you want</p>
            </div>
          </div>
        </button>

        {upcomingTasks.map((task, index) => (
          <button
            key={task.id}
            onClick={() => onSelectTask(task)}
            className={`w-full p-4 rounded-lg border-l-4 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md ${
              selectedTask?.id === task.id 
                ? `${priorityColors[task.priority]} border-l-blue-500 shadow-md` 
                : `${priorityColors[task.priority]} hover:shadow-lg`
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl transition-transform duration-300 hover:scale-125">
                {typeEmojis[task.type]}
              </span>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900 hover:text-blue-900 transition-colors duration-300">
                  {task.title}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(task.scheduledDate).toLocaleDateString()}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {Math.floor(task.duration / 60)}h {task.duration % 60}m
                  </span>
                </div>
              </div>
              {selectedTask?.id === task.id && (
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};