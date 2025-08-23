import React, { useState } from 'react';
import { Target } from 'lucide-react';
import { Header } from './components/Header';
import { StatsCard } from './components/StatsCard';
import { AddAssignmentForm } from './components/AddAssignmentForm';
import { DailyPlan } from './components/DailyPlan';
import { UpcomingTasks } from './components/UpcomingTasks';
import { SettingsModal } from './components/SettingsModal';
import { TaskTimer } from './components/TaskTimer';
import { TaskSelector } from './components/TaskSelector';
import { WalletDashboard } from './components/WalletDashboard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { NotificationToast } from './components/NotificationToast';
import { ConnectionStatus } from './components/ConnectionStatus';
import { useDeadliner } from './hooks/useDeadliner';
import { Task } from './types';

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [showCelebration, setShowCelebration] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({ message: '', type: 'info', isVisible: false });
  
  const {
    assignments,
    tasks,
    profile,
    timerSessions,
    wallet,
    loading,
    addAssignment,
    completeTask,
    rescheduleTask,
    getDailyPlan,
    getUpcomingTasks,
    getStats,
    updateProfile,
    exportSchedule,
    addTimerSession,
    addPoints,
    redeemReward,
    useBackend
  } = useDeadliner();

  const stats = getStats();
  const upcomingTasks = getUpcomingTasks();

  const handleSessionComplete = (session: any) => {
    addTimerSession(session);
    if (session.pointsEarned > 0) {
      setShowCelebration(true);
      showNotification(`🎉 Earned ${session.pointsEarned} points!`, 'success');
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type, isVisible: true });
  };

  const handleAddAssignment = async (assignment: any) => {
    try {
      await addAssignment(assignment);
      showNotification('✅ Assignment created successfully!', 'success');
    } catch (error) {
      showNotification('❌ Failed to create assignment', 'error');
    }
  };

  const toggleBackend = () => {
    window.location.reload(); // Reload to switch between backend/local
  };

  const handlePointsEarned = (points: number) => {
    addPoints(points);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50">
      <Header 
        onExport={exportSchedule}
        onShowSettings={() => setShowSettings(true)}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeInUp">
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <LoadingSpinner size="lg" />
          </div>
        )}
        
        <StatsCard stats={stats} />
        
        <AddAssignmentForm 
          onAdd={handleAddAssignment}
          loading={loading}
        />
        
        {/* Timer and Wallet Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 animate-slideInRight">
          <TaskSelector
            tasks={tasks}
            selectedTask={selectedTask}
            onSelectTask={setSelectedTask}
          />
          
          <TaskTimer
            selectedTask={selectedTask}
            onSessionComplete={handleSessionComplete}
            onPointsEarned={handlePointsEarned}
          />
          
          <WalletDashboard
            wallet={wallet}
            sessions={timerSessions}
            onRedeemReward={redeemReward}
          />
        </div>
        
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

        {assignments