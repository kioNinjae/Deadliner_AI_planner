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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateDate('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              {isToday ? 'Today' : new Date(currentDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            <p className="text-sm text-gray-500">
              {plan.tasks.length} tasks • {formatTotalTime(plan.totalStudyTime)} total
            </p>
          </div>
          
          <button
            onClick={() => navigateDate('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="date"
            value={currentDate}
            onChange={(e) => setCurrentDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="space-y-3">
        {plan.tasks.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No tasks scheduled for this day</p>
          </div>
        ) : (
          plan.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={onCompleteTask}
              onReschedule={handleReschedule}
            />
          ))
        )}
      </div>

      {plan.completed && plan.tasks.length > 0 && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium text-center">
            🎉 All tasks completed for this day!
          </p>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Reschedule Task
            </h3>
            <p className="text-gray-600 mb-4">
              Select a new date for this task:
            </p>
            <input
              type="date"
              value={newRescheduleDate}
              onChange={(e) => setNewRescheduleDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={new Date().toISOString().split('T')[0]}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRescheduleModal(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmReschedule}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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