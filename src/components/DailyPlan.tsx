import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { Task } from '../types';

interface DailyPlanProps {
  getDailyPlan: (date: string) => {
    date: string;
    tasks: Task[];
    totalStudyTime: number;
    completed: boolean;
  };
  onCompleteTask: (taskId: string) => void;
  onRescheduleTask: (taskId: string, newDate: string) => void;
}

export const DailyPlan: React.FC<DailyPlanProps> = ({
  getDailyPlan,
  onCompleteTask,
  onRescheduleTask
}) => {
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [showRescheduleModal, setShowRescheduleModal] = useState<string | null>(null);
  const [newRescheduleDate, setNewRescheduleDate] = useState('');

  const plan = getDailyPlan(currentDate);

  const navigateDate = (direction: 'prev' | 'next') => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + (direction === 'next' ? 1 : -1));
    setCurrentDate(date.toISOString().split('T')[0]);
  };

  const handleReschedule = (taskId: string) => {
    setShowRescheduleModal(taskId);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setNewRescheduleDate(tomorrow.toISOString().split('T')[0]);
  };

  const confirmReschedule = () => {
    if (showRescheduleModal && newRescheduleDate) {
      onRescheduleTask(showRescheduleModal, newRescheduleDate);
      setShowRescheduleModal(null);
      setNewRescheduleDate('');
    }
  };

  const formatTotalTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}min`;
  };

  const isToday = currentDate === new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-fadeInUp hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateDate('prev')}
            className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-300 transform hover:scale-110"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center justify-center">
              {isToday && <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>}
              {isToday ? 'Today' : new Date(currentDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            <p className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-300">
              {plan.tasks.length} tasks • {formatTotalTime(plan.totalStudyTime)} total
            </p>
          </div>
          
          <button
            onClick={() => navigateDate('next')}
            className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-300 transform hover:scale-110"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="date"
            value={currentDate}
            onChange={(e) => setCurrentDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:border-blue-300 hover:shadow-md"
          />
        </div>
      </div>

      <div className="space-y-3 animate-slideInRight">
        {plan.tasks.length === 0 ? (
          <div className="text-center py-8 animate-fadeInUp">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3 floating" />
            <p className="text-gray-500">No tasks scheduled for this day</p>
            <p className="text-sm text-gray-400 mt-2">Take a well-deserved break! 🎉</p>
          </div>
        ) : (
          plan.tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={onCompleteTask}
              onReschedule={handleReschedule}
              style={{ animationDelay: `${index * 0.1}s` }}
            />
          ))
        )}
      </div>

      {plan.completed && plan.tasks.length > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg animate-bounce-gentle shadow-lg">
          <p className="text-green-800 font-medium text-center flex items-center justify-center">
            <span className="text-2xl mr-2">🎉</span>
            🎉 All tasks completed for this day!
            <span className="text-2xl ml-2">🎉</span>
          </p>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeInUp">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 transform animate-slideInRight shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <RotateCcw className="w-5 h-5 mr-2 text-blue-600" />
              Reschedule Task
            </h3>
            <p className="text-gray-600 mb-4">
              Select a new date for this task:
            </p>
            <input
              type="date"
              value={newRescheduleDate}
              onChange={(e) => setNewRescheduleDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:border-blue-300 hover:shadow-md"
              min={new Date().toISOString().split('T')[0]}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRescheduleModal(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={confirmReschedule}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};