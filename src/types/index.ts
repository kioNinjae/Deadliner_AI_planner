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