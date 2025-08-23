export interface Assignment {
  id: string;
  title: string;
  subject: string;
  type: 'assignment' | 'exam' | 'project';
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  estimatedHours: number;
  description?: string;
  completed: boolean;
  createdAt: string;
}

export interface Task {
  id: string;
  assignmentId: string;
  title: string;
  description: string;
  scheduledDate: string;
  duration: number; // in minutes
  completed: boolean;
  type: 'study' | 'assignment' | 'reminder';
  priority: 'low' | 'medium' | 'high';
}

export interface StudyProfile {
  dailyStudyHours: number;
  preferredStudyTimes: string[];
  subjects: string[];
  studyStyle: 'focused' | 'distributed';
}

export interface DayPlan {
  date: string;
  tasks: Task[];
  totalStudyTime: number;
  completed: boolean;
}

export interface TimerSession {
  id: string;
  taskId?: string;
  taskTitle: string;
  startTime: string;
  endTime?: string;
  duration: number; // in seconds
  pointsEarned: number;
  completed: boolean;
}

export interface UserWallet {
  totalPoints: number;
  totalEarnings: number;
  sessionsCompleted: number;
  totalStudyTime: number; // in seconds
  rewardsRedeemed: RewardRedemption[];
}

export interface RewardTier {
  points: number;
  amount: number;
  label: string;
  color: string;
}

export interface RewardRedemption {
  id: string;
  points: number;
  amount: number;
  redeemedAt: string;
}