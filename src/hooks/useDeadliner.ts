import { useState, useEffect } from 'react';
import { Assignment, Task, StudyProfile, DayPlan, TimerSession, UserWallet, RewardTier } from '../types';
import { AIScheduler } from '../utils/aiScheduler';
import { Storage } from '../utils/storage';

export const useDeadliner = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [profile, setProfile] = useState<StudyProfile>(Storage.getProfile());
  const [timerSessions, setTimerSessions] = useState<TimerSession[]>([]);
  const [wallet, setWallet] = useState<UserWallet>(Storage.getWallet());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedAssignments = Storage.getAssignments();
    const savedTasks = Storage.getTasks();
    const savedSessions = Storage.getTimerSessions();
    const savedWallet = Storage.getWallet();
    setAssignments(savedAssignments);
    setTasks(savedTasks);
    setTimerSessions(savedSessions);
    setWallet(savedWallet);
  }, []);

  const addAssignment = async (assignment: Omit<Assignment, 'id' | 'createdAt' | 'completed'>) => {
    setLoading(true);
    
    const newAssignment: Assignment = {
      ...assignment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      completed: false
    };

    const newTasks = AIScheduler.generateTaskBreakdown(newAssignment, profile);
    
    const updatedAssignments = [...assignments, newAssignment];
    const updatedTasks = [...tasks, ...newTasks];
    
    setAssignments(updatedAssignments);
    setTasks(updatedTasks);
    
    Storage.saveAssignments(updatedAssignments);
    Storage.saveTasks(updatedTasks);
    
    setLoading(false);
  };

  const completeTask = (taskId: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    );
    setTasks(updatedTasks);
    Storage.saveTasks(updatedTasks);
  };

  const rescheduleTask = (taskId: string, newDate: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? AIScheduler.rescheduleTask(task, newDate) : task
    );
    setTasks(updatedTasks);
    Storage.saveTasks(updatedTasks);
  };

  const getDailyPlan = (date: string): DayPlan => {
    return AIScheduler.generateDailyPlan(tasks, date);
  };

  const getUpcomingTasks = (days: number = 7): Task[] => {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);
    
    return tasks
      .filter(task => {
        const taskDate = new Date(task.scheduledDate);
        return !task.completed && taskDate >= today && taskDate <= futureDate;
      })
      .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
  };

  const getStats = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const upcomingDeadlines = assignments.filter(a => {
      const dueDate = new Date(a.dueDate);
      const today = new Date();
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7 && diffDays >= 0;
    }).length;
    
    return {
      totalTasks,
      completedTasks,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
      upcomingDeadlines
    };
  };

  const updateProfile = (newProfile: StudyProfile) => {
    setProfile(newProfile);
    Storage.saveProfile(newProfile);
  };

  const exportSchedule = () => {
    Storage.exportToPDF();
  };

  const addTimerSession = (session: TimerSession) => {
    const updatedSessions = [...timerSessions, session];
    setTimerSessions(updatedSessions);
    Storage.saveTimerSessions(updatedSessions);
  };

  const addPoints = (points: number) => {
    const updatedWallet = {
      ...wallet,
      totalPoints: wallet.totalPoints + points,
      sessionsCompleted: wallet.sessionsCompleted + 1,
      totalStudyTime: wallet.totalStudyTime + (points * 360) // Approximate seconds from points
    };
    setWallet(updatedWallet);
    Storage.saveWallet(updatedWallet);
  };

  const redeemReward = (tier: RewardTier) => {
    if (wallet.totalPoints >= tier.points) {
      const redemption = {
        id: Date.now().toString(),
        points: tier.points,
        amount: tier.amount,
        redeemedAt: new Date().toISOString()
      };

      const updatedWallet = {
        ...wallet,
        totalPoints: wallet.totalPoints - tier.points,
        totalEarnings: wallet.totalEarnings + tier.amount,
        rewardsRedeemed: [...wallet.rewardsRedeemed, redemption]
      };
      
      setWallet(updatedWallet);
      Storage.saveWallet(updatedWallet);
    }
  };

  return {
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
    redeemReward
  };
};