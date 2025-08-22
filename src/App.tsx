import React, { useState } from 'react';
import { Header } from './components/Header';
import { StatsCard } from './components/StatsCard';
import { AddAssignmentForm } from './components/AddAssignmentForm';
import { DailyPlan } from './components/DailyPlan';
import { UpcomingTasks } from './components/UpcomingTasks';
import { SettingsModal } from './components/SettingsModal';
import { useDeadliner } from './hooks/useDeadliner';

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const {
    assignments,
    tasks,
    profile,
    loading,
    addAssignment,
    completeTask,
    rescheduleTask,
    getDailyPlan,
    getUpcomingTasks,
    getStats,
    updateProfile,
    exportSchedule
  } = useDeadliner();

  const stats = getStats();
  const upcomingTasks = getUpcomingTasks();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onExport={exportSchedule}
        onShowSettings={() => setShowSettings(true)}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsCard stats={stats} />
        
        <AddAssignmentForm 
          onAdd={addAssignment}
          loading={loading}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DailyPlan
            getDailyPlan={getDailyPlan}
            onCompleteTask={completeTask}
            onRescheduleTask={rescheduleTask}
          />
          
          <UpcomingTasks
            tasks={upcomingTasks}
            onCompleteTask={completeTask}
          />
        </div>

        {assignments.length > 0 && (
          <div className="mt-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Your Assignments ({assignments.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 truncate">
                        {assignment.title}
                      </h4>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        assignment.priority === 'high' 
                          ? 'bg-red-100 text-red-800'
                          : assignment.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {assignment.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{assignment.subject}</p>
                    <p className="text-xs text-gray-500">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      Est. {assignment.estimatedHours}h
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {assignments.length === 0 && (
          <div className="mt-8 text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Welcome to Deadliner AI! 🎯
              </h3>
              <p className="text-gray-600 mb-6">
                Start by adding your first assignment, exam, or project above. 
                Our AI will automatically break it down into manageable tasks and 
                create a personalized study schedule for you.
              </p>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Pro tip:</strong> Be realistic with your estimated hours. 
                  The AI uses this to create an optimal schedule that prevents last-minute cramming!
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        profile={profile}
        onUpdateProfile={updateProfile}
      />
    </div>
  );
}

export default App;