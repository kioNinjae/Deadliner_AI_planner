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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50">
      <Header 
        onExport={exportSchedule}
        onShowSettings={() => setShowSettings(true)}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeInUp">
        <StatsCard stats={stats} />
        
        <AddAssignmentForm 
          onAdd={addAssignment}
          loading={loading}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slideInRight">
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-fadeInUp hover:shadow-lg transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 animate-pulse"></span>
                Your Assignments ({assignments.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assignments.map((assignment, index) => (
                  <div
                    key={assignment.id}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 group animate-fadeInUp"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors duration-300">
                        {assignment.title}
                      </h4>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        assignment.priority === 'high' 
                          ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 shadow-sm'
                          : assignment.priority === 'medium'
                          ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 shadow-sm'
                          : 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 shadow-sm'
                      }`}>
                        {assignment.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 group-hover:text-gray-700 transition-colors duration-300">{assignment.subject}</p>
                    <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                      Est. {assignment.estimatedHours}h
                    </p>
                    <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className={`h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${
                        assignment.priority === 'high' ? 'from-red-400 to-red-600' :
                        assignment.priority === 'medium' ? 'from-yellow-400 to-yellow-600' :
                        'from-green-400 to-green-600'
                      } w-2/3`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {assignments.length === 0 && (
          <div className="mt-8 text-center py-12 animate-fadeInUp">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 floating shadow-lg">
                <Target className="w-10 h-10 text-white animate-pulse-gentle" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2 hover:text-blue-600 transition-colors duration-300">
                Welcome to Deadliner AI! 🎯
              </h3>
              <p className="text-gray-600 mb-6 hover:text-gray-700 transition-colors duration-300">
                Start by adding your first assignment, exam, or project above. 
                Our AI will automatically break it down into manageable tasks and 
                create a personalized study schedule for you.
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg p-4 border border-blue-200 shadow-sm hover:shadow-md transition-all duration-300">
                <p className="text-sm text-blue-800 hover:text-blue-900 transition-colors duration-300">
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