import { useState, useEffect } from 'react';
import { Assignment, Task, StudyProfile, DayPlan, TimerSession, UserWallet, RewardTier } from '../types';
import { ApiService } from '../services/api';
import { Storage } from '../utils/storage'; // Keep for fallback

export const useDeadliner = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [profile, setProfile] = useState<StudyProfile>({
    dailyStudyHours: 4,
    preferredStudyTimes: ['morning', 'evening'],
    subjects: ['Math', 'Science', 'History', 'English'],
    studyStyle: 'distributed'
  });
  const [timerSessions, setTimerSessions] = useState<TimerSession[]>([]);
  const [wallet, setWallet] = useState<UserWallet>({
    totalPoints: 0,
    totalEarnings: 0,
    sessionsCompleted: 0,
    totalStudyTime: 0,
    rewardsRedeemed: []
  });
  const [loading, setLoading] = useState(false);
  const [useBackend, setUseBackend] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      if (useBackend) {
        // Try to load from backend
        const [assignmentsData, tasksData, profileData, sessionsData, walletData] = await Promise.all([
          ApiService.getAssignments(),
          ApiService.getTasks(),
          ApiService.getProfile(),
          ApiService.getTimerSessions(),
          ApiService.getWallet()
        ]);
        
        setAssignments(assignmentsData);
        setTasks(tasksData);
        setProfile(profileData);
        setTimerSessions(sessionsData);
        setWallet(walletData);
      } else {
        // Fallback to local storage
        const savedAssignments = Storage.getAssignments();
        const savedTasks = Storage.getTasks();
        const savedSessions = Storage.getTimerSessions();
        const savedWallet = Storage.getWallet();
        const savedProfile = Storage.getProfile();
        
        setAssignments(savedAssignments);
        setTasks(savedTasks);
        setTimerSessions(savedSessions);
        setWallet(savedWallet);
        setProfile(savedProfile);
      }
    } catch (error) {
      console.error('Failed to load from backend, using local storage:', error);
      setUseBackend(false);
      // Load from local storage as fallback
      const savedAssignments = Storage.getAssignments();
      const savedTasks = Storage.getTasks();
      const savedSessions = Storage.getTimerSessions();
      const savedWallet = Storage.getWallet();
      const savedProfile = Storage.getProfile();
      
      setAssignments(savedAssignments);
      setTasks(savedTasks);
      setTimerSessions(savedSessions);
      setWallet(savedWallet);
      setProfile(savedProfile);
    }
  };
  const addAssignment = async (assignment: Omit<Assignment, 'id' | 'createdAt' | 'completed'>) => {
    setLoading(true);
    try {
      if (useBackend) {
        await ApiService.createAssignment(assignment);
        await loadData(); // Reload all data
      } else {
        // Fallback to local storage logic
        const newAssignment: Assignment = {
          ...assignment,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          completed: false
        };
        const updatedAssignments = [...assignments, newAssignment];
        setAssignments(updatedAssignments);
        Storage.saveAssignments(updatedAssignments);
      }
    } catch (error) {
      console.error('Error adding assignment:', error);
    }
    setLoading(false);
  };

  const completeTask = (taskId: string) => {
    try {
      if (useBackend) {
        ApiService.completeTask(taskId);
      }
      const updatedTasks = tasks.map(task => 
        task.id === taskId ? { ...task, completed: true } : task
      );
      setTasks(updatedTasks);
      Storage.saveTasks(updatedTasks);
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const rescheduleTask = (taskId: string, newDate: string) => {
    try {
      if (useBackend) {
        ApiService.rescheduleTask(taskId, newDate);
      }
      const updatedTasks = tasks.map(task => 
        task.id === taskId ? { ...task, scheduledDate: newDate, completed: false } : task
      );
      setTasks(updatedTasks);
      Storage.saveTasks(updatedTasks);
    } catch (error) {
      console.error('Error rescheduling task:', error);
    }
  };

  const getDailyPlan = (date: string): DayPlan => {
    const dayTasks = tasks.filter(task => task.scheduledDate === date);
    const totalTime = dayTasks.reduce((sum, task) => sum + task.duration, 0);
    
    return {
      date,
      tasks: dayTasks.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }),
      totalStudyTime: totalTime,
      completed: dayTasks.every(task => task.completed)
    };
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
    try {
      if (useBackend) {
        ApiService.updateProfile(newProfile);
      }
      setProfile(newProfile);
      Storage.saveProfile(newProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const exportSchedule = () => {
    Storage.exportToPDF();
  };

  const addTimerSession = (session: TimerSession) => {
    try {
      if (useBackend) {
        ApiService.createTimerSession(session);
      }
      const updatedSessions = [...timerSessions, session];
      setTimerSessions(updatedSessions);
      Storage.saveTimerSessions(updatedSessions);
    } catch (error) {
      console.error('Error adding timer session:', error);
    }
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
    try {
      if (wallet.totalPoints >= tier.points) {
        if (useBackend) {
          ApiService.redeemReward(tier.points, tier.amount);
        }
        
        const redemption = {
          id: Date.now().toString(),
          points: tier.points,
          amount: tier.amount,
          redeemedAt: new Date().toISOString()
        };
    }
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
    } catch (error) {
      console.error('Error redeeming reward:', error);
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
    redeemReward,
    useBackend
  };
};